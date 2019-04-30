import { Component, OnInit, ViewChild } from '@angular/core';
import { CustomGridComponent } from './custom-grid/custom-grid.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @ViewChild('grid') grid = new CustomGridComponent();

  title = 'CustomGrid';

  data = [];


  ngOnInit(): void {
    this.data = this.PrepareSampleData();
  }

  PrepareSampleData() {
    return Array.apply(null, new Array(30)).map((val1, rowIndex) => {
      return Array.apply(null, new Array(15)).map((val2, colIndex) => {
        return `R:${rowIndex}-C:${colIndex}`;
      });
    });
  }

  cellValueChanged(event) {
    console.log(event);
  }

  getGridDataV1(event) {
    console.log(event);
  }

  getGridDataV2() {
    console.log(this.grid.getSourceData());
  }

}
