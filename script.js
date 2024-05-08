const allergyForm = document.getElementById('allergy-form');
const ingredientsInput = document.getElementById('ingredients');
const resultDiv = document.getElementById('result');
const ingredientImageInput = document.getElementById('ingredient-image');
const imageContainer = document.getElementById('image-container');
const extractedText = document.getElementById('extracted-text');

allergyForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const allergensInput = document.getElementById('allergens');
    const allergens = allergensInput.value.split(',').map((allergen) => allergen.trim().toLowerCase());

    const file = ingredientImageInput.files[0];
    const text = await extractTextFromImage(file);

    extractedText.innerHTML = text;

    const ingredients = text.split('\n').map((ingredient) => ingredient.trim().toLowerCase());

    let message = '';

    for (const allergen of allergens) {
        for (const ingredient of ingredients) {
            if (ingredient.includes(allergen)) {
                message += `<div class="alert">${ingredient} contains ${allergen}</div>`;
                break;
            }
        }
    }

    if (message) {
        resultDiv.innerHTML = message;
    } else {
        resultDiv.innerHTML = `<div class="safe">Food is safe to consume</div>`;
    }

    imageContainer.innerHTML = '';
    const img = document.createElement('img');
    img.src = URL.createObjectURL(file);
    img.alt = 'Ingredient label';
    img.width = '100%';
    imageContainer.appendChild(img);
});

async function extractTextFromImage(file) {
    const apiKey = 'K84784109788957';
    const apiUrl = `https://api.ocr.space/parse/image`;

    const formData = new FormData();
    formData.append('apikey', apiKey);
    formData.append('file', file);

    const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData
    });

    const data = await response.json();
    const text = data.ParsedResults[0].ParsedText;
    return text;
}