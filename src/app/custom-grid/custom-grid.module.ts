import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuModule } from '../context-menu/context-menu.module';
import { CustomGridComponent } from './custom-grid.component';
import { InlineEditComponent } from './inline-edit/inline-edit.component';
import { FormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [CustomGridComponent, InlineEditComponent],
  imports: [
    CommonModule,
    FormsModule,
    DragDropModule,
    ContextMenuModule.forRoot(),
  ],
  exports: [CustomGridComponent]
})
export class CustomGridModule { }
