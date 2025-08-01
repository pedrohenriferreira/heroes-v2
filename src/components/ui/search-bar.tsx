import React, { useState } from "react";
import { Search, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  sortOrder: "asc" | "desc";
  onSortOrderChange: (value: "asc" | "desc") => void;
  showFavoritesOnly: boolean;
  onToggleFavoritesFilter: () => void;
  favoritesCount: number;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onSearch,
  sortBy,
  onSortChange,
  sortOrder,
  onSortOrderChange,
  showFavoritesOnly,
  onToggleFavoritesFilter,
  favoritesCount,
  className,
}) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  const clearSearch = () => {
    onSearchChange("");
  };

  const activeFiltersCount = [
    sortBy !== "name" && "ordenação",
    sortOrder !== "asc" && "ordem",
    showFavoritesOnly && "favoritos"
  ].filter(Boolean).length;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar heróis (ex: batman, superman, iron man)..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className={cn(
            "pl-10 pr-20 h-12 text-base",
            "bg-card border-border focus:ring-primary focus:border-primary"
          )}
        />
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="h-8 w-8 p-0 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
          <Button
            onClick={onSearch}
            className="btn-hero h-8 px-3"
            disabled={!searchTerm.trim()}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="h-4 w-4" />
          Filtros
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {/* Favorites Filter */}
        <Button
          variant={showFavoritesOnly ? "default" : "outline"}
          onClick={onToggleFavoritesFilter}
          className={cn(
            "flex items-center gap-2",
            showFavoritesOnly && "btn-hero"
          )}
          disabled={favoritesCount === 0}
        >
          ❤️ Favoritos ({favoritesCount})
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="p-4 bg-card rounded-lg border space-y-4">
          <h3 className="font-semibold mb-3">Opções de Ordenação</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Ordenar por:</label>
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Nome</SelectItem>
                  <SelectItem value="intelligence">Inteligência</SelectItem>
                  <SelectItem value="strength">Força</SelectItem>
                  <SelectItem value="speed">Velocidade</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Ordem:</label>
              <Select value={sortOrder} onValueChange={onSortOrderChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Crescente (A-Z / 0-100)</SelectItem>
                  <SelectItem value="desc">Decrescente (Z-A / 100-0)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reset Filters */}
          <Button
            variant="outline"
            onClick={() => {
              onSortChange("name");
              onSortOrderChange("asc");
              if (showFavoritesOnly) onToggleFavoritesFilter();
            }}
            className="w-full"
          >
            Resetar Filtros
          </Button>
        </div>
      )}
    </div>
  );
};