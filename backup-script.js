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

const URL = 'https://api.spoonacular.com/recipes/random?number=100';

const randomBtn = document.getElementById("random-recipe");
const cardOverlay = document.getElementById("card-overlay");
const cardContent = document.getElementById("card-content");
let allRecipes = [];
const glutenBtn = document.getElementById("gluten-btn");
const dairyBtn = document.getElementById("dairy-btn");
const vegBtn = document.getElementById("veg-btn");
const veganBtn = document.getElementById("vegan-btn");
const allBtn = document.getElementById("filter-btn"); 


// ==================================================
// Functions
// ==================================================

// NY FUNKTION: Denna funktion kan visa vilken lista av recept som helst.
const displayRecipes = (recipesToShow) => {
    const recipeContainer = document.getElementById("recipe-container");
    recipeContainer.innerHTML = ''; // Rensa alltid skärmen först

    // Använd den optimerade metoden för att bygga och visa korten
    const allCardsHTML = recipesToShow.map(recipe => createGridCardHTML(recipe)).join('');
    recipeContainer.innerHTML = allCardsHTML;

    console.log(`Visar nu ${recipesToShow.length} recept.`);
};

// Funktion för att bygga de små korten i rutnätet
const createGridCardHTML = (recipe) => {
    const imgUrl = recipe.image;
    const title = recipe.title;
    const time = recipe.readyInMinutes;
    const diets = recipe.diets;
    const ingredients = recipe.extendedIngredients || [];

    const ingredientsHTML = ingredients.map(ingredient => {
        return `<li>${ingredient.original}</li>`;
    }).join('');

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

// Funktion för att bygga det stora, detaljerade kortet i overlayen
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

// Funktion som bearbetar API-svaret och ritar ut alla grid-kort
const processRecipeData = (result) => {
    // Återställt för att hantera 'recipes'-arrayen från /random-slutpunkten
    if (result && result.recipes && result.recipes.length > 0) {
        allRecipes = result.recipes;
        console.log("Alla recept:", allRecipes);

        // Använd vår nya, generella visningsfunktion för att visa ALLA recept från start
        displayRecipes(allRecipes);

    } else {
        console.log("Could not process recipe data, result was empty or invalid");
    }
};

// Lyssna efter klick på "slumpa"-knappen
randomBtn.addEventListener("click", () => {
    if (!allRecipes || allRecipes.length === 0) {
        console.log("No recipes available to choose from.");
        return; 
    }

    // Enkel logik: välj ett slumpmässigt recept från den befintliga listan
    const randomIndex = Math.floor(Math.random() * allRecipes.length);
    const randomRecipe = allRecipes[randomIndex];

    // Använd det valda receptet för att bygga och visa overlayen
    const cardHTML = createOverlayCardHTML(randomRecipe);
    cardContent.innerHTML = cardHTML;
    cardOverlay.classList.add("visible");
});

// Lyssna efter klick på den mörka bakgrunden, för att stänga
cardOverlay.addEventListener("click", (event) => {
    if (event.target === cardOverlay) {
        cardOverlay.classList.remove("visible");
    }
});

// ==================================================
// Event Listeners for Filtering
// ==================================================

// Lyssna på "Gluten free"-knappen
glutenBtn.addEventListener("click", () => {
    console.log("Filtrerar på 'gluten free'");
    // 1. Skapa en ny, filtrerad lista från vår masterlista
    const filtered = allRecipes.filter(recipe => recipe.diets.includes('gluten free'));
    
    // 2. Använd vår visningsfunktion för att visa den nya listan
    displayRecipes(filtered);
});

dairyBtn.addEventListener("click", () => {
    console.log("Filtrerar på 'dairy free'");
    const filtered = allRecipes.filter(recipe => recipe.diets.includes('dairy free'));
    displayRecipes(filtered);
});

veganBtn.addEventListener("click", () => {
    const filtered = allRecipes.filter(recipe => recipe.diets.includes("vegan"))
    displayRecipes(filtered);
});

vegBtn.addEventListener("click", () => {
    console.log("Filtrerar på 'vegetarian'");
    const filtered = allRecipes.filter(recipe => recipe.vegetarian === true); // Vissa recept använder en boolean för detta
    displayRecipes(filtered);
});

allBtn.addEventListener("click", () => {
    console.log("Visar alla recept igen");
    // Visa bara hela masterlistan igen
    displayRecipes(allRecipes);
});

// ==================================================
// Initialization
// This is the code that actually runs when the page loads.
// ==================================================

const savedRecipeJSON = localStorage.getItem("savedRecipe");

if (savedRecipeJSON) {
    console.log("Fetching recipes from localStorage...");
    const savedRecipe = JSON.parse(savedRecipeJSON);
    processRecipeData(savedRecipe);
} else {
    console.log("Fetching new recipes from the API...");
    fetch(URL, requestOptions)
        .then(response => response.json())
        .then(result => {
            localStorage.setItem("savedRecipe", JSON.stringify(result));
            processRecipeData(result);
        })
        .catch(error => console.log("error", error));
}
});
