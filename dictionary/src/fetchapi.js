// Define the buttonClicked function
function buttonClicked() {
    var word = document.getElementById("searchData").value;

    // Clear the existing content in all relevant elements
    document.getElementById("meanings").innerHTML = "";
    document.getElementById("sounds").innerHTML = "";
    document.getElementById("relatedURL").innerHTML = "";
    document.getElementById("examples").innerHTML = "";

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then((response) => response.json())
        .then((data) => {
            console.log(data);

            document.getElementById("word").innerHTML = "Dictionary of words:<br>" + data[0].word;

            if (data[0].meanings && data[0].meanings.length > 0) {
                var meaningsList = document.createElement("ul");

                data[0].meanings.forEach((meaningObject) => {
                    var partOfSpeech = meaningObject.partOfSpeech;
                    meaningObject.definitions.forEach((definition) => {
                        var meaningItem = document.createElement("li");
                        meaningItem.textContent = `${partOfSpeech}: ${definition.definition}`;
                        meaningsList.appendChild(meaningItem);
                    });
                });                

                if (meaningsList.childElementCount > 0) {
                    document.getElementById("meanings").innerHTML = ""; // Clear existing content
                    document.getElementById("meanings").appendChild(meaningsList); // Append new content
                }
            } else {
                document.getElementById("meanings").innerHTML = "Meaning not found";
            }

            // Display sounds and related URLs if available
            if (data[0].phonetics && data[0].phonetics.length > 0) {
                var sounds = data[0].phonetics.map((phonetic) => {
                    return `<a href="${phonetic.audio}" target="_blank" rel="noopener">${phonetic.text}</a>`;
                }).join(", ");

                if (sounds) {
                    document.getElementById("sounds").innerHTML = "Sounds: " + sounds;
                }
            }

            if (data[0].sourceUrls && data[0].sourceUrls.length > 0) {
                var relatedURLs = data[0].sourceUrls;
                if (relatedURLs) {
                    var relatedURLList = document.createElement("ul");
                    relatedURLs.forEach((url) => {
                        if (!url.includes("license")) {
                            // Check if the URL contains "license" and skip it
                            var urlItem = document.createElement("li");
                            urlItem.innerHTML = "<a href='" + url + "' target='_blank'>" + url + "</a>";
                            relatedURLList.appendChild(urlItem);
                        }
                    });
                    document.getElementById("relatedURL").innerHTML = "Related URLs:";
                    document.getElementById("relatedURL").appendChild(relatedURLList);
                }
            }

            // Display examples if available
            if (data[0].meanings && data[0].meanings.length > 0) {
                var examplesList = document.createElement("ul");
                data[0].meanings.forEach((meaning) => {
                    meaning.definitions.forEach((definition) => {
                        if (definition.example) {
                            var exampleItem = document.createElement("li");
                            exampleItem.textContent = "Example: " + definition.example;
                            examplesList.appendChild(exampleItem);
                        }
                    });
                });

                if (examplesList.childElementCount > 0) {
                    document.getElementById("examples").innerHTML = "Examples:";
                    document.getElementById("examples").appendChild(examplesList);
                }
            }
        })
        
        .catch((error) => {
            console.error("Error fetching data: " + error);
            document.getElementById("word").innerHTML = "Word not found";
        });
}