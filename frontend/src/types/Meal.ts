export type Meal = {
  id: string;
  name: string;
  image: string;
  instructions: string;
  ingredients: {name: string; measure: string}[];
};