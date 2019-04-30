import {
  Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter, ChangeDetectorRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { EnumGridDataType, GridData, GridCell, GridContextOptions } from './custom-grid.service';

@Component({
  selector: 'app-custom-grid',
  templateUrl: './custom-grid.component.html',
  styleUrls: ['./custom-grid.component.scss'],
})
export class CustomGridComponent implements OnInit, OnChanges {
  private _headers = [];
  private _formattedData = [];
  private _gridDataType: number;

  @Input('GridData')
  get sourceData() {
    return this._formattedData;
  }
  set sourceData(sourceData: any) {
    this._formattedData = sourceData;
  }

  @Input('GridDataType')
  get gridDataType() {
    return this._gridDataType;
  }
  set gridDataType(GridDataType: number) {
    this._gridDataType = (GridDataType) || 1;
  }

  @Input('GridHeaders')
  get headers() {
    return this._headers;
  }
  set headers(headers: any[]) {
    this._headers = (headers && headers.length) ? headers : [];
  }

  @Output() public getGridData: EventEmitter<any> = new EventEmitter();
  @Output() public cellValueChange: EventEmitter<any> = new EventEmitter();

  public headerLen = 0;
  public formattedGridData = new GridData();

  constructor() {
  }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    const { sourceData, headers, gridDataType } = changes;
    if (headers && !headers.currentValue && sourceData && sourceData.currentValue.length) {
      const arrLengths = sourceData.currentValue.map((row) => row.length);
      this.headerLen = Math.max.apply(null, arrLengths);
      for (let index = 0; index < this.headerLen; index++) {
        this._headers.push(index + 1);
      }
    }

    if (gridDataType && sourceData && sourceData.currentValue.length) {
      this.formatSourceData();
    }
  }

  onContextMenuClick(event, commandText) {
    if (GridContextOptions.InsertColumnLeft === commandText) {
      this.addColumn(event.item);
    } else if (GridContextOptions.InsertColumnRight === commandText) {
      this.addColumn(event.item + 1);
    } else if (GridContextOptions.DeleteColumn === commandText) {
      this.deleteColumn(event.item);
    } else if (GridContextOptions.InsertRowAbove === commandText) {
      this.addRow(event.item);
    } else if (GridContextOptions.InsertRowBelow === commandText) {
      this.addRow(event.item + 1);
    } else if (GridContextOptions.DeleteRow === commandText) {
      this.deleteRow(event.item);
    }
    // this.getGridData.emit(this.sourceData);
  }

  addRow(rowIndex: number) {
    const incrArrayData = this.IncrArrayRowIndex(this.formattedGridData.formattedData, rowIndex);
    const emptyColumn = Array.apply(null, new Array(this.formattedGridData.columnsCount)).map((val, index) => {
      return new GridCell({
        actualData: '',
        rowIndex: rowIndex,
        columnIndex: index
      });
    });
    this.formattedGridData.formattedData = incrArrayData.concat(emptyColumn);
    this.formattedGridData.rowsCount++;
  }

  deleteRow(rowIndex: number) {
    this.formattedGridData.formattedData = this.formattedGridData.formattedData.filter((obj: GridCell) => {
      return obj.rowIndex !== rowIndex;
    });
    const sortedData = this.formattedGridData.formattedData.sort((a, b) => {
      return parseInt(a.rowIndex.toString().concat(a.columnIndex.toString()), 10) >
        parseInt(b.rowIndex.toString().concat(b.columnIndex.toString()), 10) ? 1 : -1;
    });
    this.formattedGridData.formattedData = this.DescArrayRowIndex(sortedData, rowIndex);
    this.formattedGridData.rowsCount--;
  }

  addColumn(colIndex: number) {
    const incrArrayData = this.IncrArrayColIndex(this.formattedGridData.formattedData, colIndex);
    const emptyColumn = Array.apply(null, new Array(this.formattedGridData.rowsCount)).map((val, index) => {
      return new GridCell({
        actualData: '',
        rowIndex: index,
        columnIndex: colIndex
      });
    });
    this.formattedGridData.formattedData = incrArrayData.concat(emptyColumn);
    this.formattedGridData.columnsCount++;
    this._headers.splice(colIndex, 0, '');
  }

  deleteColumn(colIndex: number) {
    this.formattedGridData.formattedData = this.formattedGridData.formattedData.filter((obj: GridCell) => {
      return obj.columnIndex !== colIndex;
    });
    const sortedData = this.formattedGridData.formattedData.sort((a, b) => {
      return parseInt(a.rowIndex.toString().concat(a.columnIndex.toString()), 10) >
        parseInt(b.rowIndex.toString().concat(b.columnIndex.toString()), 10) ? 1 : -1;
    });
    this.formattedGridData.formattedData = this.DescArrayColIndex(sortedData, colIndex);
    this.formattedGridData.columnsCount--;
    this._headers.splice(colIndex, 1);
  }

  DescArrayColIndex(arrayData, colIndex: number) {
    return arrayData.map((obj: GridCell) => {
      obj.columnIndex = obj.columnIndex > colIndex ? (obj.columnIndex - 1) : obj.columnIndex;
      return obj;
    });
  }

  IncrArrayColIndex(arrayData, colIndex: number) {
    return arrayData.map((obj: GridCell) => {
      obj.columnIndex = obj.columnIndex >= colIndex ? (obj.columnIndex + 1) : obj.columnIndex;
      return obj;
    });
  }

  DescArrayRowIndex(arrayData, rowIndex: number) {
    return arrayData.map((obj: GridCell) => {
      obj.rowIndex = obj.rowIndex > rowIndex ? (obj.rowIndex - 1) : obj.rowIndex;
      return obj;
    });
  }

  IncrArrayRowIndex(arrayData, rowIndex: number) {
    return arrayData.map((obj: GridCell) => {
      obj.rowIndex = obj.rowIndex >= rowIndex ? (obj.rowIndex + 1) : obj.rowIndex;
      return obj;
    });
  }

  getSourceData() {

    let sourceData: any;
    const sortedData = this.formattedGridData.formattedData.sort((a, b) => {
      return parseInt(a.rowIndex.toString().concat(a.columnIndex.toString()), 10) >
        parseInt(b.rowIndex.toString().concat(b.columnIndex.toString()), 10) ? 1 : -1;
    });
    if (this.gridDataType === EnumGridDataType.ArrayOfStringArray) {
      sourceData = [];
      for (let i = 0; i < this.formattedGridData.rowsCount; i++) {
        sourceData.push(this.formattedGridData.formattedData.filter((val) => {
          return val.rowIndex === i;
        }).map((val) => val.actualData));
      }
    }
    return sourceData;
  }

  formatSourceData() {
    this.formattedGridData = new GridData();
    if (this.gridDataType === EnumGridDataType.ArrayOfStringArray) {
      for (let i = 0; i < this.sourceData.length; i++) {
        for (let j = 0; j < this.sourceData[i].length; j++) {
          this.formattedGridData.formattedData.push(new GridCell({
            actualData: this.sourceData[i][j],
            rowIndex: i,
            columnIndex: j
          }));
          if (this.formattedGridData.columnsCount < (j + 1)) {
            this.formattedGridData.columnsCount = j + 1;
          }
        }
        if (this.formattedGridData.rowsCount < (i + 1)) {
          this.formattedGridData.rowsCount = i + 1;
        }
      }
    }
  }

  getCellData(rowIndex, colIndex) {
    if (this.formattedGridData.formattedData.length) {
      const result: any = this.formattedGridData.formattedData.filter((obj: GridCell) => {
        return obj.columnIndex === colIndex && obj.rowIndex === rowIndex;
      });
      return (result && result.length) ? result[0].actualData : '';
    }
    return '';
  }

  createRange(number) {
    const items = [];
    for (let i = 0; i < number; i++) {
      items.push(i);
    }
    return items;
  }

  cellValueChanged(value, rowIndex, colIndex) {
    this.updateCellValue({ value, rowIndex, colIndex });
  }

  updateCellValue(cellobj: any) {
    const { colIndex, rowIndex, value } = cellobj;
    const index = this.formattedGridData.formattedData.findIndex((obj) => obj.columnIndex === colIndex && obj.rowIndex === rowIndex);
    if (index !== -1 && this.formattedGridData.formattedData[index].actualData !== value) {
      this.formattedGridData.formattedData[index].actualData = value;
      this.cellValueChange.emit(cellobj);
    }
  }
}
