import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgxAutogrowModule } from '../../projects/ngx-autogrow/src/lib/ngx-autogrow.module';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxAutogrowModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
