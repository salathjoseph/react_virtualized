import React from 'react'
import { findDOMNode } from 'react-dom'
import { Simulate } from 'react-addons-test-utils'
import { render } from '../TestUtils'
import Masonry from './Masonry'
import { CellMeasurer, CellMeasurerCache } from '../CellMeasurer'

const ALTERNATING_CELL_HEIGHTS = [100, 50, 100, 150]
const CELL_SIZE_MULTIPLIER = 50
const COLUMN_COUNT = 3

function assertVisibleCells (rendered, text) {
  expect(
    Array.from(rendered.querySelectorAll('.cell'))
      .map(node => node.textContent)
      .sort()
      .join(',')
  ).toEqual(text)
}

function createCellMeasurerCache (props = {}) {
  return new CellMeasurerCache({
    defaultHeight: CELL_SIZE_MULTIPLIER,
    defaultWidth: CELL_SIZE_MULTIPLIER,
    fixedWidth: true,
    keyMapper: index => index,
    ...props
  })
}

function createCellPositioner (cache) {
  const columnHeights = []
  for (let i = 0; i < COLUMN_COUNT; i++) {
    columnHeights[i] = 0
  }

  return function cellPositioner (index) {
    // Super naive Masonry layout
    let columnIndex = 0
    for (let i = 1; i < columnHeights.length; i++) {
      if (columnHeights[i] < columnHeights[columnIndex]) {
        columnIndex = i
      }
    }

    const left = columnIndex * CELL_SIZE_MULTIPLIER
    const top = columnHeights[columnIndex] || 0

    columnHeights[columnIndex] = top + cache.getHeight(index)

    return {
      left,
      top
    }
  }
}

function createCellRenderer (cache, renderCallback) {
  renderCallback = typeof renderCallback === 'function'
    ? renderCallback
    : index => index

  return function cellRenderer ({ index, isScrolling, key, parent, style }) {
    const height = ALTERNATING_CELL_HEIGHTS[index % ALTERNATING_CELL_HEIGHTS.length]
    const width = CELL_SIZE_MULTIPLIER

    return (
      <CellMeasurer
        cache={cache}
        columnIndex={0}
        key={key}
        rowIndex={index}
        parent={parent}
      >
        <div
          className='cell'
          ref={ref => {
            if (ref) {
              // Accounts for the fact that JSDom doesn't support measurements.
              Object.defineProperty(ref, 'offsetHeight', {
                configurable: true,
                value: height
              })
              Object.defineProperty(ref, 'offsetWidth', {
                configurable: true,
                value: width
              })
            }
          }}
          style={{
            ...style,
            minHeight: height,
            minWidth: width
          }}
        >
          {renderCallback(index, { index, isScrolling, key, parent, style })}
        </div>
      </CellMeasurer>
    )
  }
}

function getMarkup (props = {}) {
  const cellMeasurerCache = props.cellMeasurerCache || createCellMeasurerCache()

  return (
    <Masonry
      cellCount={1000}
      cellMeasurerCache={cellMeasurerCache}
      cellPositioner={createCellPositioner(cellMeasurerCache)}
      cellRenderer={createCellRenderer(cellMeasurerCache)}
      columnCount={COLUMN_COUNT}
      height={CELL_SIZE_MULTIPLIER * 2}
      overscanByPixels={CELL_SIZE_MULTIPLIER}
      width={CELL_SIZE_MULTIPLIER * COLUMN_COUNT}
      {...props}
    />
  )
}

function simulateScroll (masonry, scrollTop = 0) {
  const target = { scrollTop }
  masonry._scrollingContainer = target // HACK to work around _onScroll target check
  Simulate.scroll(findDOMNode(masonry), { target })
}

