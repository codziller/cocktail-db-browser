import type { DrinksResponse, DrinkDetailResponse, IngredientResponse } from '../types/cocktail';

const BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

const normalizeDrinksResponse = (data: DrinksResponse): DrinksResponse => {
  if (typeof data.drinks === 'string') {
    return { drinks: null };
  }
  return data;
};

const normalizeDrinkDetailResponse = (data: DrinkDetailResponse): DrinkDetailResponse => {
  if (typeof data.drinks === 'string') {
    return { drinks: null };
  }
  return data;
};

export const cocktailAPI = {
  searchByIngredient: async (ingredient: string): Promise<DrinksResponse> => {
    const response = await fetch(`${BASE_URL}/filter.php?i=${ingredient}`);
    if (!response.ok) throw new Error('Failed to fetch drinks');
    const data = await response.json();
    return normalizeDrinksResponse(data);
  },

  filterByAlcoholic: async (alcoholic: 'Alcoholic' | 'Non_Alcoholic'): Promise<DrinksResponse> => {
    const response = await fetch(`${BASE_URL}/filter.php?a=${alcoholic}`);
    if (!response.ok) throw new Error('Failed to fetch drinks');
    const data = await response.json();
    return normalizeDrinksResponse(data);
  },

  getDrinkById: async (id: string): Promise<DrinkDetailResponse> => {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    if (!response.ok) throw new Error('Failed to fetch drink details');
    const data = await response.json();
    return normalizeDrinkDetailResponse(data);
  },

  getIngredientByName: async (name: string): Promise<IngredientResponse> => {
    const response = await fetch(`${BASE_URL}/search.php?i=${name}`);
    if (!response.ok) throw new Error('Failed to fetch ingredient');
    return response.json();
  },
};
