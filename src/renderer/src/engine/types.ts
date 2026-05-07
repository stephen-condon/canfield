// =====================================================
// Canfield Solitaire – Core Types
// =====================================================

export type Suit = 'hearts' | 'diamonds' | 'clubs' | 'spades'
export type Color = 'red' | 'black'
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13

export const SUITS: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades']
export const RANKS: Rank[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]

export function suitColor(suit: Suit): Color {
  return suit === 'hearts' || suit === 'diamonds' ? 'red' : 'black'
}

export interface Card {
  id: string // e.g. "hearts_1"
  suit: Suit
  rank: Rank
  faceUp: boolean
}

/** Where on the board a card lives */
export type ZoneId =
  | 'stock'
  | 'waste'
  | 'reserve'
  | `foundation_${number}` // 0-3
  | `tableau_${number}` // 0-3

export interface GameState {
  /** Rank that all foundations start on */
  baseRank: Rank
  /** Suits assigned to each foundation slot 0-3 */
  foundationSuits: Suit[]
  /** Foundation piles indexed 0-3 */
  foundations: Card[][]
  /** 4 tableau columns */
  tableau: Card[][]
  /** Reserve (demon) pile – index 0 is bottom, last is top */
  reserve: Card[]
  /** Stock pile – index 0 is bottom, last is top (click pops) */
  stock: Card[]
  /** Waste pile – index 0 is oldest, last is top */
  waste: Card[]
  /** How many to draw from stock per click */
  drawCount: 1 | 3
  /** Total valid moves made */
  moves: number
  /** Elapsed ms (timer is managed externally; engine stores snapshot on save) */
  elapsedMs: number
  /** Whether win has been detected */
  won: boolean
}
