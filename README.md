# External SVG Polyfill
> Polyfills support for referencing [external SVG files](https://css-tricks.com/svg-use-external-source/).

**Implementation**
* Supports `Internet Explorer 11`, `Safari 6` and `UCWeb 11` only.
* User-agent sniffing is used to determine feature support.
* External SVG files are fetched via `xhr` and embedded while `use` elements are updated.
* To prevent naming collision issues, `id` attributes can be updated to a unique name.
* New SVG `use` elements will be processed upon changes in the `DOM`.
* Final file size is under 5 kiB minified.
* Written in TypeScript.

## Setup

### Installation

**npm**
```sh
npm install @thasmo/external-svg-polyfill
```

## Usage

### API
```js
import Polyfill from '@thasmo/external-svg-polyfill';

const polyfill = new Polyfill({
    context: window.document.body,
    root: window.document.body,
    run: false,
    prefix: true,
    detect: true,
    observe: false,
});

polyfill.run();
polyfill.observe();
polyfill.destroy();
```

### Options

**context** `node`  
*default* `window.document.body || window.document.documentElement`

**root** `node`  
*default* `window.document.body || window.document.documentElement`

**prefix** `boolean`  
*default* `true`

**detect** `boolean`  
*default* `true`

**observe** `boolean`  
*default* `true`

## Alternatives

* [**SVG for Everybody**](https://github.com/jonathantneal/svg4everybody) by [*Jonathan Neal*](https://github.com/jonathantneal)
* [**svgxuse**](https://github.com/Keyamoon/svgxuse) by [*Keyamoon*](https://github.com/Keyamoon)
* [**SVG\<use\>It**](https://github.com/sinnerschrader/svg-use-it) by [*SinnerSchrader*](https://github.com/sinnerschrader)

## Misc

* Browser logos from [alrra/browser-logos](https://github.com/alrra/browser-logos).
* Bundler logos from [gilbarbara/logos](https://github.com/gilbarbara/logos).

---

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](http://forthebadge.com)
