import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContextMenuModule } from '../context-menu/context-menu.module';
import { CustomGridComponent } from './custom-grid.component';
import { InlineEditComponent } from './inline-edit/inline-edit.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [CustomGridComponent, InlineEditComponent],
  imports: [
    CommonModule,
    FormsModule,
    ContextMenuModule.forRoot(),
  ],
  exports: [CustomGridComponent]
})
export class CustomGridModule { }
