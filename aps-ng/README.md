# ApsNg

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.0.5.

# Requeriments
* [Node JS](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
* [Angular](https://angular.dev/installation)
* [PrimeNG](https://primeng.org/installation)
* [TailwindCSS (com Angular)](https://tailwindcss.com/docs/installation/framework-guides/angular)
* [TailwindCSS (com PrimeNG)](https://primeng.org/tailwind)

Install the JavaScript bloat on Debian 12:
```bash
# sudo apt install nodejs # outdated for this project
sudo apt install npm
sudo npm install -g @angular/cli
npm install primeng @primeng/themes
npm install tailwindcss @tailwindcss/postcss postcss --force
npm i tailwindcss-primeui

# Install Node.js v22.16.0 (LTS), since the version in Debian 12 repository is not enough for this project
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
\. "$HOME/.nvm/nvm.sh"
nvm install 22

npm install # on this directory
```

## Development server

To start a local development server, run:
```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
