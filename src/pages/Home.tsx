import React, { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { Superhero } from '@/types/superhero';
import { superheroApiService } from '@/services/superheroApi';
import { useFavorites } from '@/hooks/useFavorites';
import { Header } from '@/components/layout/header';
import { MainContent } from '@/components/layout/main-content';
import { LoadingSkeleton } from '@/components/layout/loading-skeleton';
import { ErrorState } from '@/components/layout/error-state';
import { SearchBar } from '@/components/ui/search-bar';

// Mapeamento para os powerstats
const statMap = {
  intelligence: 'inteligência',
  strength: 'força',
  speed: 'velocidade',
  durability: 'durabilidade',
  power: 'poder',
  combat: 'combate'
};

const Home: React.FC = () => {
  const [heroes, setHeroes] = useState<Superhero[]>([]);
  const [searchResults, setSearchResults] = useState<Superhero[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { favorites, toggleFavorite, favoritesCount } = useFavorites();
  const location = useLocation();

  // Estados para a barra de pesquisa e filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | keyof typeof statMap>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  // Função para carregar os heróis iniciais
  const loadInitialHeroes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const initialHeroes = await superheroApiService.getInitialSuperheroes();
      if (initialHeroes) {
        setHeroes(initialHeroes);
      } else {
        setHeroes([]);
      }
    } catch (err) {
      setError("Erro ao carregar a lista de heróis.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Função para buscar heróis
  const handleSearch = useCallback(async () => {
    if (searchTerm.trim() === '') {
      setSearchResults(null);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const results = await superheroApiService.searchSuperheroes(searchTerm);
      if (results) {
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      setError("Erro na busca por heróis.");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm]);

  // Função para carregar heróis favoritos
  const loadFavorites = useCallback(async () => {
    if (favorites.length === 0) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const favHeroes = await superheroApiService.getSuperheroesByIds(favorites);
      if (favHeroes) {
        setSearchResults(favHeroes);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      setError("Erro ao carregar heróis favoritos.");
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  }, [favorites]);

  // Efeito para carregar a lista inicial ou favoritos
  useEffect(() => {
    if (location.pathname === '/favorites' || showFavoritesOnly) {
      loadFavorites();
    } else {
      loadInitialHeroes();
      setSearchResults(null);
    }
  }, [location.pathname, loadInitialHeroes, loadFavorites, showFavoritesOnly]);

  
  const getSortedHeroes = useCallback((heroList: Superhero[]) => {
    return [...heroList].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else {
        const statA = parseInt(a.powerstats[sortBy] as string, 10) || 0;
        const statB = parseInt(b.powerstats[sortBy] as string, 10) || 0;
        comparison = statA - statB;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [sortBy, sortOrder]);

  if (loading) {
    return (
      <>
        <Header favoritesCount={favoritesCount} />
        <LoadingSkeleton />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header favoritesCount={favoritesCount} />
        <div className="container mx-auto px-4 py-8">
          <ErrorState title="Oops!" message={error} />
        </div>
      </>
    );
  }

  const currentHeroes = showFavoritesOnly 
    ? getSortedHeroes(searchResults || []) 
    : getSortedHeroes(searchResults || heroes);

  const isFavoritesPage = location.pathname === '/favorites';
  const noResults = currentHeroes.length === 0;

  return (
    <>
      <Header favoritesCount={favoritesCount} />
      
      <div className="container mx-auto px-4 py-8">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearch={handleSearch}
          sortBy={sortBy}
          onSortChange={setSortBy as (value: string) => void}
          sortOrder={sortOrder}
          onSortOrderChange={setSortOrder}
          showFavoritesOnly={showFavoritesOnly}
          onToggleFavoritesFilter={() => setShowFavoritesOnly(!showFavoritesOnly)}
          favoritesCount={favoritesCount}
        />
        
        {noResults ? (
          <ErrorState 
            title={isFavoritesPage || showFavoritesOnly ? "Nenhum favorito" : "Nenhum herói encontrado"}
            message={isFavoritesPage || showFavoritesOnly
              ? "Você ainda não adicionou nenhum herói aos favoritos." 
              : "Tente um termo de busca diferente ou volte à lista inicial."
            }
          />
        ) : (
          <MainContent 
            heroes={currentHeroes} 
            favorites={favorites} 
            onToggleFavorite={toggleFavorite} 
          />
        )}
      </div>
    </>
  );
};

export default Home;
