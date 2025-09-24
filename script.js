
//Inställningar
//Göra en GET-response för att få recepten
//Sätta våra headers och parameters likt en adress lapp
const myHeaders = new Headers(); //Skapar ett headers objekt
myHeaders.append('x-api-key','8c1eb74ea4924057b8ad6bf0c4c9219c');
myHeaders.append('Content-Type', 'application/json')

//Vad vi ska hämta med våran adress
const requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
};

const URL = 'https://api.spoonacular.com/recipes/random?number=1'

// En funktion för att hantera och logga receptdata.
// Denna funktion saknades i din kod, vilket orsakade "processRecipeData is not defined".
const processRecipeData = (result) => {
  // Säkerställ att vi har ett giltigt resultat med recept
  if (result && result.recipes && result.recipes.length > 0) {
    const recipe = result.recipes[0]; //Hämtar ut hela första receptobjektet 

    //Sparar ner alla egenskaper som jag skall använda 
    const imgUrl = recipe.image; 
    const title = recipe.title;
    const cuisines = recipe.cuisines; //array
    const time = recipe.readyInMinutes; //tid i minuter
    const ingredients = recipe.extendedIngredients; // array

    /* console.log("img", imgUrl);
    console.log("Title:", title);
    console.log("Cuisines:", cuisines);
    console.log("Time:", time);
    console.log("Ingredients:", ingredients); */

    const imageElement = document.getElementById('recipe-img');
    imageElement.src = imgUrl;

    const recipeTitleElement = document.getElementById("recipeTitle");
    recipeTitleElement.innerText = title;

    const recipeCuisines = document.getElementById("recipe-cuisine");
    recipeCuisines.innerText = cuisines;

    const recipeTime = document.getElementById("recipe-time");
    recipeTime.innerHTML = time;
/* 
    const recipeIngredients = document.getElementById("recipe-ingredients")
    recipeIngredients.innerText = extendedIngredients; */

    console.log("Complete object:", result); // Loggar hela resultatet för överblick
  } else {
    console.log("Could not process prescription data, result was empty or invalid");
  }


};

  const savedRecipeJSON = localStorage.getItem("savedRecipe");

if (savedRecipeJSON) {
  console.log("Fetching a recipe from localStorage...");
  const savedRecipe = JSON.parse(savedRecipeJSON); // Konvertera tillbaka från text till objekt
  processRecipeData(savedRecipe);
} else {
  console.log("Fetching another recipe from the API...");
  fetch(URL, requestOptions)
    .then(response => response.json())
    .then(result => {
      // Spara det nya receptet i localStorage för framtida användning
      // konvertera objektet till en textsträng med JSON.stringify
      localStorage.setItem('savedRecipe', JSON.stringify(result));
      
      // Använder datan
      processRecipeData(result);
    })
    .catch(error => console.log('error', error));
}



  



