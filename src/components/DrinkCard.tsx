import { Box, Image, Text, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import type { Drink } from '../types/cocktail';

interface DrinkCardProps {
  drink: Drink;
}

// Card component for displaying individual drink preview
const DrinkCard = ({ drink }: DrinkCardProps) => {
  const navigate = useNavigate();

  return (
    <Box
      bg="white"
      borderRadius="xl"
      overflow="hidden"
      boxShadow="md"
      transition="all 0.3s"
      cursor="pointer"
      _hover={{
        transform: 'translateY(-8px)',
        boxShadow: 'xl',
      }}
      onClick={() => navigate(`/drink/${drink.idDrink}`)}
    >
      <Image
        src={drink.strDrinkThumb}
        alt={drink.strDrink}
        width="100%"
        height="250px"
        objectFit="cover"
      />
      <VStack align="stretch" p={4}>
        <Text fontWeight="bold" fontSize="lg" noOfLines={1}>
          {drink.strDrink}
        </Text>
      </VStack>
    </Box>
  );
};

export default DrinkCard;
