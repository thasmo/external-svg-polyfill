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
*Defines the context in which to search for SVG use elements.*  
*default* `window.document.body || window.document.documentElement`

**root** `node`  
*Defines the element to which prepend SVG embeds to.*  
*default* `window.document.body || window.document.documentElement`

**prefix** `boolean`  
*Prefix `id` attribute values to ensure uniqueness. `false` won't change the attributes.*  
*default* `true`

**detect** `boolean`  
*Detect browser-support automatically. `false` will run the polyfill in any browser.*  
*default* `true`

**observe** `boolean`  
*Observe DOM changes within the `context` element and rerun the polyfill.*  
*default* `true`

## Alternatives

* [**SVG for Everybody**](https://github.com/jonathantneal/svg4everybody) by [*Jonathan Neal*](https://github.com/jonathantneal)
* [**svgxuse**](https://github.com/Keyamoon/svgxuse) by [*Keyamoon*](https://github.com/Keyamoon)
* [**SVG\<use\>It**](https://github.com/sinnerschrader/svg-use-it) by [*SinnerSchrader*](https://github.com/sinnerschrader)

## Misc

* Browser logos from [alrra/browser-logos](https://github.com/alrra/browser-logos).
* Bundler logos from [gilbarbara/logos](https://github.com/gilbarbara/logos).
* Browser testing via [browserstack](https://github.com/browserstack).

## Testing

[![BrowserStack](https://www.browserstack.com/images/mail/browserstack-logo-footer.png)](https://www.browserstack.com/)  
[**BrowserStack**](https://www.browserstack.com/) loves open source and provides free manual and automated testing for this project! ❤️

---

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](http://forthebadge.com)
