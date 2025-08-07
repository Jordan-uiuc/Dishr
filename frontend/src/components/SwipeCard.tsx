import type { Meal } from "../types/Meal";
import { motion, useDragControls} from "motion/react";
import { useRef } from "react";

interface SwipeCardProps {
  meal?: Meal;
}

export default function SwipeCard({meal}: SwipeCardProps) {
  const controls = useDragControls();
  return (
    <motion.div drag="x" dragControls={controls}
            whileDrag={{scale: 1.05}} 
            dragListener={false} 
            dragSnapToOrigin
            onDragEnd={(event, info) => {
              if (info.offset.x > 200) {
                console.log("Swiped right");
              } else if (info.offset.x < -200) {
                console.log("Swiped left");
              }
            }}
            >
      <div className="swipe-card container-xl bg-white rounded-lg shadow-md p-6 flex flex-col items-center max-h-[80vh] overflow-auto"
            onPointerDown={event => controls.start(event, 
                                  { 
                                    

                                   })}
            
      >
        <img
        className="w-84 h-84 object-cover mb-4 rounded-md"
        src={meal?.image || ""}
        alt={meal?.name || "recipe"}
        />
        <h2 className="text-2xl font-bold mb-2">{meal?.name || "Dish Name"}</h2>
        <ul className="recipe-list list-disc">
        {meal?.ingredients?.length
          ? meal.ingredients.map((ingredient, idx) => (
            <li key={idx}>{ingredient.name}</li>
          ))
          : (
          <></>
          )
        }
        </ul>
      </div>
    </motion.div>
  );
}
