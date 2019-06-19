exports.trimString = (str, max = 30) => {
	if (str.length > max) return `${str.substr(0, max)}...`;
	return str;
};
