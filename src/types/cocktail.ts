export interface Drink {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
}

export interface DrinkDetail extends Drink {
  strAlcoholic?: string;
  strGlass?: string;
  strInstructions?: string;
  strCategory?: string;
}

export interface Ingredient {
  idIngredient: string;
  strIngredient: string;
  strDescription: string | null;
  strType: string | null;
}

export interface DrinksResponse {
  drinks: Drink[] | null | string;
}

export interface DrinkDetailResponse {
  drinks: DrinkDetail[] | null | string;
}

export interface IngredientResponse {
  ingredients: Ingredient[] | null;
}

export interface IngredientWithMeasure {
  name: string;
  measure: string;
}
