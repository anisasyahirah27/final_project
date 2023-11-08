function buttonClicked() {
    var word = document.getElementById("searchData").value;

    // Clear the existing content in all relevant elements
    document.getElementById("synonyms").innerHTML = "";

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error("Word not found");
            }
            return response.json();
        })
        .then((data) => {
            console.log(data);

            // Word information
            document.getElementById("word").innerHTML = "Synonym of words:<br>" + data[0].word;

            const displaySynonyms = (definitions) => {
                if (definitions && definitions.synonyms) {
                    const synonyms = definitions.synonyms;

                    if (synonyms.length > 0) {
                        document.getElementById("synonyms").innerHTML = synonyms.join(", ");
                    }
                }
            }

            data[0].meanings.forEach((meaning) => {
                if (meaning.partOfSpeech === 'adjective' || meaning.partOfSpeech === 'noun' || meaning.partOfSpeech === 'verb' || meaning.partOfSpeech === 'preposition') {
                    displaySynonyms(meaning);
                }
            });

            if (!document.getElementById("synonyms").innerHTML) {
                document.getElementById("synonyms").innerHTML = "No synonyms available";
            }
        })
        .catch((error) => {
            document.getElementById("word").innerHTML = "Word not found";
            console.error("An error occurred: " + error);
        });
}