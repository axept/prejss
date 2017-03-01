# PreJSS 🎨

[![npm version](https://img.shields.io/npm/v/prejss.svg?style=flat-square)](https://www.npmjs.com/package/prejss)
[![npm downloads](https://img.shields.io/npm/dt/prejss.svg?style=flat-square)](https://www.npmjs.com/package/prejss)
[![npm license](https://img.shields.io/npm/l/prejss.svg?style=flat-square)](https://www.npmjs.com/package/prejss)

Fast, scoped, component-friendly and fully customizable PostCSS-to-JSS adapter. Use the best bits of [PostCSS](https://github.com/postcss/postcss), syntax and plugins ([one](https://github.com/postcss/postcss#plugins), [two](http://postcss.parts/), [three](https://github.com/jjaderg/awesome-postcss#plugins)) to get that all as [JSS](https://github.com/cssinjs/jss) objects from [Tagged Template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals) (a recent addition to JavaScript/ES6).

> PostCSS is a tool for transforming styles with JS plugins. These plugins can lint your CSS, support variables and mixins, transpile future CSS syntax, inline images, and more.

PreJSS allows you to get [JSS objects](https://github.com/cssinjs/jss#example) "on-the-fly" from plain CSS, PostCSS, SCSS, CSS Modules, Stylus and LESS styles. Just put your CSS and get it as JSS.

Beside of that, PreJSS is the shortest way to get high-optimized [Critical CSS](https://www.smashingmagazine.com/2015/08/understanding-critical-css/) for [Isomorphic Applications](https://www.slideshare.net/denisizmaylov/performance-and-scalability-art-of-isomorphic-react-applications) while it still fits good for Single Page Applications.

Are you new to JSS? It will save your time, improve your productivity and reduce cognitive loading by allowing you to use CSS and [JSS notation](https://top.fse.guru/jss-is-css-d7d41400b635#.72jbezmkj) together. It means sometimes you can write CSS, sometimes - JSS. That all according to your choice.

Supports:

+ [React.js for Web](#example)
+ React Native ([WIP](https://github.com/axept/prejss/issues/9))
+ [Vanilla JS and any kind of Template Engines](#render-with-vanilla-js)
+ [SSR (Server-side Rendering)](#server-side-rendering)
+ [Disabled JavaScript in Web Browser](#disabled-javascript-in-web-browser)
+ [Fast Run-time execution by Babel plugin](#precompilation)
+ [Hot Module Replacement with webpack](#hot-module-replacement-with-webpack)
+ [Linting](#linting)
+ Syntax Highlighting ([WIP](https://github.com/axept/prejss/issues/12))

![Diagram](https://raw.githubusercontent.com/axept/prejss/master/docs/prejss-schema.png)

## Content

+ [Motivation](#motivation)
+ [Installation](#installation)
+ [Getting Started](#getting-started)
+ [Example](#example)
+ [Adapters](#adapters)
+ [Pre-compilation](#pre-compilation)
+ [Ecosystem](#ecosystem)
+ [Inspiration](#inspiration)
+ [Thanks](#thanks)

## Motivation

CSS is good enough solution when you develop web-sites and simple UIs.

But when you develop Web Applications and complex UIs, CSS is something like legacy.

Since 2015 we use React Native where [styles are defined by JavaScript objects](https://facebook.github.io/react-native/docs/style.html) and we found it extremely useful. 

But how to migrate from CSS/SCSS to JSS "smoothly and on-time"?

At first we developed [jss-from-css](https://github.com/axept/jss-from-css) for process SCSS-to-JSS migration in cheapest and fastest way.

Lately we have found that it could be just very nice to define JSS styles in [the format which we already used to](#example) and even extend it to use some JavaScript injections and so on. We introduced [Adapters](#adapters) which provides mechanism to use this package also with any CSS-in-JS library.

So out-of-the-box PreJSS allows you to use PostCSS features and plugins which enable you to use:

+ plain CSS
+ [SCSS](https://github.com/postcss/postcss-scss)
+ SASS
+ LESS
+ Stylus
+ SugarSS 

It could help your to migrate "smoothly" from any format above to JSS. That's how we solved this issue.

You can use any of PostCSS plugins like [Autoprefixer](https://github.com/postcss/autoprefixer), [postcss-next](http://cssnext.io/) and so on.

Finally, think about it like:

+ [PostCSS](https://github.com/postcss/postcss) + [Template Strings](https://developers.google.com/web/updates/2015/01/ES6-Template-Strings) + [JSS](https://github.com/jsstyles/jss) + ❤️ = **PreJSS**


## Installation

```bash
npm install prejss --save
```

## Getting Started

To get started using PreJSS in your applications, it would be great to know three things:

+ [Declarations](#example) for styles which are processing by PreJSS
+ [Adapters](#adapters) which processes preparation, parsing and finalization operations for styles (see details below)

The best way to get started right now is to take a look at how these three parts come together to example below.

## Example

```javascript
import color from 'color'
import preJSS from 'prejss'

const styles = preJSS`
  $bg-default: #ccc;
  
  button {
    color: ${props => props.isPrimary ? 'palevioletred' : 'green'};
    display: block;
    margin: 0.5em 0;
    font-family: Helvetica, Arial, sans-serif;

    &:hover {
      text-decoration: underline;
      animation: ${rotate360} 2s linear infinite;
    }
  }
  
  ctaButton {
    @include button;
    
    &:hover {
      background: ${color('blue').darken(0.3).hex()}
    }
  }
  
  @media (min-width: 1024px) {
    button {
      width: 200px;
    }
  }

  @keyframes rotate360 {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(360deg);
    }
  }

  @global {
    body {
      color: $bg-default;
    }
    button {
      color: #888888;
    }
  }
`
```

### Result

The example above transform `styles` to the following object:

```javascript
// ...
const styles = {
  button: {
    color: props => props.isPrimary ? 'palevioletred' : 'green',
    display: 'block',
    margin: '0.5em 0',
    fontFamily: 'Helvetica, Arial, sans-serif',

    '&:hover' {
      textDecoration: 'underline',
      animation: 'rotate360 2s linear infinite'
    }
  },
  
  ctaButton: {
    color: () => 'palevioletred',
    display: 'block',
    margin: '0.5em 0',
    fontFamily: 'Helvetica, Arial, sans-serif',

    '&:hover' {
      textDecoration: 'underline',
      animation: 'rotate360 2s linear infinite',
      background: color('blue').darken(0.3).hex()
    }
  },
  
  '@media (min-width: 1024px)': {
    button: {
      width: 200,
    }
  },

  '@keyframes rotate360': {
    from: {
      transform: 'rotate(0deg)'
    },
    to: {
      transform: 'rotate(360deg)'
    }
  },
  
  '@global': {
    body: {
      color: '#ccc'
    },
    button: {
      color: '#888888'
    }
  }
}
```

### Render with Vanilla JS

```javascript
import jss from 'jss'
import preset from 'jss-preset-default'
import styles from './styles'

// One time setup with default plugins and settings.
jss.setup(preset())

const { classes } = jss.createStyleSheet(styles).attach()

document.body.innerHTML = `
  <div>
    <button class="${classes.button}">Button</button>
    <button class="${classes.ctaButton}">CTA Button</button>
  </div>
`
```

### Render with React.js

```javascript
import jss from 'jss'
import preset from 'jss-preset-default'
import injectSheet from 'react-jss'
import styles from './styles'

// One time setup with default plugins and settings.
jss.setup(preset())

const Buttons = ({ button, ctaButton }) => (
  <div>
    <button className={button}>Button</button>
    <button className={ctaButton}>CTA Button</button>
  </div>
)

export default injectSheet(styles)(Buttons)
```

### Server-Side Rendering

As you well know, React.js and JSS are both support Server-Side Rendering (SSR).

You can use it with `prejss` without any limitations:

```javascript
import express from 'express'
import jss from 'jss'
import preset from 'jss-preset-default'
import React from 'react'
import { renderToString } from 'react-dom/server'
import { SheetsRegistryProvider, SheetsRegistry } from 'react-jss'
// this module is defined in the previous example
import Buttons from './buttons' 

// One time setup with default plugins and settings.
jss.setup(preset())
const app = express()

app.use('/', () => {
  const sheets = new SheetsRegistry()
  const content = renderToString(
    <SheetsRegistryProvider registry={sheets}>
      <Buttons />
    </SheetsRegistryProvider>
  )
  const criticalCSS = sheets.toString()
  res.send(`
    <html>
    <head>
      <style id="critical-css" type="text/css">
      ${criticalCSS}
      </style>
    </head>
    <body>
      ${content}
    </body>
    </html>
  `)
})

app.listen(process.env['PORT'] || 3000)
```

#### Performance Matters

PostCSS parser is using by default in PreJSS. Since PostCSS is adopted for high performance - it uses async approach. How to get it as sync PreJSS Constraint? At the moment PreJSS uses [deasync](https://github.com/abbr/deasync) for parsing CSS styles on the server. It has some unpleasant costs - `deasync` blocks Event Loop so everything could be blocked until CSS parsing operation is processing.

Everything will be OK if you use basic approach which has been described in [Example](#example). In this way `deasync` affects only total launch time for server application. Generally it's not critical when we compare it with DX (Developer Experience), useful usage.

But if you wrap PreJSS Constraints to functions - it will cause the problem. Let's have a look:

```javascript
import preJSS from 'prejss'

app.use('/', () => {

  // At this point Event Loop will be blocked by deasync
  // It means other requests will be "frozen" until CSS is processing

  const customStyles = preJSS`
    button {
      color: green;
      display: block;
      margin: 0.5em 0;
      font-family: Helvetica, Arial, sans-serif;
    }
  `

  res.send(getCustomizedPage(customStyles))
})
```

#### Async Adapters as Solution

If you have wrapped PreJSS Constraints please use async [Adapter](#adapters) and async-await:

```javascript
import preJSS, { preJSSAsync } from 'prejss'

app.use('/', async () => {

  // At this point Event Loop will not be blocked 
  // Other requests will be processing parallely while CSS is processing

  const customStyles = await preJSSAsync`
    button {
      color: green;
      display: block;
      margin: 0.5em 0;
      font-family: Helvetica, Arial, sans-serif;
    }
  `

  res.send(getCustomizedPage(customStyles))
})
```

It will totally solve deasync effect. 

_Notice: If you don't have async-await (e.g. you have Node.js version lower than 7.6) it will [work as well as Promises](https://medium.com/@bluepnume/learn-about-promises-before-you-start-using-async-await-eb148164a9c8#.rholfri5v)._

## Disabled JavaScript in Web Browser

[Server-Side Rendering](#server-side-rendering) and Critical CSS both allows your users to see page even without JavaScript in Web Browsers. You could implement GET and POST fallbacks for all possible actions such as CRUD operations like Google did it.

## Adapters

Under hood [postcss-js](https://github.com/postcss/postcss-js) is using for parsing CSS styles to make it applicable for JSS.

What does it mean "Adapters" in PreJSS? It looks like as "class-to-function" adapter with lifecycle hooks. [You already know this concept](https://facebook.github.io/react/docs/react-component.html#the-component-lifecycle) if you learned React.js or [Ember.js](https://guides.emberjs.com/v2.6.0/components/the-component-lifecycle/).

PreJSS Adapters covers `prepare`, `parse` and `finalize` steps.

Default (built-in) Adapter implements only `parse` step.

You can create (and distribute!) your own adapters or customize existed one by overriding any of those steps:

+ `prepare(rawStyles: string): string`

   This hook is using for creating custom pre-processing CSS. It calls before `parse()` and looks like [Redux middleware](http://redux.js.org/docs/advanced/Middleware.html). For example, you can strip JavaScript comments or execute embedded JavaScript code. See example below.

+ `parse(CSS: string): object`

   The main hook which is using for converting CSS to JSS Object. Default Adapter uses PostCSS Processor for this operation.

+ `finalize(result: object): object`

   This hook is using for post-processing your final object. Here you can convert your JSS Objects to React Native or [any other JSS library](https://github.com/hellofresh/css-in-js-perf-tests).

Feel free to play with it:

```javascript
import preJSS, { createAdapter, defaultAdapter, keyframes } from 'prejss'

const fromMixedCSS = createAdapter({
  ...defaultAdapter,
  prepare: rawStyles => defaultAdapter.prepare(
    rawStyles.replace(/^\s*\/\/.*$/gm, '') // remove JS comments
  ),
})

const getStyles = ({ color, animationSpeed, className }) => fromMixedCSS`
  ${'button' + (className ? '.' + className : '')}
    color: ${() => color || 'palevioletred'};
    display: block;
    margin: 0.5em 0;
    font-family: Helvetica, Arial, sans-serif;
    
    // Let's rotate the board!
    &:hover {
      text-decoration: underline;
      animation: rotate360 ${animationSpeed || '2s'} linear infinite;
    }
  }
  
  // Special styles for Call-to-Action button
  ctaButton {
    @include button;
    
    &:hover {
      background: ${color('blue').darken(0.3).hex()}
    }
  }
`
```

## Pre-compilation

It's not great idea to parse CSS in run-time on client-side. It's slow and expensive operations. Additonaly it requires to include PostCSS (or any other parsers) to JavaScript bundle. 

The good news is that we don't have to do it! 🎉 Really.

There is great [babel-plugin-prejss](https://github.com/axept/babel-plugin-prejss) plugin which transforms PreJSS Constraints CSS styles example above to JSS object in the final scripts.

Step-by-Step manual:

1. Add `babel-plugin-prejss` to your project:

   ```bash
   npm install babel-plugin-prejss --save-dev
   ```

2. Configure it by updating `.babelrc` in your project directory:

   ```
   plugins: [
     [
       'prejss', {
         'namespace': 'preJSS'
       }
     ]
   ]
   ```
   
3. Build your project! In your JavaScript bundles you will have replaced `preJSS` constraints by JSS objects directly. Babel do it for you. Not a magic - just a next generation JavaScript today. 😉

## Hot Module Replacement with webpack

You can get Hot Module Replacement by using webpack and PostJSS loader to get real-time updates while you work with the project.

+ [See how it works](https://github.com/lttb/postjss#hot-module-replacement)

Step-by-Step manual:

1. Add `postjss` to your project:

   ```bash
   npm install postjss --save
   ```

2. Configure your webpack to use it:

   ```
   {
     test: tests.js,
     use: [
       'postjss/webpack/report-loader',
       'babel-loader',
       'postjss/webpack/hot-loader',
     ],
   },
   ```

## Linting

Since we use PostCSS as default adapter - you can use [stylelint](https://github.com/stylelint/stylelint) for linting and [postcss-reporter](https://github.com/postcss/postcss-reporter) for warnings and errors.

So it works with using [PostJSS](https://github.com/lttb/postjss#linting) like a charm:

![Demo](https://cloud.githubusercontent.com/assets/11135392/23332827/1d705f20-fb91-11e6-8b13-146a65cf3ed5.gif)

## Ecosystem

+ [babel-plugin-prejss](https://github.com/lttb/babel-plugin-prejss) - plugin for Babel for pre-compiliation PreJSS constraints to JSS Objects
+ [postjss](https://github.com/lttb/postjss) - loader for webpack to put Hot Module Replacement feature to your work process

## Inspiration

+ https://github.com/styled-components/styled-components

## Thanks

We would love to say huge thanks for helping us:

+ Oleg Slobodskoi aka [kof](https://github.com/kof)
+ Artur Kenzhaev aka [lttb](https://github.com/lttb/)

[And you? 😉](https://github.com/axept/prejss/issues/new)
