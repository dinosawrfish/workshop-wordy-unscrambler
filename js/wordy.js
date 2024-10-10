
export default {
	loadWords,
	findWords
};

var dict = new MinimalWordGraph();

// ****************************

function loadWords(wordList) {
	if (dict.size() > 0) {
		dict = new MinimalWordGraph();
	}

	for (let word of wordList) {
		dict.add(word);
	}

	dict.makeImmutable();

	return dict.size();
}

function countLetters(str) {
	var counts = {};
	for (let i = 0; i < str.length; i++) {
		counts[str[i]] = (counts[str[i]] || 0) + 1;
	}
	return counts;
}

function findWords(input, prefix = "", node = dict) {
	var inputCounts = countLetters(input);

	var words = dict.containsOnly(
		Array.isArray(input) ? input :
		typeof input == "string" ? input.split("") :
		[]
	);

	words = [...(new Set(words))];

	return words.filter(function removeWords(word) {
		var wordLetterCounts = countLetters(word);
		for (let [letter, count] of Object.entries(wordLetterCounts)) {
			if (!inputCounts[letter] || count > inputCounts[letter]) {
				return false;
			}
		}
		return true;
	});
}
