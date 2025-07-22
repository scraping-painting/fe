import { delay } from '@hn/utils/common'
import { act, renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { useHandleClick } from '.'

describe('useHandleClick', () => {
  it('Click handler được gọi khi click', async () => {
    const mockFn = vi.fn()
    const { result } = renderHook(() => {
      return useHandleClick({
        handleClick: mockFn
      })
    })

    // Giả lập hành vi click
    act(() => {
      result.current({ type: 'click' })
    })

    // Chờ 300ms để handler được gọi
    await delay(300)
    expect(mockFn).toHaveBeenCalled()
  })

  it('Double-click handler được gọi khi double click', async () => {
    const mockFn = vi.fn()
    const { result } = renderHook(() => {
      return useHandleClick({
        handleDblClick: mockFn
      })
    })

    // Giả lập hành vi click
    act(() => {
      result.current({ type: 'click' })
      result.current({ type: 'click' })
    })

    // Chờ 300ms để handler được gọi
    await delay(300)
    expect(mockFn).toHaveBeenCalled()
  })

  it('Click handler không gọi khi double click', async () => {
    const mockClick = vi.fn()
    const mockDblClick = vi.fn()

    const { result } = renderHook(() => {
      return useHandleClick({
        handleClick: mockClick,
        handleDblClick: mockDblClick
      })
    })

    // Giả lập hành vi click
    act(() => {
      result.current({ type: 'click' })
      result.current({ type: 'click' })
    })

    // Chờ 300ms để handler được gọi
    await delay(300)
    expect(mockClick).not.toHaveBeenCalled()
    expect(mockDblClick).toHaveBeenCalled()
  })
})
