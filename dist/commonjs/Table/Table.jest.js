'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _TestUtils = require('../TestUtils');

var _testUtils = require('react-dom/test-utils');

var _immutable = require('immutable');

var _immutable2 = _interopRequireDefault(_immutable);

var _Column2 = require('./Column');

var _Column3 = _interopRequireDefault(_Column2);

var _Table = require('./Table');

var _Table2 = _interopRequireDefault(_Table);

var _SortDirection = require('./SortDirection');

var _SortDirection2 = _interopRequireDefault(_SortDirection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

describe('Table', function () {
  var array = [];
  for (var i = 0; i < 100; i++) {
    array.push({
      id: i,
      name: 'Name ' + i,
      email: 'user-' + i + '@treasure-data.com'
    });
  }
  var list = _immutable2.default.fromJS(array);

  // Works with an Immutable List of Maps
  function immutableRowGetter(_ref) {
    var index = _ref.index;

    return list.get(index);
  }

  // Works with an Array of Objects
  function vanillaRowGetter(_ref2) {
    var index = _ref2.index;

    return array[index];
  }

  // Override default behavior of overscanning by at least 1 (for accessibility)
  // Because it makes for simple tests below
  function overscanIndicesGetter(_ref3) {
    var startIndex = _ref3.startIndex,
        stopIndex = _ref3.stopIndex;

    return {
      overscanStartIndex: startIndex,
      overscanStopIndex: stopIndex
    };
  }

  function getMarkup() {
    var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    var cellDataGetter = _ref4.cellDataGetter,
        cellRenderer = _ref4.cellRenderer,
        _ref4$columnData = _ref4.columnData,
        columnData = _ref4$columnData === undefined ? { data: 123 } : _ref4$columnData,
        columnID = _ref4.columnID,
        columnStyle = _ref4.columnStyle,
        _ref4$disableSort = _ref4.disableSort,
        disableSort = _ref4$disableSort === undefined ? false : _ref4$disableSort,
        headerRenderer = _ref4.headerRenderer,
        maxWidth = _ref4.maxWidth,
        minWidth = _ref4.minWidth,
        defaultSortDirection = _ref4.defaultSortDirection,
        flexTableProps = _objectWithoutProperties(_ref4, ['cellDataGetter', 'cellRenderer', 'columnData', 'columnID', 'columnStyle', 'disableSort', 'headerRenderer', 'maxWidth', 'minWidth', 'defaultSortDirection']);

    return _react2.default.createElement(
      _Table2.default,
      _extends({
        headerHeight: 20,
        height: 100,
        overscanRowCount: 0,
        overscanIndicesGetter: overscanIndicesGetter,
        rowCount: list.size,
        rowGetter: immutableRowGetter,
        rowHeight: 10,
        width: 100
      }, flexTableProps),
      _react2.default.createElement(_Column3.default, {
        label: 'Name',
        dataKey: 'name',
        columnData: columnData,
        width: 50,
        cellRenderer: cellRenderer,
        cellDataGetter: cellDataGetter,
        headerRenderer: headerRenderer,
        disableSort: disableSort,
        defaultSortDirection: defaultSortDirection,
        style: columnStyle,
        id: columnID
      }),
      _react2.default.createElement(_Column3.default, {
        label: 'Email',
        dataKey: 'email',
        maxWidth: maxWidth,
        minWidth: minWidth,
        width: 50
      }),
      false,
      true,
      null,
      undefined
    );
  }

  beforeEach(function () {
    return jest.resetModules();
  });

  describe('children', function () {
    it('should accept Column children', function () {
      var children = [_react2.default.createElement(_Column3.default, { dataKey: 'foo', width: 100 })];
      var result = _Table2.default.propTypes.children({ children: children }, 'children', 'Table');
      expect(result instanceof Error).toEqual(false);
    });

    it('should accept subclasses of Column as children', function () {
      var AnotherColumn = function (_Column) {
        _inherits(AnotherColumn, _Column);

        function AnotherColumn() {
          _classCallCheck(this, AnotherColumn);

          return _possibleConstructorReturn(this, (AnotherColumn.__proto__ || Object.getPrototypeOf(AnotherColumn)).apply(this, arguments));
        }

        return AnotherColumn;
      }(_Column3.default);

      var children = [_react2.default.createElement(AnotherColumn, { dataKey: 'foo', width: 100 })];
      var result = _Table2.default.propTypes.children({ children: children }, 'children', 'Table');
      expect(result instanceof Error).toEqual(false);
    });

    it('should not accept non-Column children', function () {
      var children = [_react2.default.createElement('div', null)];
      var result = _Table2.default.propTypes.children({ children: children }, 'children', 'Table');
      expect(result instanceof Error).toEqual(true);
    });

    it('should accept falsy children to allow easier dynamic showing/hiding of columns', function () {
      var children = [false, _react2.default.createElement(_Column3.default, { dataKey: 'foo', width: 100 }), null];
      var result = _Table2.default.propTypes.children({ children: children }, 'children', 'Table');
      expect(result instanceof Error).toEqual(false);
    });
  });

  describe('height', function () {
    it('should subtract header row height from the inner Grid height if headers are enabled', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        headerHeight: 10,
        overscanRowCount: 0,
        rowHeight: 20,
        height: 50
      })));
      var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      expect(rows.length).toEqual(2);
    });

    it('should not subtract header row height from the inner Grid height if headers are disabled', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        disableHeader: true,
        headerHeight: 10,
        overscanRowCount: 0,
        rowHeight: 20,
        height: 50
      })));
      var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      expect(rows.length).toEqual(3);
    });
  });

  describe('initial rendering', function () {
    // Ensure that both Immutable Lists of Maps and Arrays of Objects are supported
    var useImmutable = [true, false];
    useImmutable.forEach(function (useImmutable) {
      it('should render the correct number of rows', function () {
        var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
          rowGetter: useImmutable ? immutableRowGetter : vanillaRowGetter
        })));
        // 100px height should fit 1 header (20px) and 8 rows (10px each) -
        expect(rendered.querySelectorAll('.ReactVirtualized__Table__headerRow').length).toEqual(1);
        expect(rendered.querySelectorAll('.ReactVirtualized__Table__row').length).toEqual(8);
      });

      it('should render the expected headers', function () {
        var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
          rowGetter: useImmutable ? immutableRowGetter : vanillaRowGetter
        })));
        var columns = rendered.querySelectorAll('.ReactVirtualized__Table__headerColumn');
        expect(columns.length).toEqual(2);
        expect(columns[0].textContent).toEqual('Name');
        expect(columns[1].textContent).toEqual('Email');
      });

      it('should render the expected rows and columns', function () {
        var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
          rowGetter: useImmutable ? immutableRowGetter : vanillaRowGetter,
          headerHeight: 10,
          rowHeight: 20,
          height: 50
        })));
        var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
        expect(rows.length).toEqual(2);
        Array.from(rows).forEach(function (row, index) {
          var rowData = list.get(index);
          var columns = row.querySelectorAll('.ReactVirtualized__Table__rowColumn');
          expect(columns.length).toEqual(2);
          expect(columns[0].textContent).toEqual(rowData.get('name'));
          expect(columns[1].textContent).toEqual(rowData.get('email'));
        });
      });
    });

    it('should support a :rowHeight function', function () {
      var rowHeight = function rowHeight(_ref5) {
        var index = _ref5.index;
        return 10 + index * 10;
      };
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        rowHeight: rowHeight,
        rowCount: 3
      })));
      var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      Array.from(rows).forEach(function (row, index) {
        expect(Number.parseInt(row.style.height, 10)).toEqual(rowHeight({ index: index }));
      });
    });

    it('should support :minWidth and :maxWidth values for a column', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        maxWidth: 75,
        minWidth: 25,
        rowCount: 1
      })));
      var columns = rendered.querySelectorAll('.ReactVirtualized__Table__rowColumn');
      var emailColumn = columns[1];
      expect(Number.parseInt(emailColumn.style.maxWidth, 10)).toEqual(75);
      expect(Number.parseInt(emailColumn.style.minWidth, 10)).toEqual(25);
    });
  });

  describe('measureAllRows', function () {
    it('should measure any unmeasured rows', function () {
      var rendered = (0, _TestUtils.render)(getMarkup({
        estimatedRowSize: 15,
        height: 0,
        rowCount: 10,
        rowHeight: function rowHeight() {
          return 20;
        },
        width: 0
      }));
      expect(rendered.Grid._rowSizeAndPositionManager.getTotalSize()).toEqual(150);
      rendered.measureAllRows();
      expect(rendered.Grid._rowSizeAndPositionManager.getTotalSize()).toEqual(200);
    });
  });

  describe('recomputeRowHeights', function () {
    it('should recompute row heights and other values when called', function () {
      var indices = [];
      var rowHeight = function rowHeight(_ref6) {
        var index = _ref6.index;

        indices.push(index);
        return 10;
      };
      var component = (0, _TestUtils.render)(getMarkup({
        rowHeight: rowHeight,
        rowCount: 50
      }));

      indices.splice(0);
      component.recomputeRowHeights();

      // Only the rows required to fill the current viewport will be rendered
      expect(indices[0]).toEqual(0);
      expect(indices[indices.length - 1]).toEqual(7);

      indices.splice(0);
      component.recomputeRowHeights(4);

      expect(indices[0]).toEqual(4);
      expect(indices[indices.length - 1]).toEqual(7);
    });
  });

  describe('forceUpdateGrid', function () {
    it('should refresh inner Grid content when called', function () {
      var marker = 'a';
      function cellRenderer(_ref7) {
        var rowIndex = _ref7.rowIndex;

        return '' + rowIndex + marker;
      }
      var component = (0, _TestUtils.render)(getMarkup({ cellRenderer: cellRenderer }));
      var node = (0, _reactDom.findDOMNode)(component);
      expect(node.textContent).toContain('1a');
      marker = 'b';
      component.forceUpdateGrid();
      expect(node.textContent).toContain('1b');
    });
  });

  describe('custom getter functions', function () {
    it('should use a custom cellDataGetter if specified', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        cellDataGetter: function cellDataGetter(_ref8) {
          var dataKey = _ref8.dataKey,
              rowData = _ref8.rowData;
          return 'Custom ' + dataKey + ' for row ' + rowData.get('id');
        }
      })));
      var nameColumns = rendered.querySelectorAll('.ReactVirtualized__Table__rowColumn:first-of-type');
      Array.from(nameColumns).forEach(function (nameColumn, index) {
        expect(nameColumn.textContent).toEqual('Custom name for row ' + index);
      });
    });

    it('should use a custom cellRenderer if specified', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        cellRenderer: function cellRenderer(_ref9) {
          var cellData = _ref9.cellData;
          return 'Custom ' + cellData;
        }
      })));
      var nameColumns = rendered.querySelectorAll('.ReactVirtualized__Table__rowColumn:first-of-type');
      Array.from(nameColumns).forEach(function (nameColumn, index) {
        var rowData = list.get(index);
        expect(nameColumn.textContent).toEqual('Custom ' + rowData.get('name'));
      });
    });

    it('should set the rendered cell content as the cell :title if it is a string', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        cellRenderer: function cellRenderer() {
          return 'Custom';
        }
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__rowColumn:first-of-type');
      expect(nameColumn.getAttribute('title')).toContain('Custom');
    });

    it('should not set a cell :title if the rendered cell content is not a string', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        cellRenderer: function cellRenderer() {
          return _react2.default.createElement(
            'div',
            null,
            'Custom'
          );
        }
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__rowColumn:first-of-type');
      expect(nameColumn.getAttribute('title')).toEqual(null);
    });
  });

  describe('sorting', function () {
    it('should not render sort indicators if no sort function is provided', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup()));
      var nameColumn = rendered.querySelectorAll('.ReactVirtualized__Table__headerColumn:first-of-type');

      expect(nameColumn.className || '').not.toContain('ReactVirtualized__Table__sortableHeaderColumn');
    });

    it('should not render sort indicators for non-sortable columns', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        disableSort: true,
        sort: function sort() {}
      })));
      var nameColumn = rendered.querySelectorAll('.ReactVirtualized__Table__headerColumn:first-of-type');

      expect(nameColumn.className || '').not.toContain('ReactVirtualized__Table__sortableHeaderColumn');
      expect(rendered.querySelectorAll('.ReactVirtualized__Table__sortableHeaderColumn').length).toEqual(1); // Email only
    });

    it('should render sortable column headers as sortable', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        sort: function sort() {}
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');

      expect(nameColumn.className).toContain('ReactVirtualized__Table__sortableHeaderColumn');
      expect(rendered.querySelectorAll('.ReactVirtualized__Table__sortableHeaderColumn').length).toEqual(2); // Email and Name
    });

    it('should render the correct sort indicator by the current sort-by column', function () {
      var sortDirections = [_SortDirection2.default.ASC, _SortDirection2.default.DESC];
      sortDirections.forEach(function (sortDirection) {
        var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
          sort: function sort() {},
          sortBy: 'name',
          sortDirection: sortDirection
        })));
        var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');

        expect(nameColumn.querySelector('.ReactVirtualized__Table__sortableHeaderIcon')).not.toEqual(null);
        expect(nameColumn.querySelector('.ReactVirtualized__Table__sortableHeaderIcon--' + sortDirection)).not.toEqual(null);
      });
    });

    it('should call sort with the correct arguments when the current sort-by column header is clicked', function () {
      var sortDirections = [_SortDirection2.default.ASC, _SortDirection2.default.DESC];
      sortDirections.forEach(function (sortDirection) {
        var sortCalls = [];
        var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
          sort: function sort(_ref10) {
            var sortBy = _ref10.sortBy,
                sortDirection = _ref10.sortDirection;
            return sortCalls.push({ sortBy: sortBy, sortDirection: sortDirection });
          },
          sortBy: 'name',
          sortDirection: sortDirection
        })));
        var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');

        _testUtils.Simulate.click(nameColumn);
        expect(sortCalls.length).toEqual(1);

        var _sortCalls$ = sortCalls[0],
            sortBy = _sortCalls$.sortBy,
            newSortDirection = _sortCalls$.sortDirection;

        var expectedSortDirection = sortDirection === _SortDirection2.default.ASC ? _SortDirection2.default.DESC : _SortDirection2.default.ASC;
        expect(sortBy).toEqual('name');
        expect(newSortDirection).toEqual(expectedSortDirection);
      });
    });

    it('should call sort with the correct arguments when a new sort-by column header is clicked', function () {
      var sortCalls = [];
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        sort: function sort(_ref11) {
          var sortBy = _ref11.sortBy,
              sortDirection = _ref11.sortDirection;
          return sortCalls.push({ sortBy: sortBy, sortDirection: sortDirection });
        },
        sortBy: 'email',
        sortDirection: _SortDirection2.default.ASC
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');

      _testUtils.Simulate.click(nameColumn);
      expect(sortCalls.length).toEqual(1);

      var _sortCalls$2 = sortCalls[0],
          sortBy = _sortCalls$2.sortBy,
          sortDirection = _sortCalls$2.sortDirection;

      expect(sortBy).toEqual('name');
      expect(sortDirection).toEqual(_SortDirection2.default.ASC);
    });

    it('should call sort when a column header is activated via ENTER or SPACE key', function () {
      var sortCalls = [];
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        sort: function sort(_ref12) {
          var sortBy = _ref12.sortBy,
              sortDirection = _ref12.sortDirection;
          return sortCalls.push({ sortBy: sortBy, sortDirection: sortDirection });
        },
        sortBy: 'name'
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');
      expect(sortCalls.length).toEqual(0);
      _testUtils.Simulate.keyDown(nameColumn, { key: ' ' });
      expect(sortCalls.length).toEqual(1);
      _testUtils.Simulate.keyDown(nameColumn, { key: 'Enter' });
      expect(sortCalls.length).toEqual(2);
      _testUtils.Simulate.keyDown(nameColumn, { key: 'F' });
      expect(sortCalls.length).toEqual(2);
    });

    it('should honor the default sort order on first click of the column', function () {
      var sortDirections = [_SortDirection2.default.ASC, _SortDirection2.default.DESC];
      sortDirections.forEach(function (sortDirection) {
        var sortCalls = [];
        var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
          sort: function sort(_ref13) {
            var sortBy = _ref13.sortBy,
                sortDirection = _ref13.sortDirection;
            return sortCalls.push({ sortBy: sortBy, sortDirection: sortDirection });
          },
          defaultSortDirection: sortDirection
        })));
        var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');

        _testUtils.Simulate.click(nameColumn);
        expect(sortCalls.length).toEqual(1);

        var _sortCalls$3 = sortCalls[0],
            sortBy = _sortCalls$3.sortBy,
            newSortDirection = _sortCalls$3.sortDirection;

        expect(sortBy).toEqual('name');
        expect(newSortDirection).toEqual(sortDirection);
      });
    });
  });

  describe('headerRowRenderer', function () {
    it('should render a custom header row if one is provided', function () {
      var headerRowRenderer = jest.fn().mockReturnValue(_react2.default.createElement(
        'div',
        null,
        'foo bar'
      ));
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        headerHeight: 33,
        headerRowRenderer: headerRowRenderer,
        rowClassName: 'someRowClass'
      })));
      expect(rendered.textContent).toContain('foo bar');
      expect(headerRowRenderer).toHaveBeenCalled();
      var params = headerRowRenderer.mock.calls[0][0];
      expect(params.className).toContain('someRowClass');
      expect(params.columns).toHaveLength(2);
      expect(params.style.height).toBe(33);
    });
  });

  describe('headerRenderer', function () {
    it('should render a custom header if one is provided', function () {
      var columnData = { foo: 'foo', bar: 'bar' };
      var headerRendererCalls = [];
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        columnData: columnData,
        headerRenderer: function headerRenderer(params) {
          headerRendererCalls.push(params);
          return 'custom header';
        },
        sortBy: 'name',
        sortDirection: _SortDirection2.default.ASC
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');

      expect(nameColumn.textContent).toContain('custom header');
      expect(headerRendererCalls.length).toBeTruthy();

      var headerRendererCall = headerRendererCalls[0];
      expect(headerRendererCall.columnData).toEqual(columnData);
      expect(headerRendererCall.dataKey).toEqual('name');
      expect(headerRendererCall.disableSort).toEqual(false);
      expect(headerRendererCall.label).toEqual('Name');
      expect(headerRendererCall.sortBy).toEqual('name');
      expect(headerRendererCall.sortDirection).toEqual(_SortDirection2.default.ASC);
    });

    it('should honor sort for custom headers', function () {
      var sortCalls = [];
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        headerRenderer: function headerRenderer() {
          return 'custom header';
        },
        sort: function sort(_ref14) {
          var sortBy = _ref14.sortBy,
              sortDirection = _ref14.sortDirection;
          return sortCalls.push([sortBy, sortDirection]);
        },
        sortBy: 'name',
        sortDirection: _SortDirection2.default.ASC
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');

      _testUtils.Simulate.click(nameColumn);

      expect(sortCalls.length).toEqual(1);
      var sortCall = sortCalls[0];
      expect(sortCall[0]).toEqual('name');
      expect(sortCall[1]).toEqual(_SortDirection2.default.DESC);
    });

    it('should honor :onHeaderClick for custom header', function () {
      var columnData = { foo: 'foo', bar: 'bar' };
      var onHeaderClick = jest.fn();
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        columnData: columnData,
        headerRenderer: function headerRenderer() {
          return 'custom header';
        },
        onHeaderClick: onHeaderClick
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');

      _testUtils.Simulate.click(nameColumn);

      expect(onHeaderClick).toHaveBeenCalledTimes(1);
      var params = onHeaderClick.mock.calls[0][0];
      expect(params.dataKey).toEqual('name');
      expect(params.columnData).toEqual(columnData);
      expect(params.event.type).toEqual('click');
    });
  });

  describe('noRowsRenderer', function () {
    it('should call :noRowsRenderer if :rowCount is 0', function () {
      var rendered = (0, _TestUtils.render)(getMarkup({
        noRowsRenderer: function noRowsRenderer() {
          return _react2.default.createElement(
            'div',
            null,
            'No rows!'
          );
        },
        rowCount: 0
      }));
      var bodyDOMNode = (0, _reactDom.findDOMNode)(rendered.Grid);
      expect(bodyDOMNode.textContent).toEqual('No rows!');
    });

    it('should render an empty body if :rowCount is 0 and there is no :noRowsRenderer', function () {
      var rendered = (0, _TestUtils.render)(getMarkup({
        rowCount: 0
      }));
      var bodyDOMNode = (0, _reactDom.findDOMNode)(rendered.Grid);
      expect(bodyDOMNode.textContent).toEqual('');
    });
  });

  describe('onHeaderClick', function () {
    it('should call :onHeaderClick with the correct arguments when a column header is clicked and sorting is disabled', function () {
      var onHeaderClick = jest.fn();
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        disableSort: true,
        onHeaderClick: onHeaderClick
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');

      _testUtils.Simulate.click(nameColumn);

      expect(onHeaderClick).toHaveBeenCalledTimes(1);
      var params = onHeaderClick.mock.calls[0][0];
      expect(params.dataKey).toEqual('name');
      expect(params.columnData.data).toEqual(123);
      expect(params.event.type).toEqual('click');
    });

    it('should call :onHeaderClick with the correct arguments when a column header is clicked and sorting is enabled', function () {
      var onHeaderClick = jest.fn();
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        disableSort: false,
        onHeaderClick: onHeaderClick
      })));
      var nameColumn = rendered.querySelector('.ReactVirtualized__Table__headerColumn:first-of-type');

      _testUtils.Simulate.click(nameColumn);

      expect(onHeaderClick).toHaveBeenCalledTimes(1);
      var params = onHeaderClick.mock.calls[0][0];
      expect(params.dataKey).toEqual('name');
      expect(params.columnData.data).toEqual(123);
      expect(params.event.type).toEqual('click');
    });
  });

  describe('onRowClick', function () {
    it('should call :onRowClick with the correct :rowIndex when a row is clicked', function () {
      var onRowClick = jest.fn();
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        onRowClick: onRowClick
      })));
      var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      _testUtils.Simulate.click(rows[0]);
      _testUtils.Simulate.click(rows[3]);
      expect(onRowClick).toHaveBeenCalledTimes(2);
      expect(onRowClick.mock.calls.map(function (call) {
        return call[0].index;
      })).toEqual([0, 3]);
    });
  });

  describe('onRowDoubleClick', function () {
    it('should call :onRowDoubleClick with the correct :rowIndex when a row is clicked', function () {
      var onRowDoubleClick = jest.fn();
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        onRowDoubleClick: onRowDoubleClick
      })));
      var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      _testUtils.Simulate.doubleClick(rows[0]);
      _testUtils.Simulate.doubleClick(rows[3]);
      expect(onRowDoubleClick).toHaveBeenCalledTimes(2);
      expect(onRowDoubleClick.mock.calls.map(function (call) {
        return call[0].index;
      })).toEqual([0, 3]);
    });
  });

  describe('onRowRightClick', function () {
    it('should call :onRowRightClick with the correct :rowIndex when a row is right-clicked', function () {
      var onRowRightClick = jest.fn();
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        onRowRightClick: onRowRightClick
      })));
      var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      _testUtils.Simulate.contextMenu(rows[0]);
      _testUtils.Simulate.contextMenu(rows[3]);
      expect(onRowRightClick).toHaveBeenCalledTimes(2);
      expect(onRowRightClick.mock.calls.map(function (call) {
        return call[0].index;
      })).toEqual([0, 3]);
    });
  });

  describe('onRowMouseOver/Out', function () {
    it('should call :onRowMouseOver and :onRowMouseOut with the correct :rowIndex when the mouse is moved over rows', function () {
      var onRowMouseOver = jest.fn();
      var onRowMouseOut = jest.fn();
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        onRowMouseOver: onRowMouseOver,
        onRowMouseOut: onRowMouseOut
      })));

      var simulateMouseOver = function simulateMouseOver(from, to) {
        _testUtils.Simulate.mouseOut(from, { relatedTarget: to });
        _testUtils.Simulate.mouseOver(to, { relatedTarget: from });
      };

      var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');

      simulateMouseOver(rows[0], rows[1]);
      simulateMouseOver(rows[1], rows[2]);
      simulateMouseOver(rows[2], rows[3]);

      expect(onRowMouseOver).toHaveBeenCalled();
      expect(onRowMouseOut).toHaveBeenCalled();
      expect(onRowMouseOver.mock.calls.map(function (call) {
        return call[0].index;
      })).toEqual([1, 2, 3]);
      expect(onRowMouseOut.mock.calls.map(function (call) {
        return call[0].index;
      })).toEqual([0, 1, 2]);
    });
  });

  describe('rowClassName', function () {
    it('should render a static classname given :rowClassName as a string', function () {
      var staticClassName = 'staticClass';
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        rowClassName: staticClassName
      })));
      var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      Array.from(rows).forEach(function (row) {
        expect(row.className).toContain(staticClassName);
      });
    });

    it('should render dynamic classname given :rowClassName as a function', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        rowClassName: function rowClassName(_ref15) {
          var index = _ref15.index;
          return index % 2 === 0 ? 'even' : 'odd';
        }
      })));
      var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      Array.from(rows).forEach(function (row, index) {
        if (index % 2 === 0) {
          expect(row.className).toContain('even');
          expect(row.className).not.toContain('odd');
        } else {
          expect(row.className).toContain('odd');
          expect(row.className).not.toContain('even');
        }
      });
    });
  });

  describe('onRowsRendered', function () {
    it('should call :onRowsRendered at least one row is rendered', function () {
      var startIndex = void 0,
          stopIndex = void 0;
      (0, _TestUtils.render)(getMarkup({
        onRowsRendered: function onRowsRendered(params) {
          var _params;

          return _params = params, startIndex = _params.startIndex, stopIndex = _params.stopIndex, _params;
        }
      }));
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(7);
    });

    it('should not call :onRowsRendered unless the start or stop indices have changed', function () {
      var numCalls = 0;
      var startIndex = void 0;
      var stopIndex = void 0;
      var onRowsRendered = function onRowsRendered(params) {
        startIndex = params.startIndex;
        stopIndex = params.stopIndex;
        numCalls++;
      };
      (0, _TestUtils.render)(getMarkup({ onRowsRendered: onRowsRendered }));
      expect(numCalls).toEqual(1);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(7);
      (0, _TestUtils.render)(getMarkup({ onRowsRendered: onRowsRendered }));
      expect(numCalls).toEqual(1);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(7);
    });

    it('should call :onRowsRendered if the start or stop indices have changed', function () {
      var numCalls = 0;
      var startIndex = void 0;
      var stopIndex = void 0;
      var onRowsRendered = function onRowsRendered(params) {
        startIndex = params.startIndex;
        stopIndex = params.stopIndex;
        numCalls++;
      };
      (0, _TestUtils.render)(getMarkup({ onRowsRendered: onRowsRendered }));
      expect(numCalls).toEqual(1);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(7);
      (0, _TestUtils.render)(getMarkup({
        height: 50,
        onRowsRendered: onRowsRendered
      }));
      expect(numCalls).toEqual(2);
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(2);
    });

    it('should not call :onRowsRendered if no rows are rendered', function () {
      var startIndex = void 0,
          stopIndex = void 0;
      (0, _TestUtils.render)(getMarkup({
        height: 0,
        onRowsRendered: function onRowsRendered(params) {
          var _params2;

          return _params2 = params, startIndex = _params2.startIndex, stopIndex = _params2.stopIndex, _params2;
        }
      }));
      expect(startIndex).toEqual(undefined);
      expect(stopIndex).toEqual(undefined);
    });
  });

  describe(':scrollTop property', function () {
    it('should render correctly when an initial :scrollTop property is specified', function () {
      var startIndex = void 0,
          stopIndex = void 0;
      (0, _TestUtils.render)(getMarkup({
        onRowsRendered: function onRowsRendered(params) {
          var _params3;

          return _params3 = params, startIndex = _params3.startIndex, stopIndex = _params3.stopIndex, _params3;
        },
        scrollTop: 80
      }));
      expect(startIndex).toEqual(8);
      expect(stopIndex).toEqual(15);
    });

    it('should render correctly when :scrollTop property is updated', function () {
      var startIndex = void 0,
          stopIndex = void 0;

      (0, _TestUtils.render)(getMarkup({
        onRowsRendered: function onRowsRendered(params) {
          var _params4;

          return _params4 = params, startIndex = _params4.startIndex, stopIndex = _params4.stopIndex, _params4;
        }
      }));
      expect(startIndex).toEqual(0);
      expect(stopIndex).toEqual(7);

      (0, _TestUtils.render)(getMarkup({
        onRowsRendered: function onRowsRendered(params) {
          var _params5;

          return _params5 = params, startIndex = _params5.startIndex, stopIndex = _params5.stopIndex, _params5;
        },
        scrollTop: 80
      }));
      expect(startIndex).toEqual(8);
      expect(stopIndex).toEqual(15);
    });
  });

  describe('styles, classNames, and ids', function () {
    it('should use the expected global CSS classNames', function () {
      var node = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        sort: function sort() {},
        sortBy: 'name',
        sortDirection: _SortDirection2.default.ASC
      })));
      expect(node.className).toEqual('ReactVirtualized__Table');
      expect(node.querySelector('.ReactVirtualized__Table__headerRow')).toBeTruthy();
      expect(node.querySelector('.ReactVirtualized__Table__rowColumn')).toBeTruthy();
      expect(node.querySelector('.ReactVirtualized__Table__headerColumn')).toBeTruthy();
      expect(node.querySelector('.ReactVirtualized__Table__row')).toBeTruthy();
      expect(node.querySelector('.ReactVirtualized__Table__sortableHeaderColumn')).toBeTruthy();
      expect(node.querySelector('.ReactVirtualized__Table__sortableHeaderIcon')).toBeTruthy();
    });

    it('should use a custom :className if specified', function () {
      var node = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        className: 'foo',
        headerClassName: 'bar',
        rowClassName: 'baz'
      })));
      expect(node.className).toContain('foo');
      expect(node.querySelectorAll('.bar').length).toEqual(2);
      expect(node.querySelectorAll('.baz').length).toEqual(9);
    });

    it('should use a custom :id if specified', function () {
      var node = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({ id: 'bar' })));
      expect(node.getAttribute('id')).toEqual('bar');
    });

    it('should not set :id on the inner Grid', function () {
      var node = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({ id: 'bar' })));
      var grid = node.querySelector('.ReactVirtualized__Grid');
      expect(grid.getAttribute('id')).not.toEqual('bar');
    });

    it('should use custom :styles if specified', function () {
      var columnStyle = { backgroundColor: 'red' };
      var headerStyle = { backgroundColor: 'blue' };
      var rowStyle = { backgroundColor: 'green' };
      var style = { backgroundColor: 'orange' };
      var node = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        columnStyle: columnStyle,
        headerStyle: headerStyle,
        rowStyle: rowStyle,
        style: style
      })));
      expect(node.querySelector('.ReactVirtualized__Table__rowColumn').style.backgroundColor).toEqual('red');
      expect(node.querySelector('.ReactVirtualized__Table__headerColumn').style.backgroundColor).toEqual('blue');
      expect(node.querySelector('.ReactVirtualized__Table__row').style.backgroundColor).toEqual('green');
      expect(node.style.backgroundColor).toEqual('orange');
    });

    it('should render dynamic style given :rowStyle as a function', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        rowStyle: function rowStyle(_ref16) {
          var index = _ref16.index;
          return index % 2 === 0 ? { backgroundColor: 'red' } : { backgroundColor: 'green' };
        }
      })));
      var rows = rendered.querySelectorAll('.ReactVirtualized__Table__row');
      Array.from(rows).forEach(function (row, index) {
        if (index % 2 === 0) {
          expect(row.style.backgroundColor).toEqual('red');
        } else {
          expect(row.style.backgroundColor).toEqual('green');
        }
      });
    });

    it('should pass :gridClassName and :gridStyle to the inner Grid', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        gridClassName: 'foo',
        gridStyle: { backgroundColor: 'red' }
      })));
      var grid = rendered.querySelector('.ReactVirtualized__Grid');
      expect(grid.className).toContain('foo');
      expect(grid.style.backgroundColor).toEqual('red');
    });
  });

  describe('overscanRowCount', function () {
    it('should not overscan by default', function () {
      var mock = jest.fn();
      mock.mockImplementation(overscanIndicesGetter);

      (0, _TestUtils.render)(getMarkup({
        overscanIndicesGetter: mock
      }));
      expect(mock.mock.calls[0][0].overscanCellsCount).toEqual(0);
      expect(mock.mock.calls[1][0].overscanCellsCount).toEqual(0);
    });

    it('should overscan the specified amount', function () {
      var mock = jest.fn();
      mock.mockImplementation(overscanIndicesGetter);

      (0, _TestUtils.render)(getMarkup({
        overscanIndicesGetter: mock,
        overscanRowCount: 10
      }));
      expect(mock.mock.calls[0][0].overscanCellsCount).toEqual(0);
      expect(mock.mock.calls[1][0].overscanCellsCount).toEqual(10);
    });
  });

  describe('onScroll', function () {
    it('should trigger callback when component initially mounts', function () {
      var onScrollCalls = [];
      (0, _TestUtils.render)(getMarkup({
        onScroll: function onScroll(params) {
          return onScrollCalls.push(params);
        }
      }));
      expect(onScrollCalls).toEqual([{
        clientHeight: 80,
        scrollHeight: 1000,
        scrollTop: 0
      }]);
    });

    it('should trigger callback when component scrolls', function () {
      var onScrollCalls = [];
      var rendered = (0, _TestUtils.render)(getMarkup({
        onScroll: function onScroll(params) {
          return onScrollCalls.push(params);
        }
      }));
      var target = {
        scrollLeft: 0,
        scrollTop: 100
      };
      rendered.Grid._scrollingContainer = target; // HACK to work around _onScroll target check
      _testUtils.Simulate.scroll((0, _reactDom.findDOMNode)(rendered.Grid), { target: target });
      expect(onScrollCalls.length).toEqual(2);
      expect(onScrollCalls[1]).toEqual({
        clientHeight: 80,
        scrollHeight: 1000,
        scrollTop: 100
      });
    });
  });

  describe('a11y properties', function () {
    it('should set aria role on the table', function () {
      var node = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup()));
      expect(node.getAttribute('role')).toEqual('grid');
    });

    it('should set aria role on the header row', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup()));
      var row = rendered.querySelector('.ReactVirtualized__Table__headerRow');
      expect(row.getAttribute('role')).toEqual('row');
    });

    it('should set appropriate aria role on the grid', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup()));
      var grid = rendered.querySelector('.ReactVirtualized__Table__Grid');
      expect(grid.getAttribute('role')).toEqual('rowgroup');
    });

    it('should set aria role on a row', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup()));
      var row = rendered.querySelector('.ReactVirtualized__Table__row');
      expect(row.getAttribute('role')).toEqual('row');
    });

    it('should set aria role on a cell', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup()));
      var cell = rendered.querySelector('.ReactVirtualized__Table__rowColumn');
      expect(cell.getAttribute('role')).toEqual('gridcell');
    });

    it('should set aria-describedby on a cell when the column has an id', function () {
      var columnID = 'column-header-test';
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        columnID: columnID
      })));
      var cell = rendered.querySelector('.ReactVirtualized__Table__rowColumn');
      expect(cell.getAttribute('aria-describedby')).toEqual(columnID);
    });

    it('should attach a11y properties to a row if :onRowClick is specified', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        onRowClick: function onRowClick() {}
      })));
      var row = rendered.querySelector('.ReactVirtualized__Table__row');
      expect(row.getAttribute('aria-label')).toEqual('row');
      expect(row.tabIndex).toEqual(0);
    });

    it('should not attach a11y properties to a row if no :onRowClick is specified', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        onRowClick: null
      })));
      var row = rendered.querySelector('.ReactVirtualized__Table__row');
      expect(row.getAttribute('aria-label')).toEqual(null);
      expect(row.tabIndex).toEqual(-1);
    });

    it('should set aria role on a header column', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup()));
      var header = rendered.querySelector('.ReactVirtualized__Table__headerColumn');
      expect(header.getAttribute('role')).toEqual('columnheader');
    });

    it('should set aria-sort ascending on a header column if the column is sorted ascending', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        sortBy: 'name',
        sortDirection: _SortDirection2.default.ASC
      })));
      var header = rendered.querySelector('.ReactVirtualized__Table__headerColumn');
      expect(header.getAttribute('aria-sort')).toEqual('ascending');
    });

    it('should set aria-sort descending on a header column if the column is sorted descending', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        sortBy: 'name',
        sortDirection: _SortDirection2.default.DESC
      })));
      var header = rendered.querySelector('.ReactVirtualized__Table__headerColumn');
      expect(header.getAttribute('aria-sort')).toEqual('descending');
    });

    it('should set id on a header column when the column has an id', function () {
      var columnID = 'column-header-test';
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        columnID: columnID
      })));
      var header = rendered.querySelector('.ReactVirtualized__Table__headerColumn');
      expect(header.getAttribute('id')).toEqual(columnID);
    });

    it('should attach a11y properties to a header column if sort is enabled', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        disableSort: false,
        sort: function sort() {}
      })));
      var row = rendered.querySelector('.ReactVirtualized__Table__headerColumn');
      expect(row.getAttribute('aria-label')).toEqual('Name');
      expect(row.tabIndex).toEqual(0);
    });

    it('should not attach a11y properties to a header column if sort is not enabled', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        disableSort: true
      })));
      var row = rendered.querySelector('.ReactVirtualized__Table__headerColumn');
      expect(row.getAttribute('aria-label')).toEqual(null);
      expect(row.tabIndex).toEqual(-1);
    });
  });

  describe('tabIndex', function () {
    it('should be focusable by default', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup()));
      expect(rendered.querySelector('.ReactVirtualized__Grid').tabIndex).toEqual(0);
    });

    it('should allow tabIndex to be overridden', function () {
      var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({
        tabIndex: -1
      })));
      expect(rendered.querySelector('.ReactVirtualized__Grid').tabIndex).toEqual(-1);
    });
  });

  describe('pure', function () {
    it('should not re-render unless props have changed', function () {
      var headerRendererCalled = false;
      var cellRendererCalled = false;
      function headerRenderer() {
        headerRendererCalled = true;
        return 'foo';
      }
      function cellRenderer() {
        cellRendererCalled = true;
        return 'foo';
      }
      var markup = getMarkup({
        headerRenderer: headerRenderer,
        cellRenderer: cellRenderer
      });
      (0, _TestUtils.render)(markup);
      expect(headerRendererCalled).toEqual(true);
      expect(cellRendererCalled).toEqual(true);
      headerRendererCalled = false;
      cellRendererCalled = false;
      (0, _TestUtils.render)(markup);
      expect(headerRendererCalled).toEqual(false);
      expect(cellRendererCalled).toEqual(false);
    });

    it('should re-render both the Table and the inner Grid whenever an external property changes', function () {
      var headerRendererCalled = false;
      var cellRendererCalled = false;
      function headerRenderer() {
        headerRendererCalled = true;
        return 'foo';
      }
      function cellRenderer() {
        cellRendererCalled = true;
        return 'foo';
      }
      var initialProperties = {
        autoHeight: false,
        cellRenderer: cellRenderer,
        estimatedRowSize: 15,
        headerRenderer: headerRenderer,
        overscanRowCount: 1,
        rowHeight: 15,
        rowCount: 20,
        scrollToAlignment: 'auto',
        scrollTop: 0,
        sortBy: 'name',
        sortDirection: _SortDirection2.default.ASC,
        tabIndex: null
      };
      var changedProperties = {
        autoHeight: true,
        estimatedRowSize: 10,
        overscanRowCount: 0,
        rowHeight: 10,
        rowCount: 10,
        scrollToAlignment: 'center',
        scrollTop: 1,
        sortBy: 'email',
        sortDirection: _SortDirection2.default.DESC,
        tabIndex: 1
      };
      Object.entries(changedProperties).forEach(function (_ref17) {
        var _ref18 = _slicedToArray(_ref17, 2),
            key = _ref18[0],
            value = _ref18[1];

        _TestUtils.render.unmount(); // Reset
        (0, _TestUtils.render)(getMarkup(initialProperties));
        headerRendererCalled = true;
        cellRendererCalled = false;
        (0, _TestUtils.render)(getMarkup(_extends({}, initialProperties, _defineProperty({}, key, value))));
        expect(headerRendererCalled).toEqual(true);
        expect(cellRendererCalled).toEqual(true);
      });
    });
  });

  it('should set the width of the single-column inner Grid to auto', function () {
    var rendered = (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup()));
    expect(rendered.querySelector('.ReactVirtualized__Grid__innerScrollContainer').style.width).toEqual('auto');
  });

  it('should relay the Grid :parent param to the Column :cellRenderer', function () {
    var cellRenderer = jest.fn().mockReturnValue(null);
    (0, _reactDom.findDOMNode)((0, _TestUtils.render)(getMarkup({ cellRenderer: cellRenderer })));
    expect(cellRenderer.mock.calls[0][0].parent).not.toBeUndefined();
  });
});