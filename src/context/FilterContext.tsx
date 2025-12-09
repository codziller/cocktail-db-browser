import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type AlcoholicFilter = 'all' | 'alcoholic' | 'non-alcoholic';

interface FilterContextType {
  alcoholicFilter: AlcoholicFilter;
  setAlcoholicFilter: (filter: AlcoholicFilter) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [alcoholicFilter, setAlcoholicFilter] = useState<AlcoholicFilter>('all');

  return (
    <FilterContext.Provider value={{ alcoholicFilter, setAlcoholicFilter }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within FilterProvider');
  }
  return context;
};
