# UI Starter Kit (replace with the title of the Project)

This is a template to initiate project with preinstalled library for design system and data visualization and tooling for linting and prettier.

## Table of Contents

- [Link for the visualization](#section-01)
- [Deployment](#deployment)
- [Steps to integrate the vis in static page](#section-02)
- [Pages on DFx where This Viz is Used](#section-03)
- [Related Repos](#section-04)
- [Build With](#section-06)
- [Installation](#section-07)
- [Local Deployment](#section-08)
- [Available Scripts](#section-09)
- [Tooling Setup](#section-10)

## Link for the visualization<a name="section-01"></a>

[{{link to the site here}}]({{link to the site here}})

## Deployment<a name="deployment"></a>

The Production site deployed using Azure Static Web App and the workflow yml can be found in `.github/workflow` folder

## Steps to Integrating the Visualization in the Data Future Platform or Any Other Page<a name="section-02"></a>

Add the following div in the page

```
<div id="root"></div>
```

Apart from the mentioned `div` above the following `script` and `link` needs to be added to the `head` or in the embed code

```
<script defer="defer" type="module" src="<Link to the Visualization Mentioned Above>/index.js"></script>
<link rel="stylesheet" src="<Link to the Visualization Mentioned Above>/style.css"></link>
```

## Pages on DFx Where the Visualization is Used<a name="section-03"></a>

_All the pages on the DFx or other places like viva topics etc. where this visualization is embedded or used._

## Related Repos<a name="section-04"></a>

- [__name of the data repo__](link to data repo): This is the data sheet for visualization

## Build with<a name="section-06"></a>

- **React(v19.x)**: Used as MVC framework.
- **@undp/design-system-react**: For UI elements. Documentation can be found [here](https://react.design.undp.org/)
- **@undp/data-viz**: For visualizations. Documentation can be found [here](https://dataviz.design.undp.org/)

## Installation<a name="section-07"></a>

This project uses `npm`. For installation you will need to install `node` and `npm`, if you don't already have it. `node` and `npm` can be installed from [here](https://nodejs.org/en/download/).

To install the project, simply clone the the repo and them run `npm install` in the project folder. You can use terminal on Mac and Command Prompt on Windows.

This project is bootstrapped with [`Vite`](https://vitejs.dev/) and was created using `npm create vite@latest` command.

Run the terminal or command prompt and then run the following

```
git clone https://github.com/UNDP-Data/{{projectName}}.git
cd {{projectName}}
npm install
```

## Local Development<a name="section-08"></a>

To start the project locally, you can run `npm run dev` in the project folder in terminal or command prompt.

This is run the app in development mode. Open [http://localhost:5173/](http://localhost:5173/) to view it in the browser.

The page will reload if you make edits. You will also see any lint errors in the console.

## Available Scripts<a name="section-09"></a>

- `npm run dev`: Executes `vite` and start the local server for local deployment.
- `npm run build`: Executes `tsc && vite build` and builds the app for production and deployment.
- `npm run clean`: Executes `rimraf node_modules && rimraf dist && rimraf package-lock.json` and remove node_modules folder, dist folder and package-lock.json.
- `npm run lint`: Executes `npx eslint --fix && npx prettier . --write` and resolve all the linting and prettier errors.

## Tooling Setup<a name="section-10"></a>

This project uses ESLint integrated with prettier, which verifies and formats your code so you don't have to do it manually. You should have your editor set up to display lint errors and automatically fix those which it is possible to fix. See [http://eslint.org/docs/user-guide/integrations](http://eslint.org/docs/user-guide/integrations).

This project is build in Visual Studio Code, therefore the project is already set up to work with. Install it from [here](https://code.visualstudio.com/) and then install this [eslint plugin](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and you should be good to go.
