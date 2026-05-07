import { describe, it, expect } from 'vitest'
import {
  buildDeck,
  shuffle,
  newGame,
  nextRank,
  prevRank,
  canPlaceOnFoundation,
  canPlaceOnTableau,
  drawFromStock,
  redealStock,
  moveToFoundation,
  moveTableauToTableau,
  moveToTableau,
  autoMoveToFoundation,
  checkWin,
  serialise,
  deserialise,
  firstFaceUpIndex
} from '../engine/CanfieldEngine'
import { Card, GameState, Rank, Suit } from '../engine/types'

// ---- Helpers ----
function makeCard(rank: Rank, suit: Suit, faceUp = true): Card {
  return { id: `${suit}_${rank}`, suit, rank, faceUp }
}

function makeState(overrides: Partial<GameState> = {}): GameState {
  return {
    baseRank: 1,
    foundations: [[], [], [], []],
    tableau: [[], [], [], []],
    reserve: [],
    stock: [],
    waste: [],
    drawCount: 3,
    moves: 0,
    elapsedMs: 0,
    won: false,
    foundationSuits: ['hearts', 'diamonds', 'clubs', 'spades'],
    ...overrides
  }
}

// ---- buildDeck ----
describe('buildDeck', () => {
  it('generates 52 unique cards', () => {
    const deck = buildDeck()
    expect(deck).toHaveLength(52)
    const ids = deck.map((c) => c.id)
    expect(new Set(ids).size).toBe(52)
  })
  it('all cards start face-down', () => {
    expect(buildDeck().every((c) => !c.faceUp)).toBe(true)
  })
})

// ---- shuffle ----
describe('shuffle', () => {
  it('returns same length array', () => {
    const arr = [1, 2, 3, 4, 5]
    expect(shuffle([...arr])).toHaveLength(5)
  })
  it('contains all original elements', () => {
    const arr = [1, 2, 3, 4, 5]
    expect(shuffle([...arr]).sort()).toEqual([...arr].sort())
  })
})

// ---- newGame ----
describe('newGame', () => {
  it('deals correct card counts', () => {
    const state = newGame(3)
    expect(state.reserve).toHaveLength(13)
    expect(state.foundations[0]).toHaveLength(1)
    expect(state.foundations[1]).toHaveLength(0)
    expect(state.tableau).toHaveLength(4)
    state.tableau.forEach((col) => expect(col).toHaveLength(1))
    expect(state.stock).toHaveLength(34)
    expect(state.waste).toHaveLength(0)
  })
  it('top of reserve is face-up', () => {
    const state = newGame()
    expect(state.reserve[state.reserve.length - 1].faceUp).toBe(true)
  })
  it('foundation base card is face-up', () => {
    const state = newGame()
    expect(state.foundations[0][0].faceUp).toBe(true)
  })
  it('baseRank matches first foundation card', () => {
    const state = newGame()
    expect(state.foundations[0][0].rank).toBe(state.baseRank)
  })
  it('uses provided drawCount', () => {
    expect(newGame(1).drawCount).toBe(1)
    expect(newGame(3).drawCount).toBe(3)
  })
  it('total card count is 52', () => {
    const s = newGame()
    const total =
      s.stock.length +
      s.waste.length +
      s.reserve.length +
      s.foundations.reduce((a, p) => a + p.length, 0) +
      s.tableau.reduce((a, c) => a + c.length, 0)
    expect(total).toBe(52)
  })
})

// ---- Rank arithmetic ----
describe('nextRank', () => {
  it('increments normally', () => expect(nextRank(5)).toBe(6))
  it('wraps King to Ace', () => expect(nextRank(13)).toBe(1))
})

describe('prevRank', () => {
  it('decrements normally', () => expect(prevRank(5)).toBe(4))
  it('wraps Ace to King', () => expect(prevRank(1)).toBe(13))
})

// ---- canPlaceOnFoundation ----
describe('canPlaceOnFoundation', () => {
  it('accepts base rank on empty pile', () => {
    const card = makeCard(7, 'hearts')
    expect(canPlaceOnFoundation(card, [], 7, 'hearts')).toBe(true)
  })
  it('rejects non-base rank on empty pile', () => {
    expect(canPlaceOnFoundation(makeCard(8, 'hearts'), [], 7, 'hearts')).toBe(false)
  })
  it('rejects wrong suit on empty pile', () => {
    expect(canPlaceOnFoundation(makeCard(7, 'diamonds'), [], 7, 'hearts')).toBe(false)
  })
  it('accepts next rank same suit', () => {
    const pile = [makeCard(7, 'hearts')]
    expect(canPlaceOnFoundation(makeCard(8, 'hearts'), pile, 7, 'hearts')).toBe(true)
  })
  it('rejects wrong suit', () => {
    const pile = [makeCard(7, 'hearts')]
    expect(canPlaceOnFoundation(makeCard(8, 'clubs'), pile, 7, 'hearts')).toBe(false)
  })
  it('rejects wrong rank', () => {
    const pile = [makeCard(7, 'hearts')]
    expect(canPlaceOnFoundation(makeCard(9, 'hearts'), pile, 7, 'hearts')).toBe(false)
  })
  it('wraps King→Ace correctly', () => {
    const pile = [makeCard(13, 'hearts')]
    expect(canPlaceOnFoundation(makeCard(1, 'hearts'), pile, 7, 'hearts')).toBe(true)
  })
})

