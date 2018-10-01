import Options from './Options';
import detect from '../common/detect';

export default class Polyfill {
	private options: Options;
	private parser: HTMLAnchorElement;
	private observer: MutationObserver;
	private cache: any = {
		files: {},
		elements: {},
	};

	private defaults: Options = {
		target: 'svg use',
		context: window.document.body || window.document.documentElement,
		root: window.document.body || window.document.documentElement,
		run: true,
		prefix: true,
		detect: true,
		observe: true,
	};

	private handlers = {
		documentChange: this.onDocumentChanged.bind(this),
	};

	public constructor(options?: Options) {
		this.set(options);
		this.parser = window.document.createElement('a');
		this.options.run && this.run();
	}

	public set(options?: Options): void {
		this.options = {
			...this.defaults,
			...options,
		};
	}

	public run(): void {
		if (!this.options.detect || detect()) {
			this.updateElements();
			this.options.observe && this.observe();
		}
	}

	public observe(): void {
		if (typeof MutationObserver !== 'undefined') {
			this.observer = new MutationObserver(this.handlers.documentChange);

			this.observer.observe(this.options.context, {
				childList: true,
				subtree: true,
				attributes: true,
			});
		} else {
			this.options.context.addEventListener('DOMSubtreeModified', this.handlers.documentChange);
		}
	}

	public unobserve(): void {
		if (typeof MutationObserver !== 'undefined') {
			this.observer && this.observer.disconnect();
			delete this.observer;
		} else {
			this.options.context.removeEventListener('DOMSubtreeModified', this.handlers.documentChange);
		}
	}

	public destroy(): void {
		this.unobserve();

		Object.keys(this.cache.elements).forEach((value) => {
			const dispatch = this.dispatchEvent(this.cache.elements[value], 'revoke', {
				value,
			});

			if (!dispatch.defaultPrevented) {
				this.renderFrame(() => {
					this.setLinkAttribute(this.cache.elements[value], value);
					delete this.cache.elements[value];
				});
			}
		});

		Object.keys(this.cache.files).forEach((address) => {
			const dispatch = this.dispatchEvent(this.cache.files[address], 'remove', {
				address,
			});

			if (!dispatch.defaultPrevented) {
				this.renderFrame(() => {
					this.options.root.removeChild(this.cache.files[address]);
					delete this.cache.files[address];
				});
			}
		});
	}

	private updateElements(): void {
		const elements = typeof this.options.target === 'string'
			? [].slice.call(this.options.context.querySelectorAll(this.options.target))
			: this.options.target;

		elements.forEach(this.processElement.bind(this));
	}

	private processElement(element: HTMLElement): void {
		const value = element.getAttribute('xlink:href') || element.getAttribute('href');

		if (value && value[0] !== '#' && !this.cache.elements.hasOwnProperty(value) && (this.parser.href = value)) {
			const address = this.parser.href.split('#')[0];
			const identifier = this.generateIdentifier(this.parser.hash, this.parser.pathname);

			if (address && !this.cache.files.hasOwnProperty(address)) {
				const dispatch = this.dispatchEvent(element, 'load', {
					address,
				});

				if (!dispatch.defaultPrevented) {
					this.cache.files[address] = null;
					this.loadFile(address);
				}
			}

			const dispatch = this.dispatchEvent(element, 'apply', {
				address,
				identifier,
			});

			if (!dispatch.defaultPrevented) {
				this.renderFrame(() => {
					this.setLinkAttribute(element, `#${identifier}`);
					this.cache.elements[value] = element;
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

	private dispatchEvent(element: HTMLElement, name: string, detail?: any): CustomEvent {
		const event = window.document.createEvent('CustomEvent');
		event.initCustomEvent(`external-svg-polyfill.${name}`, true, true, detail);

		if (element.dispatchEvent) {
			element.dispatchEvent(event)
		} else if (element.fireEvent) {
			element.fireEvent(event);
		}

		return event;
	}

	private renderFrame(callback: FrameRequestCallback): void {
		(window.requestAnimationFrame || window.setTimeout)(callback.bind(this));
	}

	private setLinkAttribute(element: HTMLElement, value: string): void {
		element.hasAttribute('href')
			? element.setAttribute('href', value)
			: element.setAttribute('xlink:href', value);
	}

	private onDocumentChanged(): void {
		this.updateElements();
	}

	private onFileLoaded(event: Event, address: string): void {
		const file = (event.target as XMLHttpRequest).response.documentElement;
		file.setAttribute('aria-hidden', 'true');
		file.style.position = 'absolute';
		file.style.overflow = 'hidden';
		file.style.width = 0;
		file.style.height = 0;

		this.cache.files[address] = file;

		if (this.options.prefix) {
			this.parser.href = address;

			[].slice.call(file.querySelectorAll('[id]')).forEach((reference: HTMLElement) => {
				const value = reference.getAttribute('id')!;
				const identifier = this.generateIdentifier(value, this.parser.pathname.replace(/^\//, ''));

				reference.setAttribute('id', identifier);

				[].slice.call(file.querySelectorAll(`[fill="url(#${value})"]`)).forEach((referencee: HTMLElement) => {
					referencee.setAttribute('fill', `url(#${identifier})`);
				});
			});
		}

		const dispatch = this.dispatchEvent(this.options.root, 'insert', {
			address,
			file,
		});

		if (!dispatch.defaultPrevented) {
			this.renderFrame(() => {
				this.options.root.insertAdjacentElement('afterbegin', file);
			});
		}
	}
}
