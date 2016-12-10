/** @flow */
import Immutable from 'immutable'
import React, { Component, PropTypes } from 'react'
import { ContentBox, ContentBoxHeader, ContentBoxParagraph } from '../demo/ContentBox'
import { LabeledInput, InputRow } from '../demo/LabeledInput'
import AutoSizer from '../AutoSizer'
import MultiGrid from './MultiGrid'
import shallowCompare from 'react-addons-shallow-compare'
import styles from './MultiGrid.example.css'

const STYLE = {
  border: '1px solid #ddd',
  overflow: 'hidden'
}
const STYLE_BOTTOM_LEFT_GRID = {
  borderRight: '2px solid #aaa',
  backgroundColor: '#f7f7f7'
}
const STYLE_TOP_LEFT_GRID = {
  borderBottom: '2px solid #aaa',
  borderRight: '2px solid #aaa',
  fontWeight: 'bold'
}
const STYLE_TOP_RIGHT_GRID = {
  borderBottom: '2px solid #aaa',
  fontWeight: 'bold'
}

export default class MultiGridExample extends Component {
  static contextTypes = {
    list: PropTypes.instanceOf(Immutable.List).isRequired
  };

  constructor (props, context) {
    super(props, context)

    this.state = {
      fixedColumnCount: 2,
      fixedRowCount: 1,
      scrollLeft: 0,
      scrollToColumn: 0
    }

    this._cellRenderer = this._cellRenderer.bind(this)
    this._columnWidthGetter = this._columnWidthGetter.bind(this)
    this._onFixedColumnCountChange = this._createEventHandler('fixedColumnCount')
    this._onFixedRowCountChange = this._createEventHandler('fixedRowCount')
    this._onScrollLeftChange = this._createEventHandler('scrollLeft')
    this._onScrollToColumnChange = this._createEventHandler('scrollToColumn')
    this._rowHeightGetter = this._rowHeightGetter.bind(this)
  }

  render () {
    return (
      <ContentBox>
        <ContentBoxHeader
          text='MultiGrid'
          sourceLink='https://github.com/bvaughn/react-virtualized/blob/master/source/MultiGrid/MultiGrid.example.js'
          docsLink='https://github.com/bvaughn/react-virtualized/blob/master/docs/MultiGrid.md'
        />

        <ContentBoxParagraph>
          This component stitches together several grids to provide a fixed column/row interface.
        </ContentBoxParagraph>

        <InputRow>
          {this._createLabeledInput('fixedColumnCount', this._onFixedColumnCountChange)}
          {this._createLabeledInput('fixedRowCount', this._onFixedRowCountChange)}
          {this._createLabeledInput('scrollLeft', this._onScrollLeftChange)}
          {this._createLabeledInput('scrollToColumn', this._onScrollToColumnChange)}
        </InputRow>

        <AutoSizer disableHeight>
          {({ width }) => (
            <MultiGrid
              {...this.state}
              cellRenderer={this._cellRenderer}
              columnWidth={this._columnWidthGetter}
              columnCount={500}
              height={300}
              rowHeight={this._rowHeightGetter}
              rowCount={1000}
              style={STYLE}
              styleBottomLeftGrid={STYLE_BOTTOM_LEFT_GRID}
              styleTopLeftGrid={STYLE_TOP_LEFT_GRID}
              styleTopRightGrid={STYLE_TOP_RIGHT_GRID}
              width={width}
            />
          )}
        </AutoSizer>
      </ContentBox>
    )
  }

  shouldComponentUpdate (nextProps, nextState) {
    return shallowCompare(this, nextProps, nextState)
  }

  _cellRenderer ({ columnIndex, key, rowIndex, style }) {
    return (
      <div
        className={styles.Cell}
        key={key}
        style={style}
      >
        {columnIndex}, {rowIndex}
      </div>
    )
  }

  _columnWidthGetter ({ index }) {
    return 50 + index % 3 * 25
  }

  _createEventHandler (property) {
    return (event) => {
      const value = parseInt(event.target.value, 10) || 0

      this.setState({
        [property]: value
      })
    }
  }

  _createLabeledInput (property, eventHandler) {
    const value = this.state[property]

    return (
      <LabeledInput
        label={property}
        name={property}
        onChange={eventHandler}
        value={value}
      />
    )
  }

  _rowHeightGetter ({ index }) {
    return 20 + index % 2 * 10
  }
}