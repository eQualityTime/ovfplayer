# OpenVoiceFactory

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.8.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Run `ng serve --host 0.0.0.0` for testing on remote devices.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

Run `ng test --source-map=false` to execute the unit tests if getting unknown errors!

## Code Coverage

Run `ng test --watch=false --code-coverage` to generate the code coverage report

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Running PWA locally
Run `npm run dist`.

Then start server `http-server -p 8080 -c-1 dist/open-voice-factory`

## Updating licence in new files
Add `::START::LICENCE::  ::END::LICENCE::` in a comment in the file at the top

Run `npm run update-licence` to update the licence

## Run linting locally
Run `ng lint`
