import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { CustomGridModule } from './custom-grid/custom-grid.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    CustomGridModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
