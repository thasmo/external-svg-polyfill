import Options from './Options';

export default class Polyfill {
	private options: Options;
	private parser: HTMLAnchorElement;
	private observer: MutationObserver;
	private process: boolean;
	private cache: {
		files: Map<string, HTMLElement|null>;
		elements: Map<SVGUseElement, string>;
	};
	private handler: {
		viewportChange: EventListener;
		documentChange: MutationCallback;
	};

	private defaults: Options = {
		target: 'svg use[href], svg use[xlink\\:href]',
		context: window.document.body || window.document.documentElement,
		root: window.document.body || window.document.documentElement,
		run: true,
		prefix: true,
		detect: true,
		observe: true,
		crossdomain: true,
		namespace: 'external-svg-polyfill',
		agents: [
			/msie|trident/i,
			/edge\/12/i,
			/ucbrowser\/11/i,
		],
	};

	public constructor(options?: Options) {
		this.options = {
			...this.defaults,
			...options,
		};

		this.cache = {
			files: new Map(),
			elements: new Map(),
		};

		this.handler = {
			viewportChange: this.onViewportChange.bind(this),
			documentChange: this.onDocumentChanged.bind(this),
		};

		this.observer = new MutationObserver(this.handler.documentChange);
		this.parser = window.document.createElement('a');

		this.process = !this.options.detect || this.detect();
		this.options.run && this.run();
	}

	public run(): void {
		this.updateElements();
		this.options.observe && this.observe();
	}

	public detect(): boolean {
		return this.options.agents.some((agent: RegExp) => agent.test(window.navigator.userAgent));
	}

	public observe(): void {
		this.observer.observe(this.options.context, {
			childList: true,
			subtree: true,
			attributes: true,
			attributeFilter: ['href', 'xlink:href'],
		});

		window.addEventListener('resize', this.handler.viewportChange);
		window.addEventListener('orientationchange', this.handler.viewportChange);
	}

	public unobserve(): void {
		this.observer.disconnect();

		window.removeEventListener('resize', this.handler.viewportChange);
		window.removeEventListener('orientationchange', this.handler.viewportChange);
	}

	public destroy(): void {
		this.unobserve();

		this.cache.elements.forEach((value, element) => {
			this.dispatchEvent(element, 'revoke', { value }, () => {
				this.renderFrame(() => {
					this.setLinkAttribute(element, value);
					this.cache.elements.delete(element);
				});
			});
		});

		this.cache.files.forEach((file, address) => {
			file && this.dispatchEvent(file, 'remove', { address }, () => {
				this.renderFrame(() => this.options.root.removeChild(file));
				this.cache.files.delete(address);
			});
		});
	}

	private updateElements(): void {
		const elements = typeof this.options.target === 'string'
			? [].slice.call(this.options.context.querySelectorAll(this.options.target))
			: this.options.target;

		Array.from(elements).forEach(this.processElement.bind(this));
	}

	private processElement(element: SVGUseElement): void {
		const value = element.getAttribute('href') || element.getAttribute('xlink:href');

		if (value && !value.startsWith('#') && !this.cache.elements.has(element)) {
			this.parser.href = value;

			if (this.process || (this.options.crossdomain && window.location.origin !== this.parser.origin)) {
				const address = this.parser.href.split('#')[0];
				const identifier = this.generateIdentifier(this.parser.hash, this.parser.pathname);

				if (address && !this.cache.files.has(address)) {
					this.dispatchEvent(element, 'load', { address }, () => {
						this.cache.files.set(address, null);
						this.loadFile(address);
					});
				}

				this.dispatchEvent(element, 'apply', { address, identifier }, () => {
					this.renderFrame(() => {
						this.setLinkAttribute(element, `#${identifier}`);
						this.cache.elements.set(element, value);
					});
				});
			}
		}
	}

	private loadFile(address: string): void {
		const loader = new XMLHttpRequest();
		loader.addEventListener('load', (event: Event) => this.onFileLoaded.call(this, event, address));
		loader.open('get', address);
		loader.responseType = 'document';
		loader.send();
	}

	private generateIdentifier(identifier: string, prefix: string): string {
		identifier = identifier.replace('#', '');
		prefix = prefix.replace(/^\//, '').replace(/\.svg$/, '').replace(/[^a-zA-Z0-9]/g, '-');

		return this.options.prefix
			? `${prefix}-${identifier}`
			: identifier;
	}

	private dispatchEvent(element: Element, name: string, detail?: any, callback?: Function): void {
		const event = window.document.createEvent('CustomEvent');
		event.initCustomEvent(`${this.options.namespace}.${name}`, true, true, detail);

		element.dispatchEvent(event);

		if (!event.defaultPrevented && callback) {
			callback();
		}
	}

	private renderFrame(callback: FrameRequestCallback): void {
		window.requestAnimationFrame(callback.bind(this));
	}

	private setLinkAttribute(element: SVGUseElement, value: string): void {
		element.hasAttribute('href') && element.setAttribute('href', value);
		element.hasAttribute('xlink:href') && element.setAttribute('xlink:href', value);
	}

	private prefixValues(file: HTMLElement, prefix: string): void {
		const value = file.getAttribute('id')!;

		if (value) {
			const identifier = this.generateIdentifier(value, prefix);
			file.setAttribute('id', identifier);
		}

		[].slice.call(file.querySelectorAll('[id]')).forEach((reference: HTMLElement) => {
			const value = reference.getAttribute('id');

			if (value) {
				const identifier = this.generateIdentifier(value, prefix);
				reference.setAttribute('id', identifier);

				[].slice.call(file.querySelectorAll(`[fill="url(#${value})"]`)).forEach((referencee: HTMLElement) => {
					referencee.setAttribute('fill', `url(#${identifier})`);
				});
			}
		});
	}

	private onDocumentChanged(): void {
		this.updateElements();
	}

	private onViewportChange(): void {
		this.updateElements();
	}

	private onFileLoaded(event: Event, address: string): void {
		const file = (event.target as XMLHttpRequest).response.documentElement;
		file.setAttribute('aria-hidden', 'true');
		file.style.position = 'absolute';
		file.style.overflow = 'hidden';
		file.style.width = 0;
		file.style.height = 0;

		this.cache.files.set(address, file);

		if (this.options.prefix) {
			this.parser.href = address;
			this.prefixValues(file, this.parser.pathname);
		}

		this.dispatchEvent(this.options.root, 'insert', { address, file }, () => {
			this.renderFrame(() => {
				this.options.root.insertAdjacentElement('afterbegin', file);
			});
		});
	}
}
