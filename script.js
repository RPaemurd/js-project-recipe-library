// ==================================================
// Settings & Constants
// API keys, URLs, and initial setup variables
// ==================================================

document.addEventListener("DOMContentLoaded", () => {

const myHeaders = new Headers();
myHeaders.append('x-api-key', '8c1eb74ea4924057b8ad6bf0c4c9219c');
myHeaders.append('Content-Type', 'application/json')

const requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
};

const URL = 'https://api.spoonacular.com/recipes/random?number=100'

const randomBtn = document.getElementById("random-recipe");
const cardOverlay = document.getElementById("card-overlay");
const cardContent = document.getElementById("card-content");
let allRecipes = []; 


// ==================================================
// Functions
// ==================================================

//Funktion för de små korten
const createGridCardHTML = (recipe) => {
    const imgUrl = recipe.image;
    const title = recipe.title;
    // En tom array som standard om cuisines saknas, för att undvika fel med .join()
    const cuisines = recipe.cuisines || []; 
    const time = recipe.readyInMinutes;
    const ingredients = recipe.extendedIngredients || [];

    const ingredientsHTML = ingredients.map(ingredient => {
        return `<li>${ingredient.original}</li>`;
    }).join('');

    return `
        <article class="recipe-card">
            <img src="${imgUrl}" alt="Bild på ${title}">
            <div class="card-content">
                <h2 class="recipe-title">${title}</h2>
                <p class="recipe-cuisine">Cuisine: ${cuisines.join(', ')}</p>
                <p class="recipe-time"> Cooking Time: ${time} minuter</p>
                <h3>Ingredients:</h3>
                <ul class="recipe-ingredients">
                    ${ingredientsHTML}
                </ul>
            </div>
        </article>
    `;
};


const processRecipeData = (result) => {
    if (result && result.recipes && result.recipes.length > 0) {
        allRecipes = result.recipes;

         console.log("Alla recept:", allRecipes);

        const recipeContainer = document.getElementById("recipe-container");
        recipeContainer.innerHTML = ''; // Clear previous results

         allRecipes.forEach(recipe => {
            const cardHTML = createGridCardHTML(recipe);
            recipeContainer.innerHTML += cardHTML;
        });

        console.log("Complete object:", result);
    } else {
        console.log("Could not process recipe data, result was empty or invalid");
    }
};

// Lyssna efter klick på "slumpa"-knappen
randomBtn.addEventListener("click", () => {

     // Gör inget om listan är tom
    if (!allRecipes || allRecipes.length === 0) {

        console.log("Inga recept att slumpa fram än.");
        return; 
    }

    const randomIndex = Math.floor(Math.random() * allRecipes.length);
    const randomRecipe = allRecipes[randomIndex];

    const cardHTML = createCardHTML(randomRecipe);
    cardContent.innerHTML = cardHTML;

    cardOverlay.classList.add("visible");
});

// Lyssna efter klick på den mörka bakgrunden, för att stänga
cardOverlay.addEventListener("click", (event) => {
    // Att man klickade på själva overlayen, och inte på innehållet
    if (event.target === cardOverlay) {
        cardOverlay.classList.remove("visible");
    }
});


// ==================================================
// Initialization
// This is the code that actually runs when the page loads.
// ==================================================

const savedRecipeJSON = localStorage.getItem("savedRecipe");

if (savedRecipeJSON) {
    console.log("Fetching a recipe from localStorage...");
    const savedRecipe = JSON.parse(savedRecipeJSON);
    processRecipeData(savedRecipe); // Calling the function
} else {
    console.log("Fetching another recipe from the API...");
    fetch(URL, requestOptions)
        .then(response => response.json())
        .then(result => {
            localStorage.setItem("savedRecipe", JSON.stringify(result));
            processRecipeData(result); // Calling the function
        })
        .catch(error => console.log("error", error));
}
}); 
