# Findora JavaScript SDK

## Technology Stack

TypeScript, axios, jest, webpack5

## Prerequisites

### Packages to be installed on a global level

1. Install [Node.js](https://nodejs.org/en/download/) (version >= v12.18.1 );
2. Install **yarn** package management tool globally;

```bash
$ npm install -g yarn
```

### Project dependencies installation

In the project directory, execute the following command:

```bash
$ yarn install
```

## Development

### Start the development environment

For the purpose of developing new features, testing the changes, as well as the TS compilation, project has a **sandbox** file, which you can modify and save, and after that the source code would be re-compiled and executed.

To do so, first, in the project root directory execute this command, and wait for the console log output to appear.

```bash

$ yarn start

```

Then, modify `src/run.ts` file, and save it, so the code would be re-compiled, executed and re-rendered in the output.

### Testing

For the sake of consistency, all the tests should be created with `.spec.ts` extension, at the same level, where the tested file is located.

For example, for `src/utils.ts` the test file should be named as `src/utils.spec.ts`.

To run the tests, in the project root directory execute this command, and wait for the console log output to appear.

```bash

$ yarn test

```

### Code quality

With the idea of following good practices and standards, code should be **linted** and cleaned-up before being commited. The project is configured to use **eslint** and **prettier** for this purpose.

To run the linting, in the project root directory execute this command, and wait for the console log output to appear.

```bash

$ yarn lint

```

### Typing with \*.d.ts

The project is configured in such as way, so there is no need to manually create types. After running **build** command, all the types are generated automatiacally, based on _.ts_ files annotations.

## Build

Execute the following commands in the project directory to build resources for execution in the production environment.

```bash

$ yarn build

```

> Compiled bundles as well as the exported types, would be located in **"root directory/dist"**
