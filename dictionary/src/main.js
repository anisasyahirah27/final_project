const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');

var btnCreate = document.getElementById('btnCreate');
var fileName = document.getElementById('fileName');
var fileContents = document.getElementById('fileContents');
var fileListContainer = document.getElementById('fileListContainer');
var fileContentDisplay = document.getElementById('fileContentDisplay');
var newFileDisplay = document.getElementById('newFileDisplay');

let pathName = path.join(__dirname, 'Files');

// Function to create a new file
btnCreate.addEventListener('click', function () {
  let userFileName = fileName.value;
  // Check if the file name already has the '.txt' extension
  if (!userFileName.endsWith('.txt')) {
    userFileName += '.txt'; // Add the '.txt' extension if it's not already there
  }

  let file = path.join(pathName, userFileName);
  let contents = fileContents.value;

  fs.writeFile(file, contents, function (err) {
    if (err) {
      return console.log(err);
    }
    alert('Word of the day for words ' + userFileName.replace('.txt', '') + ' was created');

    // Automatically add the newly created file to the list of existing files
    createFileEntry(userFileName);

    // Clear the input fields
    fileName.value = '';
    fileContents.value = '';
    
    // Update the newFileDisplay section with the newly created file name
    newFileDisplay.textContent = 'New File Created: ' + userFileName;

    // Automatically read the newly created file and display its content
    readFile(userFileName);

    // No need to manually update the list of existing files here
  });
});

// Function to create a file entry for an existing file
function createFileEntry(file) {
  var fileEntry = document.createElement('div');
  fileEntry.className = 'file-entry';

  var fileNameDisplay = document.createElement('span');
  var fileNameWithoutExtension = file.replace('.txt', ''); // Remove ".txt" extension
  fileNameDisplay.textContent = fileNameWithoutExtension;
  fileNameDisplay.className = 'file-name';

  var readButton = document.createElement('button2');
  readButton.textContent = 'Read';
  readButton.className = 'btn btn-default';
  readButton.addEventListener('click', function () {
    readFile(file);
  });

  var deleteButton = document.createElement('button3');
  deleteButton.textContent = 'Delete';
  deleteButton.className = 'btn btn-default';
  deleteButton.addEventListener('click', function () {
    deleteFile(file);
  });

  var updateButton = document.createElement('button4');
  updateButton.textContent = 'Update';
  updateButton.className = 'btn btn-default';
  updateButton.addEventListener('click', function () {
    updateFile(file); // Pass the file name to the updateFile function
  });

  // Append elements to file entry
  fileEntry.appendChild(fileNameDisplay);
  fileEntry.appendChild(document.createElement('br'));
  fileEntry.appendChild(readButton);
  fileEntry.appendChild(deleteButton);
  fileEntry.appendChild(updateButton);

  // Append file entry to fileListContainer
  fileListContainer.appendChild(fileEntry);

  // Add a line break between file entries
  var lineBreak = document.createElement('br');
  fileListContainer.appendChild(lineBreak);
}

// Function to list existing files and display them
function listExistingFiles() {
  fs.readdir(pathName, function (err, files) {
    if (err) {
      return console.log(err);
    }

    // Clear the fileListContainer
    fileListContainer.innerHTML = '';

    fileListContainer.style.fontSize = '25pt'; // Change the font size as needed
    fileListContainer.style.textTransform = 'uppercase';

    files.forEach(function (file) {
      // Create file entry for each existing file
      createFileEntry(file);
    });
  });
}

// Function to read a file and display content in a box with a yellow background
function readFile(file) {
  let filePath = path.join(pathName, file);
  fs.readFile(filePath, function (err, data) {
    if (err) {
      return console.log(err);
    }

    // Remove the ".txt" extension from the file name
    const fileNameWithoutExtension = file.replace('.txt', '');

    // Create a container for the displayed content
    let contentContainer = document.createElement('div');
    contentContainer.style.backgroundColor = '#FBD5AB'; 
    contentContainer.style.padding = '10px';

    // Create a header for the content
    let contentHeader = document.createElement('h2');
    contentHeader.textContent = "Today's word:";
    contentHeader.style.fontWeight = 'bold'; // Change the font weight as needed

    // Create a paragraph for the file name
    let fileNameParagraph = document.createElement('p');
    fileNameParagraph.textContent = fileNameWithoutExtension;

    // Create a paragraph for the file data
    let dataParagraph = document.createElement('p');
    dataParagraph.textContent = data;

    // Apply styles to the content
    contentContainer.style.fontSize = '30px'; // Change the font size as needed
    contentContainer.style.fontWeight = 'bold'; // Change the font weight as needed
    contentContainer.style.lineHeight = '1.5'; // Set line height
    contentContainer.style.fontFamily = 'Helvetica, sans-serif'; // Set font family

    // Append elements to the container
    contentContainer.appendChild(contentHeader);
    contentContainer.appendChild(fileNameParagraph);
    contentContainer.appendChild(dataParagraph);

    // Clear the previous content
    fileContentDisplay.innerHTML = '';

    // Append the container to the fileContentDisplay
    fileContentDisplay.appendChild(contentContainer);

    // Show an alert message that the file was updated
    alert('You will see the content of the word ' + file.replace('.txt', ''));
  });
}

// Function to delete a file
function deleteFile(file) {
  let filePath = path.join(pathName, file);
  fs.unlink(filePath, function (err) {
    if (err) {
      return console.log(err);
    }
    fileName.value = '';
    fileContents.value = '';
    fileContentDisplay.textContent = ''; // Clear file content display
    // Update the list of existing files
    listExistingFiles();

    // Show an alert message that the file was updated
    alert('Word of the day for words ' + file.replace('.txt', '') + ' was delete');
  });
}

function updateFile(file) {
  // Clear file content display
  fileContentDisplay.textContent = '';

  // Create an input field for updating the content
  let updateInput = document.createElement('textarea');
  updateInput.className = 'update-input';
  updateInput.value = fileContents.value;

  // Create a "Save" button for updating the content
  let saveButton = document.createElement('button4');
  saveButton.textContent = 'Save Update';
  saveButton.className = 'btn btn-default';
  saveButton.addEventListener('click', function () {
    let updatedContents = updateInput.value;
    let filePath = path.join(pathName, file);

    fs.writeFile(filePath, updatedContents, function (err) {
      if (err) {
        return console.log(err);
      }
      // Show an alert message that the file was updated
      alert('Content for words ' + file.replace('.txt', '') + ' was updated');
      // Update the list of existing files
      listExistingFiles();
    });

    // Clear the file content display
    fileContentDisplay.textContent = '';
  });

  fileContentDisplay.innerHTML = "Edit your content in the box below for words : " + file.replace('.txt', '') + '<br><br>';
  fileContentDisplay.style.fontSize = '20pt';

  // Append the update input and save button to the file content display
  fileContentDisplay.appendChild(updateInput);
  fileContentDisplay.appendChild(saveButton);
}

// Call the listExistingFiles function to list existing files on page load
listExistingFiles();