# External SVG Polyfill
> Small and basic polyfill to support referencing [external SVG files](https://css-tricks.com/svg-use-external-source/)

Browser like `IE9-IE11`, `Edge12`, `Safari 5.1-6`, or `UCWeb11`
[do not support referencing external files](https://caniuse.com/#feat=svg) via location hash.
Referencing external files can be especially useful when dealing with a technique called
*SVG sprites*, where multiple SVG elements are stored within a single SVG file. It is possible
to inline these *SVG sprites* into the HTML document itself, but this has several disadvantages
i.e. caching issues, unneeded HTML file size growth, development inconviniences, etc.
Externally referenced *SVG sprites* mitigate those problems but are not support in the mentioned browsers.

**`external-svg-polyfill` embeds the referenced SVG files automatically.**

**Features**
* User-agent sniffing (which can be disabled) is used to determine feature support.
* External SVG files are fetched via `xhr` and embedded while `use` elements are updated.
* To prevent naming collision issues, `id` attributes are updated to use a unique name.
* Dynamically added SVG `use` elements are processed upon changes in the `DOM`.
* File size is ~ 3.5 KiB minified to keep the load, parse and execution times low.
* Project is written in TypeScript.

## Setup

### Installation

**npm**
```sh
npm install @thasmo/external-svg-polyfill
```

## Usage

Just define some `svg use` elements in the HTML markup and let `external-svg-polyfill` do the rest.

```html
<svg xmlns="http://www.w3.org/2000/svg">
    <use href="assets/sprite.svg#icon"></use>
</svg>
```

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

**target** `string|SVGUseElement[]|NodeListOf<SVGUseElement>`  
*Defines SVG `use` elements to process.*  
*default* `svg use`

**context** `HTMLElement`  
*Defines the context in which to search for SVG use elements.*  
*default* `window.document.body || window.document.documentElement`

**root** `HTMLElement`  
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

## Compatibility

`external-svg-polyfill` works in all browsers in general but polyfills the following.
* `Internet Explorer 11` *tested*
* `Internet Explorer 10` *tested*
* `Safari 6` *tested*
* `UCWeb 11` *untested*

## Alternatives

Some alternatives exist and, in fact, `external-svg-polyfill` was greatly inspired by them. Check them out!

* [**SVG for Everybody**](https://github.com/jonathantneal/svg4everybody) by [*Jonathan Neal*](https://github.com/jonathantneal)
* [**svgxuse**](https://github.com/Keyamoon/svgxuse) by [*Keyamoon*](https://github.com/Keyamoon)
* [**SVG\<use\>It**](https://github.com/sinnerschrader/svg-use-it) by [*SinnerSchrader*](https://github.com/sinnerschrader)
* [**SVG Symbols Polyfill**](https://github.com/evan2x/svg-symbols-polyfill) by [*Evan*](https://github.com/evan2x)
* [**SVGInjector**](https://github.com/iconic/SVGInjector) by [*iconic*](https://github.com/iconic)

## Resources

* [**SVG on the web - A Practical Guide**](https://svgontheweb.com/) by [*Jake Giltsoff*](https://twitter.com/jakegiltsoff)
* [**SVG use with External Source**](https://css-tricks.com/svg-use-external-source/) by [*Chris Coyier*](https://twitter.com/chriscoyier)
* [**SVG use with External Reference, Take 2**](https://css-tricks.com/svg-use-with-external-reference-take-2/) by [*Chris Coyier*](https://twitter.com/chriscoyier)
* [**SVG Sprite Workflow That Works**](https://medium.com/@iamryanyu/svg-sprite-workflow-that-works-f5609d4d6144) by [*Ryan Yu*](https://twitter.com/iamryanyu)
* [**svgomg**](https://jakearchibald.github.io/svgomg/) by [*Jake Archibald*](https://twitter.com/jaffathecake)

## Credits

* Browser logos from [alrra/browser-logos](https://github.com/alrra/browser-logos)
* Bundler logos from [gilbarbara/logos](https://github.com/gilbarbara/logos)
* Browser testing via [browserstack](https://github.com/browserstack)

[![BrowserStack](https://www.browserstack.com/images/mail/browserstack-logo-footer.png)](https://www.browserstack.com/)  
[**BrowserStack**](https://www.browserstack.com/) loves open source and provides free manual and automated testing for this project! ❤️

---

[![forthebadge](https://forthebadge.com/images/badges/built-with-love.svg)](https://forthebadge.com)
