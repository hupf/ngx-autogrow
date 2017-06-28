import { NgModule } from '@angular/core';
import { AutogrowDirective } from './autogrow.directive';

@NgModule({
  declarations: [
    AutogrowDirective
  ],
  exports: [
    AutogrowDirective
  ]
})
export class AutogrowModule {}
