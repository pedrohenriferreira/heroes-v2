import React from "react";
import { Superhero } from "@/types/superhero";
import { HeroCard } from "@/components/ui/hero-card";

// Define a interface para as props do componente MainContent
interface MainContentProps {
  heroes: Superhero[];
  favorites: string[];
  onToggleFavorite: (heroId: string, heroName: string) => void;
}

/**
 * Componente principal para exibir a lista de heróis.
 * @param heroes Um array de objetos de heróis a serem exibidos.
 * @param favorites A lista de IDs de heróis favoritos.
 * @param onToggleFavorite A função para adicionar/remover um herói dos favoritos.
 */
export const MainContent: React.FC<MainContentProps> = ({ heroes, favorites, onToggleFavorite }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {heroes.map((hero) => (
        <HeroCard 
          key={hero.id} 
          hero={hero} 
          isFavorite={favorites.includes(hero.id)} 
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};
