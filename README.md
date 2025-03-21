![Screenshot of the Lacune Map with the title in bold letters in den center](https://github.com/a-thousand-channels/lacune-map/blob/main/public/lacune-map-og-image.png)

# Lakune Karte

Preview: **https://a-thousand-channels.github.io/lacune-map/**

Map content by Heike Schader, Map design by A Thousand Channels

## Tech stack

Setup with Vue 3, Pinia, Vite, Leaflet + Vue-leaflet

Node > 20

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
