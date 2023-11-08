function buttonClicked() {
    var word = document.getElementById("searchData").value;

    // Clear the existing content in all relevant elements
    document.getElementById("antonyms").innerHTML = "";

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
            document.getElementById("word").innerHTML = "Antonym of words:<br>" + data[0].word;

            const displayAntonyms = (definitions) => {
                if (definitions && definitions.antonyms) {
                    const antonyms = definitions.antonyms;

                    if (antonyms.length > 0) {
                        document.getElementById("antonyms").innerHTML = antonyms.join(", ");
                    }
                }
            }

            data[0].meanings.forEach((meaning) => {
                if (meaning.partOfSpeech === 'adjective' || meaning.partOfSpeech === 'noun' || meaning.partOfSpeech === 'verb' || meaning.partOfSpeech === 'preposition') {
                    displayAntonyms(meaning);
                }
            });

            if (!document.getElementById("antonyms").innerHTML) {
                document.getElementById("antonyms").innerHTML = "No antonyms available";
            }
        })
        .catch((error) => {
            document.getElementById("word").innerHTML = "Word not found";
            console.error("An error occurred: " + error);
        });
}