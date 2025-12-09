import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Container,
  Box,
  Heading,
  Text,
  VStack,
  Spinner,
  Button,
  Divider,
} from '@chakra-ui/react';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { cocktailAPI } from '../api/cocktaildb';
import DrinksGrid from '../components/DrinksGrid';

const IngredientDetail = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();

  const { data: ingredientData, isLoading: isLoadingIngredient } = useQuery({
    queryKey: ['ingredient', name],
    queryFn: () => cocktailAPI.getIngredientByName(name!),
    enabled: !!name,
  });

  const { data: drinksData, isLoading: isLoadingDrinks } = useQuery({
    queryKey: ['drinks-by-ingredient', name],
    queryFn: () => cocktailAPI.searchByIngredient(name!),
    enabled: !!name,
  });

  // Loading state while fetching ingredient info and drinks
  const isLoading = isLoadingIngredient || isLoadingDrinks;

  if (isLoading) {
    return (
      <Container maxW="container.xl" px={8} py={8} centerContent>
        <Spinner size="xl" color="brand.500" />
      </Container>
    );
  }

  const ingredient = ingredientData?.ingredients?.[0];
  const drinks = drinksData?.drinks;

  // Filter out invalid drink responses
  const validDrinks = drinks && Array.isArray(drinks) ? drinks : null;
  const hasDrinks = validDrinks && validDrinks.length > 0;

  return (
    <Container maxW="container.xl" px={8} py={8}>
      <Button
        leftIcon={<ArrowBackIcon />}
        onClick={() => navigate(-1)}
        mb={6}
        variant="ghost"
      >
        Back
      </Button>

      <VStack align="stretch" spacing={8}>
        <Box bg="white" p={8} borderRadius="xl" boxShadow="md">
          <Heading size="2xl" mb={4}>
            {name}
          </Heading>

          {ingredient?.strDescription && (
            <>
              <Divider mb={4} />
              <Text color="gray.700" lineHeight="tall">
                {ingredient.strDescription}
              </Text>
            </>
          )}

          {ingredient?.strType && (
            <>
              <Divider my={4} />
              <Text fontWeight="semibold" display="inline">
                Type:{' '}
              </Text>
              <Text display="inline" color="gray.600">
                {ingredient.strType}
              </Text>
            </>
          )}
        </Box>

        <Box>
          <Heading size="lg" mb={6}>
            Cocktails with {name}
          </Heading>
          {hasDrinks ? (
            <DrinksGrid drinks={validDrinks} />
          ) : (
            <Text color="gray.600">No cocktails found with this ingredient.</Text>
          )}
        </Box>
      </VStack>
    </Container>
  );
};

export default IngredientDetail;