describe('Masonry', () => {
  beforeEach(render.unmount)

  describe('layout and measuring', () => {
    it('should measure only enough cells required for initial render', () => {
      // avg cell size: CELL_SIZE_MULTIPLIER
      // width: CELL_SIZE_MULTIPLIER * 3
      // height: CELL_SIZE_MULTIPLIER * 2
      // overcsan by: CELL_SIZE_MULTIPLIER
      // Expected to measure 9 cells
      const cellMeasurerCache = createCellMeasurerCache()
      render(getMarkup({ cellMeasurerCache }))
      for (let i = 0; i <= 8; i++) {
        expect(cellMeasurerCache.has(i)).toBe(true)
      }
      expect(cellMeasurerCache.has(9)).toBe(false)
    })

    it('should not measure cells while scrolling until they are needed', () => {
      // Expected to measure 9 cells
      const cellMeasurerCache = createCellMeasurerCache()
      const renderCallback = jest.fn().mockImplementation(index => index)
      const cellRenderer = createCellRenderer(cellMeasurerCache, renderCallback)
      const rendered = findDOMNode(render(getMarkup({ cellMeasurerCache, cellRenderer })))
      renderCallback.mockClear()
      // Scroll a little bit, but not so much to require re-measuring
      simulateScroll(rendered, 51)
      // Verify that render was only called enough times to fill view port (no extra for measuring)
      expect(renderCallback).toHaveBeenCalledTimes(7)
    })

    it('should measure additional cells on scroll when it runs out of measured cells', () => {
      const cellMeasurerCache = createCellMeasurerCache()
      const rendered = findDOMNode(render(getMarkup({ cellMeasurerCache })))
      expect(cellMeasurerCache.has(9)).toBe(false)
      simulateScroll(rendered, 101)
      expect(cellMeasurerCache.has(9)).toBe(true)
      expect(cellMeasurerCache.has(10)).toBe(false)
    })

    it('should only render enough cells to fill the viewport plus overscanByPixels', () => {
      const rendered = findDOMNode(render(getMarkup()))
      assertVisibleCells(rendered, '0,1,2,3,4,5')
      simulateScroll(rendered, 51)
      assertVisibleCells(rendered, '0,1,2,3,4,5,6')
      simulateScroll(rendered, 101)
      assertVisibleCells(rendered, '0,2,3,4,5,6,7,8')
      simulateScroll(rendered, 1001)
      assertVisibleCells(rendered, '27,29,30,31,32,33,34,35')
    })
  })

  describe('recomputeCellPositions', () => {
    it('should refresh all cell positions', () => {
      const cellMeasurerCache = createCellMeasurerCache()
      let rendered = findDOMNode(render(getMarkup({ cellMeasurerCache })))
      assertVisibleCells(rendered, '0,1,2,3,4,5')
      const component = render(getMarkup({
        cellMeasurerCache,
        cellPositioner: index => ({
          left: 0,
          top: index * CELL_SIZE_MULTIPLIER
        })
      }))
      rendered = findDOMNode(component)
      assertVisibleCells(rendered, '0,1,2,3,4,5')
      component.recomputeCellPositions()
      assertVisibleCells(rendered, '0,1,2')
    })

    it('should not reset measurement cache', () => {
      const cellMeasurerCache = createCellMeasurerCache()
      const component = render(getMarkup({ cellMeasurerCache }))
      const rendered = findDOMNode(component)
      simulateScroll(rendered, 101)
      expect(cellMeasurerCache.has(9)).toBe(true)
      simulateScroll(rendered, 0)
      component.recomputeCellPositions()
      for (let i = 0; i <= 9; i++) {
        expect(cellMeasurerCache.has(i)).toBe(true)
      }
    })
  })

  describe('isScrolling', () => {
    it('should be true for cellRenderer while scrolling is in progress', () => {
      const cellMeasurerCache = createCellMeasurerCache()
      const renderCallback = jest.fn().mockImplementation(index => index)
      const cellRenderer = createCellRenderer(cellMeasurerCache, renderCallback)
      const rendered = findDOMNode(render(getMarkup({ cellMeasurerCache, cellRenderer })))
      renderCallback.mockClear()
      simulateScroll(rendered, 51)
      expect(renderCallback.mock.calls[0][1].isScrolling).toEqual(true)
    })

    it('should be reset after a small debounce when scrolling stops', () => {
      jest.useFakeTimers()
      const cellMeasurerCache = createCellMeasurerCache()
      const renderCallback = jest.fn().mockImplementation(index => index)
      const cellRenderer = createCellRenderer(cellMeasurerCache, renderCallback)
      const rendered = findDOMNode(render(getMarkup({ cellMeasurerCache, cellRenderer })))
      simulateScroll(rendered, 51)
      renderCallback.mockClear()
      jest.runOnlyPendingTimers()
      expect(renderCallback.mock.calls[0][1].isScrolling).toEqual(false)
    })
  })

  describe('callbacks', () => {
    it('should call onCellsRendered when rendered cells change', () => {
      const onCellsRendered = jest.fn()
      const rendered = findDOMNode(render(getMarkup({ onCellsRendered })))
      expect(onCellsRendered.mock.calls).toEqual([
        [{ startIndex: 0, stopIndex: 5 }]
      ])
      simulateScroll(rendered, 51)
      expect(onCellsRendered.mock.calls).toEqual([
        [{ startIndex: 0, stopIndex: 5 }],
        [{ startIndex: 0, stopIndex: 6 }]
      ])
      simulateScroll(rendered, 52)
      expect(onCellsRendered.mock.calls).toEqual([
        [{ startIndex: 0, stopIndex: 5 }],
        [{ startIndex: 0, stopIndex: 6 }]
      ])
    })

    it('should call onScroll when scroll position changes', () => {
      const onScroll = jest.fn()
      const rendered = findDOMNode(render(getMarkup({ onScroll })))
      expect(onScroll.mock.calls).toEqual([
        [{ clientHeight: 100, scrollHeight: 16900, scrollTop: 0 }]
      ])
      simulateScroll(rendered, 51)
      expect(onScroll.mock.calls).toEqual([
        [{ clientHeight: 100, scrollHeight: 16900, scrollTop: 0 }],
        [{ clientHeight: 100, scrollHeight: 16900, scrollTop: 51 }]
      ])
      simulateScroll(rendered, 0)
      expect(onScroll.mock.calls).toEqual([
        [{ clientHeight: 100, scrollHeight: 16900, scrollTop: 0 }],
        [{ clientHeight: 100, scrollHeight: 16900, scrollTop: 51 }],
        [{ clientHeight: 100, scrollHeight: 16900, scrollTop: 0 }]
      ])
    })
  })
})