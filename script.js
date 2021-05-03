// Allen Cheung | CSE 110 | Lab5: Meme Generator

const img = new Image(); // used to load image from <input> and draw to canvas

// Canvas
const canvas = document.getElementById("user-image");
let context = canvas.getContext('2d');

// Buttons
const clearButton = document.querySelector("[type='reset']");
const readButton = document.querySelector("[type='button']");
const generateButton = document.querySelector("[type='submit']");

// Voice
let voices = []
let synth = window.speechSynthesis;
const voiceSelect = document.getElementById('voice-selection');
const volumeSlider = document.querySelector('input[type="range"]');
const volumeIcon = document.querySelector('img');

// Fires whenever the img object loads a new image (such as with img.src =)
img.addEventListener('load', () => {

  context.clearRect(0, 0, canvas.width, canvas.height);

  clearButton.disabled = true;
  readButton.disabled = true;
  generateButton.disabled = false;

  context.fillStyle = "black";
  context.fillRect(0, 0, canvas.width, canvas.height);

  let dimensions = getDimmensions(canvas.width, canvas.height, img.width, img.height);
  context.drawImage(img, dimensions.startX, dimensions.startY, dimensions.width, dimensions.height);
});

// Image Input
let input = document.getElementById('image-input');
input.addEventListener('change', (event) => {
  img.src = URL.createObjectURL(input.files[0]);
  img.alt = input.files[0].name;
});

// Form Submit
let form = document.getElementById('generate-meme');
form.addEventListener('submit', (event) => {
  let topText = document.getElementById('text-top').value;
  let bottomText = document.getElementById('text-bottom').value;

  context.font = "50px Arial";
  context.fillStyle = "white";
  context.textAlign = "center";

  context.fillText(topText, canvas.width / 2, 50);
  context.fillText(bottomText, canvas.width / 2, canvas.height - 15);

  clearButton.disabled = false;
  readButton.disabled = false;
  generateButton.disabled = true;
  voiceSelect.disabled = false;

  event.preventDefault();
}, false);

// Clear Button
clearButton.addEventListener('click', (event) => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  clearButton.disabled = true;
  readButton.disabled = true;
  generateButton.disabled = false;
});

// Voice Menu
function populateVoiceList() {
  voices = synth.getVoices();
  voiceSelect.options[0] = null;
  for (var i = 0; i < voices.length; i++) {
    let option = document.createElement('option');
    option.textContent = voices[i].name + ' (' + voices[i].lang + ')';

    if (voices[i].default) {
      option.textContent += ' -- DEFAULT';
    }

    option.setAttribute('data-lang', voices[i].lang);
    option.setAttribute('data-name', voices[i].name);
    voiceSelect.appendChild(option);
  }
}

populateVoiceList();
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

// Read Button
readButton.addEventListener('click', (event) => {
  let topText = document.getElementById('text-top').value;
  let bottomText = document.getElementById('text-bottom').value;
  let utterance = new SpeechSynthesisUtterance(topText + ' ' + bottomText);
  let selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');

  for (var i = 0; i < voices.length; i++) {
    if (voices[i].name === selectedOption) {
      utterance.voice = voices[i];
    }
  }

  utterance.volume = Number(volumeSlider.value)/100;
  synth.speak(utterance);
});

// Volume Slider
volumeSlider.addEventListener('change', () => {
  if (volumeSlider.value >= 67) {
    volumeIcon.src = 'icons/volume-level-3.svg';
  } else if (volumeSlider.value >= 34) {
    volumeIcon.src = 'icons/volume-level-2.svg';
  } else if (volumeSlider.value >= 1) {
    volumeIcon.src = 'icons/volume-level-1.svg';
  } else {
    volumeIcon.src = 'icons/volume-level-0.svg';
  }
});

/**
 * Takes in the dimensions of the canvas and the new image, then calculates the new
 * dimensions of the image so that it fits perfectly into the Canvas and maintains aspect ratio
 * @param {number} canvasWidth Width of the canvas element to insert image into
 * @param {number} canvasHeight Height of the canvas element to insert image into
 * @param {number} imageWidth Width of the new user submitted image
 * @param {number} imageHeight Height of the new user submitted image
 * @returns {Object} An object containing four properties: The newly calculated width and height,
 * and also the starting X and starting Y coordinate to be used when you draw the new image to the
 * Canvas. These coordinates align with the top left of the image.
 */
function getDimmensions(canvasWidth, canvasHeight, imageWidth, imageHeight) {
  let aspectRatio, height, width, startX, startY;

  // Get the aspect ratio, used so the picture always fits inside the canvas
  aspectRatio = imageWidth / imageHeight;

  // If the apsect ratio is less than 1 it's a verical image
  if (aspectRatio < 1) {
    // Height is the max possible given the canvas
    height = canvasHeight;
    // Width is then proportional given the height and aspect ratio
    width = canvasHeight * aspectRatio;
    // Start the Y at the top since it's max height, but center the width
    startY = 0;
    startX = (canvasWidth - width) / 2;
    // This is for horizontal images now
  } else {
    // Width is the maximum width possible given the canvas
    width = canvasWidth;
    // Height is then proportional given the width and aspect ratio
    height = canvasWidth / aspectRatio;
    // Start the X at the very left since it's max width, but center the height
    startX = 0;
    startY = (canvasHeight - height) / 2;
  }

  return { 'width': width, 'height': height, 'startX': startX, 'startY': startY }
}
