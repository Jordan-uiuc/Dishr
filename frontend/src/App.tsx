import { useEffect, useState } from 'react'
import './App.css'
import SwipeCard from './components/SwipeCard'
import type { Meal } from './types/Meal'
import fetchRecipe from './api'
import SwipeDeck from './components/SwipeDeck'
function App() {
    
  return (
    <div className='flex page-container justify-center items-center min-h-screen h-screen'>
      <SwipeDeck/>
      
    </div>
    
  );
}

export default App
