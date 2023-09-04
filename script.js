const catImageEndpoint = 'https://cataas.com/cat/cute';
const catFactEndpoint = 'https://meowfacts.herokuapp.com';

const loadingScreen = document.querySelector('.loading-screen');

const imageDisplay = document.querySelector('#cat-image');
const factDisplay = document.querySelector('.fact');
const generateBtn = document.querySelector('.generate-button');
const downloadBtn = document.querySelector('#download-image');

const errorDisplay = document.querySelector('.error-display');
const errorInfo = document.querySelector('.error-info');
const retryBtn = document.querySelector('.retry');

displayNewCard();

async function fetchCatData() {
  const catImagePromise = fetch(catImageEndpoint);
  const catFactPromise = fetch(catFactEndpoint);

  try {
    const [catImageResponse, catFactResponse] = await Promise.all([catImagePromise, catFactPromise]);

    if (!catImageResponse.ok || !catFactResponse.ok) {
      throw new Error(`Couldn't fetch data`);
    }
  
    const catImageBlob = await catImageResponse.blob();
    const catImage = URL.createObjectURL(catImageBlob);
  
    const catFact = await catFactResponse.json();
  
    return [catImage, catFact];
  } catch (err) {
    console.error('Error fetching cat data:', err);
    throw err;
  }
}

function displayNewCard() {
  loadingScreen.style.opacity = '1';
  (async () => {
    try {
      const [catImage, catFact] = await fetchCatData();
      imageDisplay.src = catImage;
      downloadBtn.href = catImage;
      factDisplay.textContent = catFact.data[0];
      loadingScreen.style.opacity = '0';
      console.log(catImage, catFact);
    } catch (err) {
      displayError(err);
    }
  })();
}

function displayError(err) {
  console.error('Error displaying cat card:', err);
  errorDisplay.style.display = 'flex';
  errorInfo.textContent = err;
  retryBtn.addEventListener('click', () => {
    displayNewCard();
    errorDisplay.style.display = 'none';
  });
}

generateBtn.addEventListener('click', displayNewCard);
