import { useState, useEffect } from "react";
import SwipeCard from "./SwipeCard";
import type { Meal } from "../types/Meal";
import {fetchRecipe, saveLike} from "../api";

const DEVUSER = "dev-user-123"; // testing purposes

export default function SwipeDeck() {
  
  const [deck, setDeck] = useState<Meal[]>([]);

  useEffect(() => {
    const initializeDeck = async () => {
      const meals = await Promise.all([
        fetchRecipe(),
        fetchRecipe(),
        fetchRecipe()]);

      setDeck(meals);
    }
    initializeDeck();
  }, []);
  
  const handleConfirm = async (type: "like" | "skip", meal?: Meal) => {
    if (type === "like" && meal) {
      console.log("Liked", meal?.name);
      // Save to AWS
      saveLike(meal, DEVUSER);
    }

    // Shift deck
    const newMeal = await fetchRecipe();
    setDeck((prevDeck) => {
      const newDeck = [...prevDeck];
      newDeck.shift();
      newDeck.push(newMeal);
      return newDeck;
    });
    console.log(deck);
  };

  return (
    <div className="flex flex-col justify-center items-center">
      <SwipeCard meal={deck[0]} onConfirm={handleConfirm}/>
    </div>
  );
}