// =====================================================
// Canfield Solitaire – Game Engine
// =====================================================

import { Card, GameState, Rank, Suit, SUITS, RANKS, suitColor, ZoneId } from './types'

// ---- Deck helpers ----

export function buildDeck(): Card[] {
  const deck: Card[] = []
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      deck.push({ id: `${suit}_${rank}`, suit, rank, faceUp: false })
    }
  }
  return deck
}

/** Fisher-Yates shuffle (mutates in place) */
export function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// ---- New Game ----

export function newGame(drawCount: 1 | 3 = 3): GameState {
  const deck = shuffle(buildDeck())

  // Deal 13 to reserve (top card face up)
  const reserve = deck.splice(0, 13)
  reserve[reserve.length - 1].faceUp = true

  // Deal 1 to the first foundation – its rank is the base rank
  const firstFoundationCard = deck.splice(0, 1)[0]
  firstFoundationCard.faceUp = true
  const baseRank = firstFoundationCard.rank

  // Deal 4 face-up to tableau
  const tableau: Card[][] = [[], [], [], []]
  for (let i = 0; i < 4; i++) {
    const card = deck.splice(0, 1)[0]
    card.faceUp = true
    tableau[i].push(card)
  }

  // Deal 34 go to stock (face down)
  const stock = deck // all still faceUp=false

  const firstSuit = firstFoundationCard.suit
  const foundationSuits = [firstSuit, ...SUITS.filter((s) => s !== firstSuit)]

  return {
    baseRank,
    foundationSuits,
    foundations: [[firstFoundationCard], [], [], []],
    tableau,
    reserve,
    stock,
    waste: [],
    drawCount,
    moves: 0,
    elapsedMs: 0,
    won: false
  }
}

// ---- Rank arithmetic (wrapping) ----

/** Next rank wrapping K→A */
export function nextRank(rank: Rank): Rank {
  return ((rank % 13) + 1) as Rank
}

/** Previous rank wrapping A→K */
export function prevRank(rank: Rank): Rank {
  return (((rank - 2 + 13) % 13) + 1) as Rank
}

// ---- Validation ----

/** Can `card` be placed on top of a Foundation pile? */
export function canPlaceOnFoundation(
  card: Card,
  pile: Card[],
  baseRank: Rank,
  expectedSuit: Suit
): boolean {
  if (card.suit !== expectedSuit) return false

  if (pile.length === 0) {
    return card.rank === baseRank
  }
  const top = pile[pile.length - 1]
  return card.rank === nextRank(top.rank)
}

/** Can `card` be placed on top of a Tableau column? */
export function canPlaceOnTableau(card: Card, column: Card[]): boolean {
  if (column.length === 0) return true // empty column always accepts
  const top = column[column.length - 1]
  return suitColor(card.suit) !== suitColor(top.suit) && card.rank === prevRank(top.rank)
}

// ---- Exposed card helpers ----

/** Index of the first face-up card in a tableau column (start of moveable sequence) */
export function firstFaceUpIndex(column: Card[]): number {
  for (let i = 0; i < column.length; i++) {
    if (column[i].faceUp) return i
  }
  return column.length // no face-up cards
}

// ---- Moves ----

/** Draw from stock → waste */
export function drawFromStock(state: GameState): GameState | null {
  if (state.stock.length === 0) return null
  const s = cloneState(state)
  const count = Math.min(s.drawCount, s.stock.length)
  const drawn = s.stock.splice(s.stock.length - count, count)
  drawn.forEach((c) => (c.faceUp = true))
  s.waste.push(...drawn.reverse())
  s.moves++
  return s
}

/** Redeal: flip waste back into stock */
export function redealStock(state: GameState): GameState | null {
  if (state.stock.length > 0) return null // stock not empty
  if (state.waste.length === 0) return null
  const s = cloneState(state)
  const newStock = s.waste.reverse()
  newStock.forEach((c) => (c.faceUp = false))
  s.stock = newStock
  s.waste = []
  s.moves++
  return s
}

/** Move a single card to a Foundation */
export function moveToFoundation(
  state: GameState,
  sourceZone: ZoneId,
  foundationIndex: number
): GameState | null {
  const s = cloneState(state)
  const pile = s.foundations[foundationIndex]
  const card = topCardOf(s, sourceZone)
  if (!card) return null
  const expectedSuit = s.foundationSuits[foundationIndex]
  if (!canPlaceOnFoundation(card, pile, s.baseRank, expectedSuit)) return null

  removeTopCard(s, sourceZone)
  card.faceUp = true
  pile.push(card)
  s.moves++
  autoFillEmptyTableau(s)
  s.won = checkWin(s)
  return s
}

