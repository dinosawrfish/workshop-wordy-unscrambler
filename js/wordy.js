import deePool from "./external/deePool.mjs";


export default {
	loadWords,
	findWords
};

var dict = {};
var isWord = Symbol("is-word");
var pool = deePool.create(() => []);
pool.grow(23);

// ****************************

function loadWords(wordList) {
	var nodeCount = 0;

	if (Object.keys(dict).length > 0) {
		dict = {};
	}

	for (let word of wordList) {
		let node = dict;
		for (let letter of word) {
			if (!node[letter]) {
				node[letter] = {
					[isWord]: false
				};
				nodeCount++
			}
			node = node[letter];
		}
		node[isWord] = true;
	}

	return nodeCount;
}

function findWords(input, prefix = "", node = dict) {
	try{
		var allWords = findAllWords(input, prefix, node);
		return [ ...allWords];
	}
	finally {
		allWords.length = 0;
		pool.recycle(allWords);
	}
}

function findAllWords(input, prefix = "", node = dict) {
	var words = pool.use();

	if (node[isWord]) {
		words.push(prefix);
	}

	for (let i = 0; i < input.length; i++) {
		let currentLetter = input[i];

		if (node[currentLetter]) {
			let remainingLetters = pool.use();
			remainingLetters.push(
				...input.slice(0,i),
				...input.slice(i+1)
			);

			let moreWords = findAllWords(
					remainingLetters,
					prefix + currentLetter,
					node[currentLetter]
				);
			words.push(...moreWords);
			moreWords.length = remainingLetters.length = 0;
			pool.recycle(moreWords);
			pool.recycle(remainingLetters);
		}
	}

	// only de duplicate the list on the final
	// outer recursion step right before we return
	if (node === dict) {
		let wordsSet = new Set(words);
		words.length = 0;
		words.push(...wordsSet);
	}


	return words;
}