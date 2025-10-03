// ==================================================
// Settings & Constants
// API keys, URLs, and initial setup variables
// ==================================================
document.addEventListener("DOMContentLoaded", () => {

const myHeaders = new Headers();
myHeaders.append('x-api-key', '8c1eb74ea4924057b8ad6bf0c4c9219c');
// Tells the API that we want the data in JSON format
myHeaders.append('Content-Type', 'application/json')

const requestOptions = {
    method: 'GET', // We want to GET (fetch) data
    redirect: 'follow',
    headers: myHeaders
};

// The address of the API we fetch data from
const URL = 'https://api.spoonacular.com/recipes/random?number=100';

// === Connecting JavaScript variables to HTML elements ===

const randomBtn = document.getElementById("random-recipe");
const cardOverlay = document.getElementById("card-overlay");
const cardContent = document.getElementById("card-content");
const glutenBtn = document.getElementById("gluten-btn");
const dairyBtn = document.getElementById("dairy-btn");
const vegBtn = document.getElementById("veg-btn");
const veganBtn = document.getElementById("vegan-btn");
const allBtn = document.getElementById("filter-btn"); 

// An empty list that will act as our local "database" for all recipes
let allRecipes = [];

// ==================================================
// Functions
// ==================================================

// A "display engine" that can take any list of recipes and show it on the screen
const displayRecipes = (recipesToShow) => {
    const recipeContainer = document.getElementById("recipe-container");
    recipeContainer.innerHTML = ''; // Always clears the screen first to make room for new cards

    // Builds all the cards in memory first and then adds them to the page all at once
    const allCardsHTML = recipesToShow.map(recipe => createGridCardHTML(recipe)).join('');
    recipeContainer.innerHTML = allCardsHTML;

    console.log(`Visar nu ${recipesToShow.length} recept.`);
};

// A function for building the HTML code for a small recipe card in the grid
const createGridCardHTML = (recipe) => {
    const imgUrl = recipe.image;
    const title = recipe.title;
    const time = recipe.readyInMinutes;
    const diets = recipe.diets;
    const ingredients = recipe.extendedIngredients || []; // Use an empty list if ingredients are missing

    const ingredientsHTML = ingredients.map(ingredient => {
        return `<li>${ingredient.original}</li>`;
    }).join('');


    // Returns the finished HTML code as a text string
    return `
        <article class="recipe-card">
            <img src="${imgUrl}" alt="Bild på ${title}">
            <div class="grid-card-content">
                <h2 class="recipe-title">${title}</h2>
                <p class="recipe-time"> Cooking Time: ${time} minuter</p>
                <p> Diets: ${diets}</p>
                <h3>Ingredients:</h3>
                <ul class="recipe-ingredients">
                    ${ingredientsHTML}
                </ul>
            </div>
        </article>
    `;
};

// A function for building the HTML for the large, detailed card in the popup window
const createOverlayCardHTML = (recipe) => {
    const imgUrl = recipe.image;
    const title = recipe.title;
/*     const cuisines = recipe.cuisines || []; 
 */ const time = recipe.readyInMinutes;
    const diets = recipe.diets;
    const ingredients = recipe.extendedIngredients || [];
    const instructions = recipe.instructions;

    const ingredientsHTML = ingredients.map(ingredient => {
        return `<li>${ingredient.original}</li>`;
    }).join('');

    return `
        <div class="overlay-card-content">
            <img src="${imgUrl}" alt="Bild på ${title}">
            <h2>${title}</h2>
            <p><strong>Time to cook:</strong> ${time} minuter</p>
            <p> Diets: ${diets}</p>
            <h3>Ingredients:</h3>
            <ul>
                ${ingredientsHTML}
            </ul>
            <p>${instructions}</p>
        </div>
    `;
};

// A function that runs one time at the start to handle the incoming data
const processRecipeData = (result) => {
    // Checks that we actually received a valid list of recipes
    if (result && result.recipes && result.recipes.length > 0) {
        // Saves all recipes to our local "database" 
        allRecipes = result.recipes;
        console.log("Alla recept:", allRecipes);

        // Uses our "display engine" to show all recipes from the start
        displayRecipes(allRecipes);

    } else {
        // If the data was empty or invalid
        console.log("Could not process recipe data, result was empty or invalid");
    }
};

// Listens for clicks on the "random" button
randomBtn.addEventListener("click", () => {
    if (!allRecipes || allRecipes.length === 0) {
        console.log("No recipes available to choose from.");
        return; 
    }

    // Selects a random index from our allrecipes list
    const randomIndex = Math.floor(Math.random() * allRecipes.length);
    const randomRecipe = allRecipes[randomIndex];

    // Builds the HTML for the popup window with the random recipe
    const cardHTML = createOverlayCardHTML(randomRecipe);
    cardContent.innerHTML = cardHTML;// Puts the HTML into the white box
    cardOverlay.classList.add("visible");// Makes the entire popup window visible
});

// Listens for clicks on the dark background to close the popup
cardOverlay.addEventListener("click", (event) => {
    // Checks if the clicked element was the background itself, and not the box inside it
    if (event.target === cardOverlay) {
        cardOverlay.classList.remove("visible");// Hides the popup window.
    }
});

// ==================================================
// Event Listeners for Filtering
// ==================================================

// Listens for clicks on the "Gluten free" button
glutenBtn.addEventListener("click", () => {
    console.log("Filtrerar på 'gluten free'");
    // Creates a new list that only contains recipes where the 'diets' list includes 'gluten free'
    const filtered = allRecipes.filter(recipe => recipe.diets.includes('gluten free'));
    
    // Uses our "display engine" to show the new, filtered list
    displayRecipes(filtered);
});

// Listens for clicks on the "Dairy free" button
dairyBtn.addEventListener("click", () => {
    console.log("Filtrerar på 'dairy free'");
    const filtered = allRecipes.filter(recipe => recipe.diets.includes('dairy free'));
    displayRecipes(filtered);
});

// Listens for clicks on the "Vegan" button
veganBtn.addEventListener("click", () => {
    const filtered = allRecipes.filter(recipe => recipe.diets.includes("vegan"))
    displayRecipes(filtered);
});

// Listens for clicks on the "Vegetarian" button
vegBtn.addEventListener("click", () => {
    console.log("Filtrerar på 'vegetarian'");
    // Some recipes use 'vegetarian: true' instead of in the 'diets' list, so we check that property
    const filtered = allRecipes.filter(recipe => recipe.vegetarian === true); 
    displayRecipes(filtered);
});

// Listens for clicks on the "All" button to reset the filter
allBtn.addEventListener("click", () => {
    console.log("Visar alla recept igen");
    // Calls the "display engine" with the entire, unfiltered allrecipes list
    displayRecipes(allRecipes);
});

// ==================================================
// Initialization
// This is the code that actually runs when the page loads.
// ==================================================

// Checks if there are saved recipes in the browser's memory (localStorage)
const savedRecipeJSON = localStorage.getItem("savedRecipe");

// IF there are saved recipes...
if (savedRecipeJSON) {
    console.log("Fetching recipes from localStorage...");
    const savedRecipe = JSON.parse(savedRecipeJSON); // Converts the text back into an object
    processRecipeData(savedRecipe);// Uses the saved 
    // ELSE (if it's the first visit or the memory has been cleared)...
} else {
    console.log("Fetching new recipes from the API..."); // Make a call to the API
    fetch(URL, requestOptions)
        .then(response => response.json()) // Converts the response to a JavaScript object
        .then(result => {
            // When we have the data:
            // 1. Save it to the browser's memory for next time
            localStorage.setItem("savedRecipe", JSON.stringify(result));
            // 2. Use the data to build the page
            processRecipeData(result);
        })
        .catch(error => console.log("error", error)); // Catches any errors during the API call
}
});
