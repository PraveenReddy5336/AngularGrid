import { Injectable } from '@angular/core';

@Injectable()
export class CustomGridService {

  constructor() { }
}

export class GridData {
  formattedData: GridCell[] = [];
  rowsCount = 0;
  columnsCount = 0;
  constructor(init?: Partial<GridData>) {
    Object.assign(this, init);
  }
}

export class GridCell {
  actualData: any = '';
  rowIndex = -1;
  columnIndex = -1;
  constructor(init?: Partial<GridCell>) {
    Object.assign(this, init);
  }
}

export enum EnumGridDataType {
  ArrayOfStringArray = 1,
  ArrayOfObjectArray = 2
}


export enum GridContextOptions {
  InsertColumnLeft = 'InsertColumnLeft',
  InsertColumnRight = 'InsertColumnRight',
  DeleteColumn = 'DeleteColumn',
  InsertRowAbove = 'InsertRowAbove',
  InsertRowBelow = 'InsertRowBelow',
  DeleteRow = 'DeleteRow'
}