// ---- canPlaceOnTableau ----
describe('canPlaceOnTableau', () => {
  it('accepts anything on empty column', () => {
    expect(canPlaceOnTableau(makeCard(5, 'hearts'), [])).toBe(true)
  })
  it('accepts alternating color, one lower', () => {
    const top = makeCard(8, 'hearts') // red
    const card = makeCard(7, 'clubs') // black, 7 < 8
    expect(canPlaceOnTableau(card, [top])).toBe(true)
  })
  it('rejects same color', () => {
    const top = makeCard(8, 'hearts') // red
    const card = makeCard(7, 'diamonds') // also red
    expect(canPlaceOnTableau(card, [top])).toBe(false)
  })
  it('rejects wrong rank', () => {
    const top = makeCard(8, 'hearts')
    const card = makeCard(6, 'clubs') // 6 is not 7
    expect(canPlaceOnTableau(card, [top])).toBe(false)
  })
  it('wraps Ace onto King', () => {
    const top = makeCard(1, 'hearts') // red Ace
    const card = makeCard(13, 'clubs') // black King, 13 == prevRank(1)
    expect(canPlaceOnTableau(card, [top])).toBe(true)
  })
})

// ---- drawFromStock ----
describe('drawFromStock', () => {
  it('returns null when stock is empty', () => {
    expect(drawFromStock(makeState())).toBeNull()
  })
  it('draws up to drawCount cards', () => {
    const stock = [
      makeCard(1, 'hearts', false),
      makeCard(2, 'clubs', false),
      makeCard(3, 'diamonds', false)
    ]
    const state = makeState({ stock: [...stock], drawCount: 3 })
    const next = drawFromStock(state)!
    expect(next.waste).toHaveLength(3)
    expect(next.stock).toHaveLength(0)
  })
  it('draws fewer cards if stock is smaller than drawCount', () => {
    const state = makeState({ stock: [makeCard(1, 'hearts', false)], drawCount: 3 })
    const next = drawFromStock(state)!
    expect(next.waste).toHaveLength(1)
  })
  it('increments move count', () => {
    const state = makeState({ stock: [makeCard(1, 'hearts', false)] })
    expect(drawFromStock(state)!.moves).toBe(1)
  })
  it('drawn cards are face-up', () => {
    const state = makeState({ stock: [makeCard(1, 'hearts', false)], drawCount: 1 })
    expect(drawFromStock(state)!.waste[0].faceUp).toBe(true)
  })
})

// ---- redealStock ----
describe('redealStock', () => {
  it('returns null when stock is not empty', () => {
    const state = makeState({
      stock: [makeCard(1, 'hearts', false)],
      waste: [makeCard(2, 'clubs')]
    })
    expect(redealStock(state)).toBeNull()
  })
  it('returns null when waste is empty', () => {
    expect(redealStock(makeState())).toBeNull()
  })
  it('flips waste into stock', () => {
    const waste = [makeCard(1, 'hearts'), makeCard(2, 'clubs'), makeCard(3, 'diamonds')]
    const state = makeState({ stock: [], waste })
    const next = redealStock(state)!
    expect(next.stock).toHaveLength(3)
    expect(next.waste).toHaveLength(0)
  })
  it('new stock is face-down', () => {
    const state = makeState({ stock: [], waste: [makeCard(1, 'hearts', true)] })
    const next = redealStock(state)!
    expect(next.stock.every((c) => !c.faceUp)).toBe(true)
  })
})

// ---- moveToFoundation ----
describe('moveToFoundation', () => {
  it('moves a valid card from waste to foundation', () => {
    const baseCard = makeCard(1, 'hearts')
    const twoHearts = makeCard(2, 'hearts')
    const state = makeState({
      baseRank: 1,
      foundations: [[baseCard], [], [], []],
      waste: [twoHearts]
    })
    const next = moveToFoundation(state, 'waste', 0)!
    expect(next.foundations[0]).toHaveLength(2)
    expect(next.waste).toHaveLength(0)
  })
  it('returns null for invalid move', () => {
    const state = makeState({
      baseRank: 1,
      foundations: [[], [], [], []],
      waste: [makeCard(3, 'hearts')]
    })
    expect(moveToFoundation(state, 'waste', 0)).toBeNull()
  })
})

