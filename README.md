# PreJSS 🎨

Fast, scoped, component-friendly and fully customizable PostCSS-to-JSS adapter. Use the best bits of [PostCSS](https://github.com/postcss/postcss), syntax and plugins ([one](https://github.com/postcss/postcss#plugins), [two](http://postcss.parts/), [three](https://github.com/jjaderg/awesome-postcss#plugins)) to get that all as [JSS](https://github.com/cssinjs/jss) objects from [Tagged Template literals](https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Template_literals) (a recent addition to JavaScript/ES6).

> PostCSS is a tool for transforming styles with JS plugins. These plugins can lint your CSS, support variables and mixins, transpile future CSS syntax, inline images, and more.

PreJSS allows you to use PostCSS, plain CSS, SCSS, CSS Modules, Stylus and LESS styles as JSS objects just "on-the-fly".

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
+ [Example](#example)
+ [Adapters](#adapters)
+ [Precompilation](#precompilation)
+ [Ecosystem](#ecosystem)
+ [Inspiration](#inspiration)
+ [Thanks](#thanks)

## Motivation

CSS is good enough solution when you develop web-sites and simple UIs.

But when you develop Web Applications and complex UIs, CSS is something like legacy.

More than one year we use React Native where is [styles are defining by JavaScript objects](https://facebook.github.io/react-native/docs/style.html).

How to migrate from CSS/SCSS to JSS "smoothly and on-time"?

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

## Example

```javascript
import color from 'color'
import preJSS from 'prejss'

const styles = preJSS`
  $bg-default: #ccc;
  
  button {
    color: ${() => 'palevioletred'};
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
    color: () => 'palevioletred',
    display: 'block',
    margin: '0.5em 0',
    fontFamily: 'Helvetica, Arial, sans-serif',

    '&:hover' {
      textDecoration: 'underline',
      animation: rotate360 + ' 2s linear infinite'
    }
  },
  
  ctaButton: {
    color: () => 'palevioletred',
    display: 'block',
    margin: '0.5em 0',
    fontFamily: 'Helvetica, Arial, sans-serif',

    '&:hover' {
      textDecoration: 'underline',
      animation: rotate360 + ' 2s linear infinite',
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

## Disabled JavaScript in Web Browser

When you use [Server-Side Rendering](#server-side-rendering) it allows you to implement GET and POST fallbacks for all possible actions such as CRUD operations, so you can have Isomorphic Application without having JavaScript in Web Browser.

## Adapters

Under hood [postcss-js](https://github.com/postcss/postcss-js) is using for parsing your styles to make it applicable for JSS.

It has been implmented as "class-to-function" adapter with lifecycle hooks. [You already know how it works](https://facebook.github.io/react/docs/react-component.html#the-component-lifecycle) if you know React.js or [Ember.js](https://guides.emberjs.com/v2.6.0/components/the-component-lifecycle/).

PreJSS Adapters covers `prepare`, `parse` and `finalize` steps. Default Adapter implements only `parse` step.

You can create (and distribute!) your own adapter or customize existed one by overriding any of those steps:

+ `prepare(rawStyles: string): string`

   This hook is using for pre-processing Styles Source to CSS format which is supporting by your parser, like [Redux middleware](http://redux.js.org/docs/advanced/Middleware.html). 

+ `parse(CSS: string): object`

   The main hook which is using for converting your Styles to JSS Object. Default Adapter uses PostCSS for this operation.

+ `finalize(result: object): object`

   This hook is using for post-processing your final object. Here you can convert your JSS Objects to React Native or [any other JSS library](https://github.com/hellofresh/css-in-js-perf-tests)

Feel free to play with it:

```javascript
import preJSS, { createAdapter, defaultAdapter, keyframes } from 'prejss'

const fromMixedCSS = createAdapter({
  ...defaultAdapter,
  prepare: rawStyles => defaultAdapter.prepare(
    rawStyles.replace(/^\s*\/\/.*$/gm, '') // remove JS comments
  ),
})

const rotate360 = keyframes`
  from {
    transform: rotate(0deg);
  }
  
  to {
    transform: rotate(360deg);
  }
`

const getStyles = ({ color, animationSpeed, className }) => fromMixedCSS`
  ${'button' + (className ? '.' + className : '')}
    color: ${() => color || 'palevioletred'};
    display: block;
    margin: 0.5em 0;
    font-family: Helvetica, Arial, sans-serif;
    
    // Let's rotate the board!
    &:hover {
      text-decoration: underline;
      animation: ${rotate360} ${animationSpeed || '2s'} linear infinite;
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

## Precompilation

It's not great idea to parse CSS in run-time on client-side. It's slow and expensive.

Thee good news is that you don't have to do it! 🎉 There is a great [babel-plugin-prejss](https://github.com/axept/babel-plugin-prejss) plugin which transform your PostCSS styles from example above to JSS object in the processed scripts.

+ [See how it works](https://github.com/lttb/babel-plugin-prejss#how-it-works)

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
