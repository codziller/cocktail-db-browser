import { SimpleGrid } from '@chakra-ui/react';
import type { Drink } from '../types/cocktail';
import DrinkCard from './DrinkCard';

interface DrinksGridProps {
  drinks: Drink[];
}

// Responsive grid layout for displaying drink cards
const DrinksGrid = ({ drinks }: DrinksGridProps) => {
  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={6}>
      {drinks.map((drink) => (
        <DrinkCard key={drink.idDrink} drink={drink} />
      ))}
    </SimpleGrid>
  );
};

export default DrinksGrid;
