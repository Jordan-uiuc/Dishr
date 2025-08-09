import type { Meal } from "../types/Meal";
import { motion, useDragControls } from "motion/react";
import { useState } from "react";

interface SwipeCardProps {
  meal?: Meal;
  onConfirm?: (type: "like" | "skip", meal?: Meal) => void;
  isTop?: boolean;
  index?: number;
}

export default function SwipeCard({ meal, onConfirm, isTop, index }: SwipeCardProps) {
  const controls = useDragControls();
  const [badgeType, setBadgeType] = useState<"like" | "skip" | null>(null);
  const [badgeOpacity, setBadgeOpacity] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [exitX, setExitX] = useState(0);


  const scales = [1, 0.96, 0.92] // Scales for cards deeper in deck
  const offsets = ["translateY(0px)", "translateY(10px)", "translateY(20px)"]; // Offsets for cards deeper in deck
  const OFFSET_THRESHOLD = 140; // distance to confirm like/skip
  

  function confirm(type: "like" | "skip") {
    setBadgeType(type);
    setIsExiting(true);
    setExitX(type === "like" ? window.innerWidth : -window.innerWidth);
    onConfirm?.(type, meal)
  }

  return (
    <motion.div
      className={`absolute inset-0 w-full max-w-md overflow-hidden rounded-2xl bg-zinc-900 text-zinc-100 shadow-xl ring-1 ring-white/10`}
      style={{transform: `${offsets[index]} scale(${scales[index]})`, zIndex: 100 - index,}}
      drag="x"
      dragControls={controls}
      whileDrag={{ scale: 1.03 }}
      dragListener={false}
      dragSnapToOrigin={!isExiting}
      style={{
        transform: `${offsets[index ?? 0]} scale(${scales[index ?? 0]})`,
        zIndex: 100 - (index ?? 0),
      }}
      transition={{ type: "spring", stiffness: 220, damping: 30 }}
      
      onDrag={(event, info) => {
        if (info.offset.x > 0) {
          setBadgeOpacity(Math.min(info.offset.x / OFFSET_THRESHOLD, 1));
          setBadgeType("like");
        } else if (info.offset.x < 0) {
          setBadgeOpacity(Math.min(Math.abs(info.offset.x) / OFFSET_THRESHOLD, 1));
          setBadgeType("skip");
        } else {
          setBadgeOpacity(0);
          setBadgeType(null);
        }
      }}
      onDragEnd={(event, info) => {
        if (info.offset.x > OFFSET_THRESHOLD) {
          confirm("like");
        } else if (info.offset.x < -OFFSET_THRESHOLD) {
          confirm("skip");
        } else {
          // snap back
          setBadgeOpacity(0);
          setBadgeType(null);
        }
      }}
    >
      {/* Gesture handle area */}
      <div
        className="relative flex h-full min-h-0 flex-col select-none cursor-grab"
        onPointerDown={(event) => controls.start(event)}
      >
        {/* Image with gradient overlay and title */}
        <div className="relative aspect-[4/3] w-full">
          {meal?.image ? (
            <img
              src={meal.image}
              alt={meal?.name || "recipe"}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-zinc-800" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-3 left-4 right-4">
            <h2 className="text-2xl font-semibold leading-tight drop-shadow">{meal?.name || "Dish Name"}</h2>
          </div>

          {/* LIKE / NOPE stamps */}
          {badgeOpacity > 0 && (
            <div
              className={`absolute top-4 ${badgeType === "like" ? "left-4" : "right-4"} rounded-md border px-3 py-1 text-sm font-semibold pointer-events-none`}
              style={{
                opacity: badgeOpacity,
                borderColor: badgeType === "like" ? "rgb(34 197 94)" : "rgb(239 68 68)",
                color: badgeType === "like" ? "rgb(34 197 94)" : "rgb(239 68 68)",
                transform: `rotate(${badgeType === "like" ? -10 : 10}deg)`
              }}
            >
              {badgeType === "like" ? "LIKE" : "NOPE"}
            </div>
          )}
        </div>

        {/* Details (Just ingridients for now) */}
        <div className="p-4">
          <details className="group">
            <summary className="flex list-none cursor-pointer items-center justify-between text-sm text-zinc-300">
              <span className="font-medium">Ingredients</span>
              <svg className="h-4 w-4 transition-transform group-open:rotate-180" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
              </svg>
            </summary>
            <ul className="mt-3 grid grid-cols-2 gap-2">
              {meal?.ingredients?.length ? (
                meal.ingredients.map((ingredient, idx) => (
                  <li
                    key={idx} // possible non unique key?
                    className="truncate rounded-lg bg-zinc-800 px-2.5 py-1.5 text-sm"
                    title={ingredient.name}
                  >
                    {ingredient.name}
                  </li>
                ))
              ) : (
                <li className="text-sm text-zinc-400">No ingredients listed.</li>
              )}
            </ul>
          </details>
        </div>

        {/* Bottom action bar */}
        <div className="px-4 pb-4">
          <div className="mt-2 flex gap-3">
            <button
              onClick={() => confirm("skip")}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-zinc-500"
              aria-label="Skip recipe"
            >
              <span>Skip</span>
            </button>
            <button
              onClick={() => confirm("like")}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 font-semibold text-black hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              aria-label="Like recipe"
            >
              <span>Like</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
