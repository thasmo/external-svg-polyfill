export default(): boolean => {
	const agents = {
		edge: /Edge\/12/,
	};

	return Boolean(window.document.documentMode) || agents.edge.test(window.navigator.userAgent);
}
