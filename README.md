[![Build Status](https://travis-ci.org/ofcyln/currency-exchange.svg?branch=master)](https://travis-ci.org/ofcyln/currency-exchange)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Open Source Love svg2](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://github.com/ellerbrock/open-source-badges/)
![PWA Shields](https://www.pwa-shields.com/1.0.0/series/classic/white/gray.svg)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/0daf17f0d00b492e980b79cb9f1b2980)](https://www.codacy.com/app/ofcyln/currency-exchange?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=ofcyln/currency-exchange&amp;utm_campaign=Badge_Grade)
[![Maintainability](https://api.codeclimate.com/v1/badges/e0d6ef4966fdaffb362d/maintainability)](https://codeclimate.com/github/ofcyln/currency-exchange/maintainability)

# Currency Exchange Project

Currency Exchange Project authored by Osman Fikret Ceylan.

## Usage

### Using the project on live environment

The final app hosted on [https://currencyexchange.work](https://currencyexchange.work).

### Using the project on local environment and using it on Stackblitz

Simply go to this URL: [https://stackblitz.com/github/ofcyln/currency-exchange](https://stackblitz.com/github/ofcyln/currency-exchange)

Stackblitz can only show you the visible UI of the project without cloning it to your local environment. Please not that, for security reasons `Stackblitz` doesn't show images, fonts or font icons that used on the project.

----------------

Run these commands in the terminal to run the app on your local environment

    git clone https://github.com/ofcyln/currency-exchange.git

    npm install

    npm start

or if you use yarn as package manager

    git clone https://github.com/ofcyln/currency-exchange.git

    yarn

    yarn start

### Development server

Run `npm start` or `yarn start` for a dev server to initialize. 
Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Running scripts 

To build the app in `Ahead-Of-Time compilation` you need to run `yarn build:prod` or `npm run build:prod`

To run linter and check the code over tslint rules simply run `yarn lint` or `npm run lint`

### Code scaffolding

Run `ng generate component component-name` to generate a new component. If you don't have `@angular/cli` as a global package on your system, you can run `npx ng generate component component-name`. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `yarn build:prod` or `npm run build:prod` to build the project. 
The build artifacts will be stored in the `dist/` directory.

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## App's Architecture
*   Used latest Angular CLI v10.0.5

*   Used code scaffolding for effective working and clean development environment. Specialized `build`, `deploy`, `lint`, `pre-commit` scripts added to package.json.

*   `lint-staged` script cleans and checks the `TypeScript`, `SCSS` codes before committing any changes to the repository. `prettier`, `stylelint` and `tslint` plugins run in this script.

*   Currency Exchange Project has 4 major components. Namely; **`Auth Component`** - _includes `Login Page` with `Authentication Service` and `Authorization Guard Service`_, **`Core Component`** -_includes `Alert Component`, `Header Component`, `Not Found Component` -wildcard routing redirection component, 404 page-_, **`Converter Component`** and **`History Component`**.

*   Used `SCSS` as a CSS preprocessor to write efficient CSS codes.

*   Used new generation `JavaScript (ES6, ES7)` with `TypeScript`.

*   Used `Angular Services` for sharing app state and data-binding within injected components.

*   Used latest `Bootstrap v4.3.1` version to integrate powerful responsive design powered by CSS FlexBox model.

*   Used `semantic` HTML tags and elements with semantic class names.

*   Modular components created for reusing components elsewhere to improve modularity in the app.

*   Used `Interceptors` to simulate backend-less login functionality while using HTTP request. Integrated `JWT interceptor` to send `token` for necessary request when needed.

*   Used readonly private properties to prevent magic numbers and strings in the project where it needed into the methods.

*   Instead of using images for icons, font icons are integrated into the project with `Fontello` icon package. `Fontello` just includes preferred icons, this helps to balance the file size of the icon package. Created special CurrencyExchange logo SVG font-icon for the project from search font-icon.

*   The app has multiple icons for various Android, IOS devices.

*   App designed from scratch with the inspiration of the Google Material Design principles by the power of the `Angular Material`.

*   Modular components created for reusing components elsewhere to improve modularity in the app.

*   PWA integration has been made for the installation of the app to the devices which supports installation.

## Motivation of Choices on Implementation

*   The form immediately responses to user interactions with its `validation` checkers.

*   `tabindex` values added for form elements in a numeric order to complete the form just with the use of keyboard for accessibility.

*   `Enter` key press in the selection of currencies helps users to select the currency that they want to exchange easily.

*   In case of navigating to a page which doesn't exist in the app, a `wildcard route (404)` is integrated to the project. It redirects users to the `Not Found` page. 

*   If a user doesn't authenticate, page routing redirects users to the `Login` page to be authenticated. After authorization, with the help of the routerSnapshot queryParams, the user can continue to browsing.

*   Form data is sent asynchronously by `HTTP POST request` with `RxJS` observables. The `HTTP POST request` posts the form data to URL `./login`. I also created an interface for a hypothetical response from the server for this request. A refactor must be done when a backend is ready to make it work in a live environment.

*   Login method requests handled with `MockBackendServerInterceptor`. This interceptor checks the user credentials - username and password then if there is a match it returns `HTTP 200 OK response` with a `token`. This will get the user in the app with an authentication. This `MockBackendServerInterceptor` is hypothetical.

*   An authentication service - `AuthGuardService` created to protect routes against unauthorized users. If a `token` exist in the `localStorage`, the user can use the app and reach to the protected routes.

*   Used `localStorage` to store user's currency exchanges with a key:value pair namely `exchangeRates` and an array of exchanged currency information objects. Also, localStorage used to store `token`.

*   Whenever a user enters to the `Converter` page, an asynchronous `HTTP GET request` runs for `https://api.exchangeratesapi.io/latest?base=USD` API.

*   User can convert between selected currencies with the defined amount.

*   Each conversion immediately goes to the `Exchange History` datatable with the exact time of the execution.

*   In `Exchange History` field there is `Duration` select box which user can select the defined time intervals. Under the Duration select box, there are two datatable as well. First one includes `Date` datatable -execution date and time- and the second one includes `Exchange Rate` datatable -statistics of the conversions in selected time intervals-.

*   On `History` page user can see the previous currency exchanges on datatable with the amount of the executions. User can `Delete` the selected item of the datatable or can click to `View` button to create previous exchange scenario on the `Converter` page.

*   Added `Logout` button to the app which redirects the user to the `Login` page. When user routes to the `Login` page, user token is getting removed from localStorage and the user is being unauthorized. 

*   Mobile device UI behaviours designed to improve User Experience in a performing way and coded with the usage of the @media queries.

*   `PWA` support helps users to install the app on their mobile phone and make them use it as a native app. With the integration of `PWA`, it is possible to use the app even if there is no connection to the internet. The offline mode makes the app run under unexpected circumstances. `PWA` integration caches the files with the developer choices. Mostly static files for example image files, icons, font libraries etc.

*   `Angular production build configuration` is used for optimizing bundle, using tree-shaking, aot compilation, compression.

*   The total bundle size of the app is `~500KB` including all CSS, JS, FONT, ICONS for PWA and HTML files.
