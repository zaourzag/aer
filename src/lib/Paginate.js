// WIP paginating class that will be used for leaderboards and other commands too
module.exports = class Paginator {

	constructor(entries, options = { header: null, split: 10 }) {
		this.entries = entries;
		this.options = options;
	}

	display(page = 0, cb = entry => entry) {
		const paginatedEntries = this.entries.slice(page * this.options.split, (page * this.options.split) + this.options.split);
		const output = ['```asciidoc'];
		if (this.options.header) output.push(this.options.header);
		for (let i = page * 10; i < (page * 10) + this.options.split && i < paginatedEntries.length; i++) {
			const entry = paginatedEntries[i];
			// eslint-disable-next-line callback-return
			output.push(`• ${Paginator.padLeft(i + 1)}: ${cb(entry)}`);
		}
		output.push('```');
		return output.join('\n');
	}

	// pads multiple digit numbers with leading whitespaces so they're in a line
	static padLeft(number, n = 2) {
		return new Array(n).join(' ').slice(n * -1) + number;
	}

};
