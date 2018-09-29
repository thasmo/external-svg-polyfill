export default interface Options {
	target: string|SVGUseElement[]|NodeListOf<SVGUseElement>;
	context: HTMLElement;
	root: HTMLElement;
	run: boolean;
	replace: boolean;
	detect: boolean;
	observe: boolean;
}
