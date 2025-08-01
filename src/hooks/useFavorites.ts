import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

const FAVORITES_STORAGE_KEY = "hero-hub-favorites";
const MAX_FAVORITES = 5;

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    try {
      const savedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (savedFavorites) {
        const parsed = JSON.parse(savedFavorites);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Error saving favorites:", error);
    }
  }, [favorites]);

  const isFavorite = (heroId: string): boolean => {
    return favorites.includes(heroId);
  };

  const addFavorite = (heroId: string, heroName?: string): boolean => {
    if (favorites.includes(heroId)) {
      return false; 
    }

    if (favorites.length >= MAX_FAVORITES) {
      toast({
        title: "Limite de favoritos atingido",
        description: `Você só pode ter até ${MAX_FAVORITES} heróis favoritos. Remova um favorito para adicionar outro.`,
        variant: "destructive",
      });
      return false;
    }

    setFavorites(prev => [...prev, heroId]);
    toast({
      title: "Herói favoritado!",
      description: `${heroName || "Herói"} foi adicionado aos seus favoritos.`,
    });
    return true;
  };

  const removeFavorite = (heroId: string, heroName?: string): boolean => {
    if (!favorites.includes(heroId)) {
      return false; 
    }

    setFavorites(prev => prev.filter(id => id !== heroId));
    toast({
      title: "Herói removido dos favoritos",
      description: `${heroName || "Herói"} foi removido dos seus favoritos.`,
    });
    return true;
  };

  const toggleFavorite = (heroId: string, heroName?: string): boolean => {
    if (isFavorite(heroId)) {
      return removeFavorite(heroId, heroName);
    } else {
      return addFavorite(heroId, heroName);
    }
  };

  const clearFavorites = (): void => {
    setFavorites([]);
    toast({
      title: "Favoritos limpos",
      description: "Todos os favoritos foram removidos.",
    });
  };

  return {
    favorites,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    clearFavorites,
    favoritesCount: favorites.length,
    maxFavorites: MAX_FAVORITES,
    canAddMore: favorites.length < MAX_FAVORITES,
  };
};