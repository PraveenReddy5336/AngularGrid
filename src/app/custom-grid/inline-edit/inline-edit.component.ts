import { Component, Input, ViewChild, Renderer, forwardRef, ElementRef, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-inline-edit',
  templateUrl: './inline-edit.component.html',
  styleUrls: ['./inline-edit.component.scss']
})

export class InlineEditComponent {
  @Output() cellValueChange = new EventEmitter<any>();
  @ViewChild('editCell') editCell: ElementRef;
  private _value = '';
  public editing = false;

  @Input()
  get cellValue(): any {
    return this._value;
  }

  set cellValue(v: any) {
    if (v !== this._value) {
      this._value = v;
    }
  }


  onBlur($event: Event) {
    this.editing = false;
    this.cellValueChange.emit(this.cellValue);
  }

  beginEdit(value) {
    this.editing = true;
    setTimeout(() => { // this will make the execution after the above boolean has changed
      this.editCell.nativeElement.focus();
    }, 0);
  }
}
