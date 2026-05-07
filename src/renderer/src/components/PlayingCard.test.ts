import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import PlayingCard from './PlayingCard.vue'
import type { Card } from '../engine/types'

const heartAce: Card = { id: 'hearts_1', suit: 'hearts', rank: 1, faceUp: true }
const clubKing: Card = { id: 'clubs_13', suit: 'clubs', rank: 13, faceUp: true }
const faceDown: Card = { id: 'spades_5', suit: 'spades', rank: 5, faceUp: false }

describe('PlayingCard', () => {
  it('renders rank and suit for face-up card', () => {
    const wrapper = mount(PlayingCard, { props: { card: heartAce } })
    expect(wrapper.text()).toContain('A')
    expect(wrapper.text()).toContain('♥')
  })

  it('applies rank-red class for hearts', () => {
    const wrapper = mount(PlayingCard, { props: { card: heartAce } })
    expect(wrapper.find('.rank-red').exists()).toBe(true)
  })

  it('applies rank-black class for clubs', () => {
    const wrapper = mount(PlayingCard, { props: { card: clubKing } })
    expect(wrapper.find('.rank-black').exists()).toBe(true)
  })

  it('shows face-down class when card is face-down', () => {
    const wrapper = mount(PlayingCard, { props: { card: faceDown } })
    expect(wrapper.classes()).toContain('face-down')
    expect(wrapper.find('.card-corner').exists()).toBe(false)
  })

  it('emits dbl-click on double click when face-up', async () => {
    const wrapper = mount(PlayingCard, { props: { card: heartAce, draggable: true } })
    await wrapper.trigger('dblclick')
    expect(wrapper.emitted('dbl-click')).toBeTruthy()
    expect(wrapper.emitted('dbl-click')![0]).toEqual([heartAce])
  })

  it('does not emit dbl-click when face-down', async () => {
    const wrapper = mount(PlayingCard, { props: { card: faceDown } })
    await wrapper.trigger('dblclick')
    expect(wrapper.emitted('dbl-click')).toBeFalsy()
  })

  it('emits drag-start on dragstart when face-up and draggable', async () => {
    const wrapper = mount(PlayingCard, { props: { card: heartAce, draggable: true } })
    const mockDataTransfer = { setData: vi.fn() }
    await wrapper.trigger('dragstart', { dataTransfer: mockDataTransfer })
    expect(wrapper.emitted('drag-start')).toBeTruthy()
  })

  it('shows card-back-pattern when face-down', () => {
    const wrapper = mount(PlayingCard, { props: { card: faceDown } })
    expect(wrapper.find('.card-back-pattern').exists()).toBe(true)
  })

  it('renders King label correctly', () => {
    const wrapper = mount(PlayingCard, { props: { card: clubKing } })
    expect(wrapper.text()).toContain('K')
  })

  it('applies dragging class when isDragging is true', () => {
    const wrapper = mount(PlayingCard, { props: { card: heartAce, isDragging: true } })
    expect(wrapper.classes()).toContain('dragging')
  })

  it('applies drop-active class when isDropTarget is true', () => {
    const wrapper = mount(PlayingCard, { props: { card: heartAce, isDropTarget: true } })
    expect(wrapper.classes()).toContain('drop-active')
  })
})
