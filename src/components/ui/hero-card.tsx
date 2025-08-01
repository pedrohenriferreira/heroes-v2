import React from "react";
import { Link } from "react-router-dom";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Superhero } from "@/types/superhero";

interface HeroCardProps {
  hero: Superhero;
  isFavorite: boolean;
  onToggleFavorite: (heroId: string, heroName: string) => void;
  className?: string;
}

export const HeroCard: React.FC<HeroCardProps> = ({
  hero,
  isFavorite,
  onToggleFavorite,
  className,
}) => {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite(hero.id, hero.name);
  };

  const getMainStat = () => {
    const stats = hero.powerstats;
    const validStats = Object.entries(stats)
      .filter(([, value]) => value !== "null" && value !== "" && !isNaN(Number(value)))
      .sort(([, a], [, b]) => Number(b) - Number(a));
    
    return validStats.length > 0 ? validStats[0] : null;
  };

  const mainStat = getMainStat();

  return (
    <Link to={`/hero/${hero.id}`} className="block group">
      <Card 
        className={cn(
          "card-hero overflow-hidden group-hover:scale-105 transition-all duration-300",
          isFavorite && "favorite-glow ring-2 ring-accent",
          className
        )}
      >
        <div className="relative">
          {/* imagem heroi */}
          <div className="aspect-[3/4] overflow-hidden bg-muted/20">
            <img
              src={hero.image?.url || "/placeholder.svg"}
              alt={hero.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
          </div>

          {/* botao favorito */}
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-sm",
              "hover:bg-background/90 transition-all duration-200",
              isFavorite && "text-accent hover:text-accent/80"
            )}
            onClick={handleFavoriteClick}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                isFavorite ? "fill-current text-accent" : "text-muted-foreground"
              )}
            />
          </Button>

          {/* editora */}
          {hero.biography?.publisher && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-primary/90 backdrop-blur-sm rounded-md">
              <span className="text-xs font-medium text-primary-foreground">
                {hero.biography.publisher}
              </span>
            </div>
          )}
        </div>

        <CardContent className="p-4">
          {/* nome heroi */}
          <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-1">
            {hero.name}
          </h3>

          {/* nome real*/}
          {hero.biography?.["full-name"] && hero.biography["full-name"] !== "-" && (
            <p className="text-sm text-muted-foreground mb-3 line-clamp-1">
              {hero.biography["full-name"]}
            </p>
          )}

          {/* status */}
          {mainStat && (
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium capitalize">{mainStat[0]}:</span>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 text-accent fill-current" />
                <span className="text-sm font-bold text-accent">{mainStat[1]}</span>
              </div>
            </div>
          )}

          {hero.biography?.alignment && hero.biography.alignment !== "-" && (
            <div className={cn(
              "inline-flex px-2 py-1 rounded-full text-xs font-medium",
              hero.biography.alignment === "good" 
                ? "bg-primary/20 text-primary" 
                : hero.biography.alignment === "bad"
                ? "bg-destructive/20 text-destructive"
                : "bg-muted/50 text-muted-foreground"
            )}>
              {hero.biography.alignment === "good" ? "Herói" : 
               hero.biography.alignment === "bad" ? "Vilão" : 
               "Neutro"}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};