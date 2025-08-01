import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import heroLogo from "@/assets/hero-logo.png";

interface HeaderProps {
  favoritesCount: number;
}

export const Header: React.FC<HeaderProps> = ({ favoritesCount }) => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <img 
                src={heroLogo} 
                alt="Hero Hub Finder" 
                className="h-10 w-auto rounded-lg group-hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                Heroes
              </h1>
              <p className="text-xs text-muted-foreground">
                Descubra o universo dos super-heróis
              </p>
            </div>
          </Link>

          {/* Navegação */}
          <nav className="flex items-center space-x-2">
            {!isHome && (
              <Button
                asChild
                variant="ghost"
                className="flex items-center gap-2 hover:bg-primary/10"
              >
                <Link to="/">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Início</span>
                </Link>
              </Button>
            )}

            {/* Contador Favoritos */}
            <div className="flex items-center gap-2 px-3 py-2 bg-card rounded-lg border">
              <Heart className={cn(
                "h-4 w-4",
                favoritesCount > 0 ? "text-accent fill-current" : "text-muted-foreground"
              )} />
              <span className="text-sm font-medium">
                {favoritesCount}/5
              </span>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};