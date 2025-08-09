import { useState, useEffect } from "react";
import SwipeCard from "./SwipeCard";
import type { Meal } from "../types/Meal";
import {fetchRecipe, saveLike} from "../api";

const DEVUSER = "dev-user-123"; // testing purposes

const getUniqueMeal = async (usedIds: Set<string>) => {
  let meal;
  let attempts = 0
  do {
    meal = await fetchRecipe();
    attempts++;
  } while (usedIds.has(meal.id) && attempts < 10);
  return meal;
};

export default function SwipeDeck() {
  
  const [deck, setDeck] = useState<Meal[]>([]);
  const [usedIds, setUsedIds] = useState(new Set<string>());

  // Initialize deck with 3 unique meals
  useEffect(() => {
    const initializeDeck = async () => {
      const ids = new Set<string>();
      const meals: Meal[] = []
      while (meals.length < 3) {
        const m = await getUniqueMeal(ids);
        ids.add(m.id);
        meals.push(m);
      }
      setDeck(meals);
      setUsedIds(ids);
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
    const newMeal = await getUniqueMeal(usedIds);
    setUsedIds((prevIds) => {
      const newIds = new Set(prevIds);
      if (meal) newIds.delete(meal.id);   // keep only current deck IDs
      newIds.add(newMeal.id);
      return newIds;
    });
    setDeck((prevDeck) => {
      const newDeck = [...prevDeck];
      newDeck.shift();
      newDeck.push(newMeal);
      return newDeck;
    });
  };

  return (
    <div className="relative max-w-md mx-auto" style={{height: 520}}>
      {deck.slice(0, 3).map((meal, i) => (
        <SwipeCard
          key={`${meal.id}-${i}`}
          meal={meal}
          onConfirm={handleConfirm}
          isTop={i === 0}
          index={i}
        />
      ))}
    </div>
  );
}


