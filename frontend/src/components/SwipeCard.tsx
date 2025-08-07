import type { Meal } from "../types/Meal";
import { motion, useDragControls } from "motion/react";
import { useState, useEffect } from "react";



interface SwipeCardProps {
  meal?: Meal;
  onConfirm?: (type: "like" | "skip", meal?: Meal) => void;
}

export default function SwipeCard({ meal, onConfirm }: SwipeCardProps) {
  const controls = useDragControls();
  const [badgeType, setBadgeType] = useState<"like" | "skip" | null>(null);
  const [badgeOpacity, setBadgeOpacity] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [exitX, setExitX] = useState(0);
  const OFFSET_THRESHOLD: number = 200; // Threshold for confirming like/skip
  return (
    <motion.div
      drag="x"
      dragControls={controls}
      whileDrag={{ scale: 1.05 }}
      dragListener={false}
      dragSnapToOrigin={!isExiting}
      animate={{ x: isExiting ? exitX : 0, opacity: isExiting ? 0 : 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 30 }}
      onAnimationComplete={() => {
        if (isExiting) {
          onConfirm?.(badgeType!, meal);
          setIsExiting(false);
          setBadgeOpacity(0);
          setBadgeType(null);
          setExitX(0);
        }
      }}
      onDrag={(event, info) => {
        if (info.offset.x > 0) {
          setBadgeOpacity(Math.min(info.offset.x / OFFSET_THRESHOLD, 1));
          setBadgeType("like");
        } else if (info.offset.x < 0){
          setBadgeType("skip");
          setBadgeOpacity(Math.min(Math.abs(info.offset.x) / OFFSET_THRESHOLD, 1));        
        } else {
          setBadgeOpacity(0);
          setBadgeType(null);
        }
      }}
      onDragEnd={(event, info) => {
        if (info.offset.x > OFFSET_THRESHOLD) {
          setBadgeType("like");
          setIsExiting(true);
          setExitX(window.innerWidth);
        } else if (info.offset.x < -OFFSET_THRESHOLD) {
          setBadgeType("skip");
          setIsExiting(true);
          setExitX(-window.innerWidth);
        } else {
          setBadgeOpacity(0);
          setBadgeType(null);
        }
      }}
    >
      <div
        className="swipe-card container-xl bg-white rounded-lg shadow-md p-6 flex flex-col items-center max-h-[80vh] overflow-auto relative select-none cursor-grab"
        onPointerDown={(event) =>
          controls.start(event, {
            // Might add some features
          })
        }
      >
        {badgeOpacity > 0 && (
          <div
            className={`absolute top-4 ${
              badgeType === "like" ? "left-4" : "right-4"
            }
                      px-4 py-2 ${
                        badgeType === "like" ? "bg-green-500" : "bg-red-500"
                      }
                      bg-opacity-80 text-white font-bold text-lg rounded-lg
                      border-2 border-white shadow-lg transform
                      ${
                        badgeType === "like"
                          ? "rotate-[-10deg]"
                          : "rotate-[10deg]"
                      }
                      transition-opacity duration-200 pointer-events-none`}
            style={{ opacity: badgeOpacity }}
          >
            {badgeType === "like" ? "LIKE" : "SKIP"}
          </div>
        )}
        {meal?.image ? (
          <img
          className="w-84 h-84 object-cover mb-4 rounded-md"
          src={meal.image}
          alt={meal?.name || "recipe"}
        />
        ) : null}
        
        <h2 className="text-2xl font-bold mb-2">{meal?.name || "Dish Name"}</h2>
        <ul className="recipe-list list-disc">
          {meal?.ingredients?.length ? (
            meal.ingredients.map((ingredient, idx) => (
              <li key={idx}>{ingredient.name}</li>
            ))
          ) : (
            <></>
          )}
        </ul>
      </div>
    </motion.div>
  );
}
