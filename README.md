# ngx-autogrow

Angular directive for automatically height-adjusted textareas that also works within scrolling
containers. Based on [autogrow.js](https://github.com/topaxi/autogrow.js) by Damian Senn.

## Usage

Import `NgxAutogrowModule` in your app or shared module:

    import { NgModule } from '@angular/core';
    import { NgxAutogrowModule } from 'ngx-autogrow';

    @NgModule({
      imports: [
        NgxAutogrowModule
      ]
    })
    export class AppModule {}

Define the directive on the textareas that should grow with their content:

    <textarea autogrow></textarea>

Alternatively define an initial height:

    <textarea autogrow rows="5"></textarea>

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Authors

Mathis Hofer, Damian Senn

## License

MIT
