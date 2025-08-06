import type { Meal } from "./types/Meal";

export default async function fetchRecipe(): Promise<Meal | undefined> {
  try {
    const response = await fetch('https://www.themealdb.com/api/json/v1/1/random.php');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const raw = data.meals[0];
    const ingredients: {name: string; measure: string}[] = []

    for (let i = 1; i <= 20; i++) {
      const ingredient = raw[`strIngredient${i}`];
      const measure = raw[`strMeasure${i}`];
      if (ingredient && ingredient.trim() != "") {
        ingredients.push({ name: ingredient, measure: measure });
      }
    }
    return {
      id: raw.idMeal,
      name: raw.strMeal,
      image: raw.strMealThumb,
      instructions: raw.strInstructions,
      ingredients
    };
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}
