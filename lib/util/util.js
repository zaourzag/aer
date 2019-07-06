exports.trimString = (str, max = 30) => {
	if (str.length > max) return `${str.substr(0, max)}...`;
	return str;
};

exports.random = (n1, n2) => Math.floor(Math.random() * (n2 - n1)) + n1;

exports.randomArray = array => array[this.random(0, array.length)];
