export default(): boolean => {
	const agents = {
		edge: /Edge\/12/,
		safari: /Version\/6\.0.+Safari/,
		ucbrowser: /UCBrowser\/11/,
	};

	return Boolean(window.document.documentMode)
		|| agents.edge.test(window.navigator.userAgent)
		|| agents.safari.test(window.navigator.userAgent)
		|| agents.ucbrowser.test(window.navigator.userAgent);
}
