import { useState, useEffect, useRef } from "react";
import {
  Container,
  VStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Button,
  HStack,
  Text,
  Box,
  Image,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Slide,
} from "@chakra-ui/react";
import { SearchIcon, CloseIcon } from "@chakra-ui/icons";
import { useQuery } from "@tanstack/react-query";
import { cocktailAPI } from "../api/cocktaildb";
import DrinksGrid from "../components/DrinksGrid";
import logo from "../assets/images/logo.png";

// Popular ingredients for search suggestions
const POPULAR_INGREDIENTS = ["vodka", "gin", "rum", "tequila", "lemon", "mint"];

// Tab indices for better readability
const SEARCH_TAB = 0;
const BROWSE_TAB = 1;

const Home = () => {
  const [ingredient, setIngredient] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [alcoholicFilter, setAlcoholicFilter] = useState<
    "Alcoholic" | "Non_Alcoholic" | null
  >(null);
  const [activeTab, setActiveTab] = useState(0);
  const [showSticky, setShowSticky] = useState(false);
  const searchSectionRef = useRef<HTMLDivElement>(null);

  const {
    data: searchData,
    isLoading: isSearching,
    error: searchError,
  } = useQuery({
    queryKey: ["search-drinks", searchTerm],
    queryFn: () => cocktailAPI.searchByIngredient(searchTerm),
    enabled: searchTerm.length > 0,
  });

  const {
    data: browseData,
    isLoading: isBrowsing,
    error: browseError,
  } = useQuery({
    queryKey: ["browse-drinks", alcoholicFilter],
    queryFn: () => cocktailAPI.filterByAlcoholic(alcoholicFilter!),
    enabled: alcoholicFilter !== null,
  });

  useEffect(() => {
    const handleScroll = () => {
      if (searchSectionRef.current) {
        const rect = searchSectionRef.current.getBoundingClientRect();
        setShowSticky(
          rect.bottom < 0 && (searchTerm.length > 0 || alcoholicFilter !== null)
        );
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [searchTerm, alcoholicFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredient.trim()) {
      setSearchTerm(ingredient.trim());
      setAlcoholicFilter(null);
      setActiveTab(SEARCH_TAB);
    }
  };

  const handleBrowse = (filter: "Alcoholic" | "Non_Alcoholic") => {
    setAlcoholicFilter(filter);
    setSearchTerm("");
    setIngredient("");
    setActiveTab(BROWSE_TAB);
  };

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (ingredient.trim()) {
      setSearchTerm(ingredient.trim());
      setAlcoholicFilter(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleQuickBrowse = (filter: "Alcoholic" | "Non_Alcoholic") => {
    setAlcoholicFilter(filter);
    setSearchTerm("");
    setIngredient("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleClearSearch = () => {
    setIngredient("");
    setSearchTerm("");
  };

  // Helper to search for a specific ingredient
  const handleIngredientClick = (ingredientName: string) => {
    setIngredient(ingredientName);
    setSearchTerm(ingredientName);
    setAlcoholicFilter(null);
  };

  const isSearchMode = searchTerm.length > 0;
  const isBrowseMode = alcoholicFilter !== null;

  // Tab state checks
  const isOnSearchTab = activeTab === SEARCH_TAB;
  const isOnBrowseTab = activeTab === BROWSE_TAB;

  const searchDrinks =
    isOnSearchTab && isSearchMode ? searchData?.drinks : null;
  const browseDrinks =
    isOnBrowseTab && isBrowseMode ? browseData?.drinks : null;
  const drinks = isOnSearchTab ? searchDrinks : browseDrinks;

  const isLoading = isOnSearchTab ? isSearching : isBrowsing;
  const error = isOnSearchTab ? searchError : browseError;

  // Derived conditions for better readability
  const hasNoResults =
    !drinks || (Array.isArray(drinks) && drinks.length === 0);
  const hasResults = drinks && Array.isArray(drinks) && drinks.length > 0;
  const showEmptySearchState = !isLoading && isSearchMode && hasNoResults;
  const showResultsContainer = error || isSearchMode || isBrowseMode;

  return (
    <Box>
      <Slide direction="top" in={showSticky} style={{ zIndex: 10 }}>
        <Box
          bg="white"
          boxShadow="lg"
          borderBottom="1px"
          borderColor="gray.200"
          py={3}
        >
          <Container maxW="container.xl" px={8}>
            {isOnSearchTab ? (
              <Box as="form" onSubmit={handleQuickSearch}>
                <HStack spacing={2}>
                  <InputGroup size="md" flex={1}>
                    <InputLeftElement>
                      <SearchIcon color="gray.400" />
                    </InputLeftElement>
                    <Input
                      placeholder="Search by ingredient..."
                      value={ingredient}
                      onChange={(e) => setIngredient(e.target.value)}
                      bg="white"
                    />
                    {ingredient && (
                      <InputRightElement
                        cursor="pointer"
                        onClick={handleClearSearch}
                      >
                        <CloseIcon color="gray.400" boxSize={3} />
                      </InputRightElement>
                    )}
                  </InputGroup>
                  <Button
                    type="submit"
                    colorScheme="brand"
                    size="md"
                    isLoading={isSearching}
                    isDisabled={!ingredient.trim()}
                  >
                    Search
                  </Button>
                </HStack>
              </Box>
            ) : (
              <HStack spacing={4} justify="center">
                <Button
                  size="md"
                  variant={
                    alcoholicFilter === "Alcoholic" ? "solid" : "outline"
                  }
                  colorScheme="brand"
                  onClick={() => handleQuickBrowse("Alcoholic")}
                  isLoading={isBrowsing && alcoholicFilter === "Alcoholic"}
                >
                  Alcoholic
                </Button>
                <Button
                  size="md"
                  variant={
                    alcoholicFilter === "Non_Alcoholic" ? "solid" : "outline"
                  }
                  colorScheme="brand"
                  onClick={() => handleQuickBrowse("Non_Alcoholic")}
                  isLoading={isBrowsing && alcoholicFilter === "Non_Alcoholic"}
                >
                  Non-Alcoholic
                </Button>
              </HStack>
            )}
          </Container>
        </Box>
      </Slide>

      <Container maxW="600px" py={8} ref={searchSectionRef}>
        <VStack spacing={8} align="stretch">
          <VStack spacing={2}>
            <Image src={logo} alt="Cocktail Browser" maxW="200px" mx="auto" />
            <Text color="gray.600" textAlign="center" fontSize="sm">
              Discover cocktails by ingredient or browse by type
            </Text>
          </VStack>

          <Tabs
            variant="soft-rounded"
            colorScheme="brand"
            isFitted
            index={activeTab}
            onChange={setActiveTab}
          >
            <TabList>
              <Tab>Search by Ingredient</Tab>
              <Tab>Browse by Type</Tab>
            </TabList>

            <TabPanels>
              <TabPanel px={0}>
                <VStack spacing={4}>
                  <Text color="gray.600" fontSize="sm" textAlign="center">
                    Search for cocktails containing a specific ingredient
                  </Text>
                  <Box as="form" onSubmit={handleSearch} width="full">
                    <HStack spacing={2}>
                      <InputGroup size="lg" flex={1}>
                        <InputLeftElement>
                          <SearchIcon color="gray.400" />
                        </InputLeftElement>
                        <Input
                          placeholder="e.g., vodka, lemon, mint"
                          value={ingredient}
                          onChange={(e) => setIngredient(e.target.value)}
                          bg="white"
                          borderRadius="xl"
                          _focus={{
                            borderColor: "brand.400",
                            boxShadow:
                              "0 0 0 1px var(--chakra-colors-brand-400)",
                          }}
                        />
                        {ingredient && (
                          <InputRightElement
                            cursor="pointer"
                            onClick={handleClearSearch}
                          >
                            <CloseIcon color="gray.400" boxSize={3} />
                          </InputRightElement>
                        )}
                      </InputGroup>
                      <Button
                        type="submit"
                        colorScheme="brand"
                        size="lg"
                        isLoading={isSearching}
                        isDisabled={!ingredient.trim()}
                        minW="120px"
                      >
                        Search
                      </Button>
                    </HStack>
                  </Box>
                </VStack>
              </TabPanel>

              <TabPanel px={0}>
                <VStack spacing={4}>
                  <Text color="gray.600" fontSize="sm" textAlign="center">
                    Browse all cocktails by alcoholic type
                  </Text>
                  <HStack spacing={4} width="full">
                    <Button
                      flex={1}
                      variant={
                        alcoholicFilter === "Alcoholic" ? "solid" : "outline"
                      }
                      colorScheme="brand"
                      onClick={() => handleBrowse("Alcoholic")}
                      isLoading={isBrowsing && alcoholicFilter === "Alcoholic"}
                    >
                      Alcoholic
                    </Button>
                    <Button
                      flex={1}
                      variant={
                        alcoholicFilter === "Non_Alcoholic"
                          ? "solid"
                          : "outline"
                      }
                      colorScheme="brand"
                      onClick={() => handleBrowse("Non_Alcoholic")}
                      isLoading={
                        isBrowsing && alcoholicFilter === "Non_Alcoholic"
                      }
                    >
                      Non-Alcoholic
                    </Button>
                  </HStack>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>

      {/* Results section - shows when user has searched or filtered */}
      {showResultsContainer && (
        <Container maxW="container.xl" px={8} py={4}>
          <VStack spacing={6} align="stretch">
            {error && (
              <Alert status="error" borderRadius="lg">
                <AlertIcon />
                <Box>
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    {error instanceof Error
                      ? error.message
                      : "Failed to fetch drinks. Please try again."}
                  </AlertDescription>
                </Box>
              </Alert>
            )}

            {/* Empty search state with helpful suggestions */}
            {showEmptySearchState && (
              <Alert status="warning" borderRadius="lg">
                <AlertIcon />
                <Box flex="1">
                  <AlertTitle>No cocktails found</AlertTitle>
                  <AlertDescription>
                    <VStack align="start" spacing={2} mt={2}>
                      <Text>
                        No cocktails found with <strong>"{searchTerm}"</strong>.
                      </Text>
                      <Text fontSize="sm" color="gray.600">
                        Try searching for popular ingredients like:
                      </Text>
                      <HStack spacing={2} flexWrap="wrap">
                        {POPULAR_INGREDIENTS.map((ing) => (
                          <Button
                            key={ing}
                            size="xs"
                            variant="outline"
                            colorScheme="brand"
                            onClick={() => handleIngredientClick(ing)}
                          >
                            {ing}
                          </Button>
                        ))}
                      </HStack>
                    </VStack>
                  </AlertDescription>
                </Box>
              </Alert>
            )}

            {/* Display search/filter results */}
            {!isLoading && hasResults && (
              <Box>
                <Text fontSize="sm" color="gray.600" mb={4}>
                  Showing {drinks.length} result
                  {drinks.length !== 1 ? "s" : ""}
                  {isOnSearchTab && isSearchMode && ` for "${searchTerm}"`}
                  {isOnBrowseTab &&
                    isBrowseMode &&
                    ` - ${
                      alcoholicFilter === "Alcoholic"
                        ? "Alcoholic"
                        : "Non-Alcoholic"
                    } cocktails`}
                </Text>
                <DrinksGrid drinks={drinks} />
              </Box>
            )}
          </VStack>
        </Container>
      )}
    </Box>
  );
};

export default Home;