// ---- moveTableauToTableau ----
describe('moveTableauToTableau', () => {
  it('moves a valid card between columns', () => {
    const redQ = makeCard(12, 'hearts')
    const blackJ = makeCard(11, 'clubs')
    const state = makeState({
      tableau: [[redQ], [blackJ], [], []]
    })
    const next = moveTableauToTableau(state, 1, 0, 0)!
    expect(next.tableau[0]).toHaveLength(2)
    expect(next.tableau[1]).toHaveLength(0)
  })
  it('returns null for invalid move', () => {
    const redQ = makeCard(12, 'hearts')
    const redJ = makeCard(11, 'diamonds')
    const state = makeState({ tableau: [[redQ], [redJ], [], []] })
    expect(moveTableauToTableau(state, 1, 0, 0)).toBeNull()
  })
  it('moves a multi-card sequence', () => {
    const redQ = makeCard(12, 'hearts')
    const blackJ = makeCard(11, 'clubs')
    const redTen = makeCard(10, 'diamonds')
    const state = makeState({ tableau: [[redQ], [blackJ, redTen], [], []] })
    const next = moveTableauToTableau(state, 1, 0, 0)!
    expect(next.tableau[0]).toHaveLength(3)
    expect(next.tableau[1]).toHaveLength(0)
  })
})

// ---- moveToTableau ----
describe('moveToTableau', () => {
  it('moves top of waste to valid tableau column', () => {
    const redQ = makeCard(12, 'hearts')
    const blackJ = makeCard(11, 'clubs')
    const state = makeState({ tableau: [[redQ], [], [], []], waste: [blackJ] })
    const next = moveToTableau(state, 'waste', 0)!
    expect(next.tableau[0]).toHaveLength(2)
    expect(next.waste).toHaveLength(0)
  })
  it('returns null for invalid move', () => {
    const redQ = makeCard(12, 'hearts')
    const redJ = makeCard(11, 'diamonds')
    const state = makeState({ tableau: [[redQ], [], [], []], waste: [redJ] })
    expect(moveToTableau(state, 'waste', 0)).toBeNull()
  })
})

// ---- autoMoveToFoundation ----
describe('autoMoveToFoundation', () => {
  it('moves a card to the correct foundation', () => {
    const baseCard = makeCard(1, 'hearts')
    const twoHearts = makeCard(2, 'hearts')
    const state = makeState({
      baseRank: 1,
      foundations: [[baseCard], [], [], []],
      waste: [twoHearts]
    })
    const next = autoMoveToFoundation(state, 'waste')!
    expect(next.foundations[0]).toHaveLength(2)
  })
  it('returns null if no foundation accepts the card', () => {
    const state = makeState({
      baseRank: 5,
      foundations: [[], [], [], []],
      waste: [makeCard(3, 'hearts')]
    })
    expect(autoMoveToFoundation(state, 'waste')).toBeNull()
  })
})

// ---- checkWin ----
describe('checkWin', () => {
  it('returns false if not all 52 cards in foundations', () => {
    const state = makeState({ foundations: [[makeCard(1, 'hearts')], [], [], []] })
    expect(checkWin(state)).toBe(false)
  })
  it('returns true when foundations have 52 cards', () => {
    // Build a state where all 52 cards are in foundations (13 per suit)
    const buildPile = (suit: 'hearts' | 'diamonds' | 'clubs' | 'spades'): Card[] =>
      ([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as Rank[]).map((r) => makeCard(r, suit))
    const state = makeState({
      foundations: [
        buildPile('hearts'),
        buildPile('diamonds'),
        buildPile('clubs'),
        buildPile('spades')
      ]
    })
    expect(checkWin(state)).toBe(true)
  })
})

// ---- Serialisation ----
describe('serialise / deserialise', () => {
  it('round-trips game state', () => {
    const state = newGame()
    const restored = deserialise(serialise(state))
    expect(restored.baseRank).toBe(state.baseRank)
    expect(restored.stock.length).toBe(state.stock.length)
  })
})

// ---- firstFaceUpIndex ----
describe('firstFaceUpIndex', () => {
  it('returns correct index', () => {
    const col = [makeCard(5, 'hearts', false), makeCard(6, 'clubs', true)]
    expect(firstFaceUpIndex(col)).toBe(1)
  })
  it('returns column length when no face-up cards', () => {
    const col = [makeCard(5, 'hearts', false)]
    expect(firstFaceUpIndex(col)).toBe(1)
  })
})

// ---- Auto-fill empty tableau ----
describe('auto-fill empty tableau from reserve', () => {
  it('fills empty tableau column after move', () => {
    const reserveCard = makeCard(9, 'diamonds', true)
    const topCard = makeCard(5, 'hearts')
    // col 0 has one card, col 1 is empty – move col0 top somewhere
    const state = makeState({
      reserve: [reserveCard],
      tableau: [[topCard], [], [], []],
      waste: [],
      baseRank: 1,
      foundations: [[], [], [], []]
    })
    // Move top of col 0 to col 1 (empty, so valid)
    const next = moveTableauToTableau(state, 0, 0, 1)!
    // After moving, col0 is empty → should be filled from reserve
    expect(next.tableau[0]).toHaveLength(1)
    expect(next.tableau[0][0].id).toBe(reserveCard.id)
  })
})
