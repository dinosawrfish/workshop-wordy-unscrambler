export default {
	loadWords,
	findWords
};

var dict = [];


// ****************************

function loadWords(wordList) {
	dict = [...wordList];
	return dict.length;
}

function findWords(input) {
	var words = [];

	for (let word of dict) {
		if (input.length >= word.length && checkWord(word,input)) {
			words.push(word);
		}
	}

	return words;
}

function checkWord(word,input) {
	return permute("", input);

	// ***************************

	function permute(prefix, remainings) {
		for (let i = 0;  i < remainings.length; i++) {
			let current = prefix + remainings[i];

			if (current == word) {
				return true;
			}
			else if (
				remainings.length > 1 &&
				current.length < word.length
			) {
				if (permute(current, remainings.slice(0,i) + remainings.slice(i+1))) {
					return true;
				}
			}
		}
		return false;
	}
}