/** Move card(s) from one tableau column to another */
export function moveTableauToTableau(
  state: GameState,
  fromCol: number,
  fromIndex: number,
  toCol: number
): GameState | null {
  const s = cloneState(state)
  const from = s.tableau[fromCol]
  const to = s.tableau[toCol]
  const movingCards = from.slice(fromIndex)
  if (movingCards.length === 0) return null
  if (!movingCards[0].faceUp) return null
  const bottomMoving = movingCards[0]
  if (!canPlaceOnTableau(bottomMoving, to)) return null

  s.tableau[fromCol] = from.slice(0, fromIndex)
  // Reveal card below if needed
  if (s.tableau[fromCol].length > 0) {
    s.tableau[fromCol][s.tableau[fromCol].length - 1].faceUp = true
  }
  movingCards.forEach((c) => to.push(c))
  s.moves++
  autoFillEmptyTableau(s)
  return s
}

/** Move top card from waste/reserve to a tableau column */
export function moveToTableau(
  state: GameState,
  sourceZone: ZoneId,
  toCol: number
): GameState | null {
  const s = cloneState(state)
  const card = topCardOf(s, sourceZone)
  if (!card) return null
  const to = s.tableau[toCol]
  if (!canPlaceOnTableau(card, to)) return null

  removeTopCard(s, sourceZone)
  card.faceUp = true
  to.push(card)
  s.moves++
  autoFillEmptyTableau(s)
  return s
}

/** Auto-move a card from its source zone to the first matching foundation */
export function autoMoveToFoundation(state: GameState, sourceZone: ZoneId): GameState | null {
  const s = cloneState(state)
  const card = topCardOf(s, sourceZone)
  if (!card) return null

  // Find a foundation that accepts this card
  for (let i = 0; i < 4; i++) {
    const result = moveToFoundation(s, sourceZone, i)
    if (result) return result
  }
  return null
}

// ---- Win check ----

export function checkWin(state: GameState): boolean {
  return state.foundations.reduce((acc, pile) => acc + pile.length, 0) === 52
}

// ---- Serialisation ----

export function serialise(state: GameState): string {
  return JSON.stringify(state)
}

export function deserialise(json: string): GameState {
  return JSON.parse(json) as GameState
}

// ---- Private helpers ----

function cloneState(state: GameState): GameState {
  return JSON.parse(JSON.stringify(state)) as GameState
}

function topCardOf(state: GameState, zone: ZoneId): Card | null {
  if (zone === 'waste') {
    return state.waste.length > 0 ? state.waste[state.waste.length - 1] : null
  }
  if (zone === 'reserve') {
    return state.reserve.length > 0 ? state.reserve[state.reserve.length - 1] : null
  }
  if (zone.startsWith('tableau_')) {
    const col = parseInt(zone.split('_')[1])
    const column = state.tableau[col]
    return column.length > 0 ? column[column.length - 1] : null
  }
  if (zone.startsWith('foundation_')) {
    const idx = parseInt(zone.split('_')[1])
    const pile = state.foundations[idx]
    return pile.length > 0 ? pile[pile.length - 1] : null
  }
  return null
}

function removeTopCard(state: GameState, zone: ZoneId): void {
  if (zone === 'waste') {
    state.waste.pop()
  } else if (zone === 'reserve') {
    state.reserve.pop()
    // Reveal next reserve card
    if (state.reserve.length > 0) {
      state.reserve[state.reserve.length - 1].faceUp = true
    }
  } else if (zone.startsWith('tableau_')) {
    const col = parseInt(zone.split('_')[1])
    state.tableau[col].pop()
    // Reveal card below
    const column = state.tableau[col]
    if (column.length > 0) column[column.length - 1].faceUp = true
  }
}

/** If any tableau column is empty and reserve has cards, fill it automatically */
function autoFillEmptyTableau(state: GameState): void {
  if (state.reserve.length === 0) return
  for (let i = 0; i < 4; i++) {
    if (state.tableau[i].length === 0 && state.reserve.length > 0) {
      const card = state.reserve.pop()!
      card.faceUp = true
      state.tableau[i].push(card)
      // Reveal new top of reserve
      if (state.reserve.length > 0) {
        state.reserve[state.reserve.length - 1].faceUp = true
      }
    }
  }
}
