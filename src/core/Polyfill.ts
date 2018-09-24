import Options from './Options';
import detect from '../common/detect';

export default class Polyfill {
	private options: Options;
	private parser: HTMLAnchorElement;
	private observer: MutationObserver;
	private files: any = {};
	private elements: any = {};

	private defaults: Options = {
		elements: 'svg use',
		context: window.document.body || window.document.documentElement,
		root: window.document.body || window.document.documentElement,
		run: true,
		replace: true,
		detect: true,
		observe: true,
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
		this.observer = new MutationObserver(this.onDocumentChanged.bind(this));

		this.observer.observe(this.options.context, {
			childList: true,
			subtree: true,
			attributes: true,
		});
	}

	public unobserve(): void {
		this.observer.disconnect();
		delete this.observer;
	}

	public destroy(): void {
		this.unobserve();

		Object.keys(this.elements).forEach((key) => {
			(this.elements[key] as HTMLElement).setAttribute('href', key);
			delete this.elements[key];
		});

		Object.keys(this.files).forEach((key) => {
			this.options.root.removeChild(this.files[key]);
			delete this.files[key];
		});
	}

	private updateElements(): void {
		const elements = typeof this.options.elements === 'string'
			? [].slice.call(this.options.context.querySelectorAll(this.options.elements))
			: this.options.elements;

		elements.forEach(this.processElement.bind(this));
	}

	private processElement(element: SVGUseElement): void {
		const value = element.getAttribute('href');

		if (value && value[0] !== '#' && (this.parser.href = value)) {
			const address = this.parser.href.split('#')[0];

			if (address && !this.files.hasOwnProperty(address)) {
				this.files[address] = null;
				this.loadFile(address);
			}

			const identifier = this.generateIdentifier(this.parser.hash, this.parser.pathname);
			element.setAttribute('href', `#${identifier}`);

			this.elements[value] = element;
		}
	}

	private loadFile(address: string): void {
		const loader = new XMLHttpRequest();
		loader.responseType = 'document';
		loader.addEventListener('load', this.onFileLoaded.bind(this));
		loader.addEventListener('error', console.error);
		loader.open('get', address);
		loader.send();
	}

	private generateIdentifier(identifier: string, suffix: string): string {
		return this.options.replace
			? `${identifier.replace('#', '')}-${suffix.replace(/[^a-zA-Z0-9]/g,'-')}`
			: identifier;
	}

	private onDocumentChanged(): void {
		this.updateElements();
	}

	private onFileLoaded(event: Event): void {
		const file = (event.target as XMLHttpRequest).response.documentElement;
		file.setAttribute('aria-hidden', 'true');
		file.style.position = 'absolute';
		file.style.overflow = 'hidden';
		file.style.width = 0;
		file.style.height = 0;

		this.parser.href = (event.target as XMLHttpRequest).responseURL;

		const address = this.parser.href.split('#')[0];
		this.files[address] = file;

		if (this.options.replace) {
			const elements = [].slice.call(file.querySelectorAll('symbol[id]'));

			elements.forEach((element: HTMLElement) => {
				const identifier = this.generateIdentifier(element.getAttribute('id')!, this.parser.pathname);
				element.setAttribute('id', identifier);
			});
		}

		(window.requestAnimationFrame || window.setTimeout)(() => {
			this.options.root.insertBefore(file, window.document.body.firstChild);
		});
	}
}
