import type { Meal } from "./types/Meal";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchRecipe(): Promise<Meal> {
    const res = await fetch(`${API_BASE_URL}/get_recipe`,
      {method: "GET"});
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const data = await res.json();
    return data as Meal
}

export async function saveLike(meal: Meal, userId: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/save_like`, {
    method: "POST",
    body: JSON.stringify({userId, meal}),
  });
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  
  
}
