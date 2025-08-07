import type { Meal } from "./types/Meal";

export default async function fetchRecipe(): Promise<Meal | undefined> {
  try {
    const res = await fetch('https://tpg2bw66i3.execute-api.us-east-1.amazonaws.com/v1/get_recipe');
    const data = await res.json();
    return data as Meal
  }
  catch(error) {
    console.error("Error fetching recipe:", error);
    return undefined;
  }
}
