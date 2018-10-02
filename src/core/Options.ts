export default interface Options {
	target: string|SVGUseElement[]|NodeListOf<SVGUseElement>;
	context: HTMLElement;
	root: HTMLElement;
	run: boolean;
	prefix: boolean;
	detect: boolean;
	observe: boolean;
	namespace: string;
}
