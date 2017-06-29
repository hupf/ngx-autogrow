# ngx-autogrow

Angular directive for automatically height-adjusted textareas that also works within scrolling
containers. Based on [autogrow.js](https://github.com/topaxi/autogrow.js) by Damian Senn.

## Usage

Import ``AutogrowModule`` in your app or shared module:

    import { NgModule } from '@angular/core';
    import { AutogrowModule } from 'ngx-autogrow';

    @NgModule({
      imports: [
        AutogrowModule
      ]
    })
    export class AppModule {}

Define the directive on the textareas that should grow with their content:

    <textarea autogrow></textarea>

Alternatively define an initial height:

    <textarea autogrow rows="5"></textarea>


## Authors

Mathis Hofer, Damian Senn


## License

MIT
