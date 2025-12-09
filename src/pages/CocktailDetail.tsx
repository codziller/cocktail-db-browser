import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Container,
  Box,
  Image,
  Heading,
  Text,
  Badge,
  VStack,
  HStack,
  Spinner,
  Button,
  Grid,
  GridItem,
  Divider,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { cocktailAPI } from "../api/cocktaildb";
import type { IngredientWithMeasure, DrinkDetail } from "../types/cocktail";

const CocktailDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ["drink", id],
    queryFn: () => cocktailAPI.getDrinkById(id!),
    enabled: !!id,
  });

  // Loading state
  if (isLoading) {
    return (
      <Container maxW="container.xl" px={8} py={8} centerContent>
        <Spinner size="xl" color="brand.500" />
      </Container>
    );
  }

  // Check for error or invalid data
  const hasError = error || !data?.drinks || typeof data.drinks === "string" || !Array.isArray(data.drinks) || data.drinks.length === 0;

  if (hasError) {
    return (
      <Container maxW="container.xl" px={8} py={8}>
        <Text color="red.500">Failed to load cocktail details.</Text>
        <Button
          mt={4}
          leftIcon={<ArrowBackIcon />}
          onClick={() => navigate("/")}
        >
          Back to Home
        </Button>
      </Container>
    );
  }

  // After the error check, we know drinks is a valid array
  const drink = (data.drinks as DrinkDetail[])[0];

  // Extract ingredients with their measurements from drink data
  const ingredients: IngredientWithMeasure[] = [];
  for (let i = 1; i <= 15; i++) {
    const ingredient = drink[`strIngredient${i}` as keyof typeof drink];
    const measure = drink[`strMeasure${i}` as keyof typeof drink];
    if (ingredient && typeof ingredient === "string") {
      ingredients.push({
        name: ingredient,
        measure: measure && typeof measure === "string" ? measure : "",
      });
    }
  }

  return (
    <Container maxW="container.xl" px={8} py={8}>
      <Button
        leftIcon={<ArrowBackIcon />}
        onClick={() => navigate("/")}
        mb={6}
        variant="ghost"
      >
        Back to Search
      </Button>

      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8}>
        <GridItem>
          <Box borderRadius="2xl" overflow="hidden" boxShadow="2xl">
            <Image
              src={drink.strDrinkThumb}
              alt={drink.strDrink}
              width="100%"
              height="auto"
            />
          </Box>
        </GridItem>

        <GridItem>
          <VStack align="stretch" spacing={4}>
            <Box>
              <Heading size="2xl" mb={2}>
                {drink.strDrink}
              </Heading>
              <HStack spacing={2} mb={4}>
                <Badge
                  colorScheme={
                    drink.strAlcoholic === "Alcoholic" ? "purple" : "green"
                  }
                  fontSize="md"
                  px={3}
                  py={1}
                  borderRadius="full"
                >
                  {drink.strAlcoholic}
                </Badge>
                {drink.strCategory && (
                  <Badge
                    colorScheme="blue"
                    fontSize="md"
                    px={3}
                    py={1}
                    borderRadius="full"
                  >
                    {drink.strCategory}
                  </Badge>
                )}
              </HStack>
            </Box>

            {drink.strGlass && (
              <Box>
                <Text fontWeight="semibold" fontSize="lg" mb={1}>
                  Glass Type
                </Text>
                <Text color="gray.600">{drink.strGlass}</Text>
              </Box>
            )}

            <Divider />

            <Box>
              <Text fontWeight="semibold" fontSize="lg" mb={3}>
                Ingredients
              </Text>
              <VStack align="stretch" spacing={2}>
                {ingredients.map((ing, index) => (
                  <HStack
                    key={index}
                    justify="space-between"
                    p={3}
                    bg="gray.50"
                    borderRadius="lg"
                    cursor="pointer"
                    transition="all 0.2s"
                    _hover={{ bg: "brand.50", transform: "translateX(4px)" }}
                    onClick={() => navigate(`/ingredient/${ing.name}`)}
                  >
                    <Text fontWeight="medium">{ing.name}</Text>
                    {ing.measure && <Text color="gray.600">{ing.measure}</Text>}
                  </HStack>
                ))}
              </VStack>
            </Box>

            <Divider />

            <Box>
              <Text fontWeight="semibold" fontSize="lg" mb={2}>
                Instructions
              </Text>
              <Text color="gray.700" lineHeight="tall">
                {drink.strInstructions}
              </Text>
            </Box>
          </VStack>
        </GridItem>
      </Grid>
    </Container>
  );
};

export default CocktailDetail;
