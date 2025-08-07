import { useEffect, useState } from 'react'
import './App.css'
import SwipeCard from './components/SwipeCard'
import type { Meal } from './types/Meal'
import fetchRecipe from './api'
function App() {
  const [meal, setMeal] = useState<Meal | undefined>(undefined)

  useEffect(() => {
    const getMeal = async () => {
      const recipe = await fetchRecipe();
      setMeal(recipe);
    };
    getMeal();
  }, []);
  return (
    <div className='flex page-container justify-center items-center min-h-screen h-screen'>
      <SwipeCard meal={meal}/>
      
    </div>
    
  );
}

export default App
