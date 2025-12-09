import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import CocktailDetail from './pages/CocktailDetail';
import IngredientDetail from './pages/IngredientDetail';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/drink/:id" element={<CocktailDetail />} />
        <Route path="/ingredient/:name" element={<IngredientDetail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
