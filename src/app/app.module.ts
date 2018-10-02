import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxAutogrowModule } from 'ngx-autogrow';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgxAutogrowModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
