import typescript from 'rollup-plugin-typescript';
import {terser} from 'rollup-plugin-terser';

export default {
	input: 'src/index.ts',
	output: {
		file: 'browser/bundle.js',
		format: 'umd',
		name: 'ExternalSvgPolyfill',
	},
	plugins: [
		typescript({
			target: 'es5',
		}),
		terser(),
	],
}
