import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Heart, Star, Shield, Zap, Brain, Dumbbell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Header } from "@/components/layout/header";
import { LoadingSkeleton } from "@/components/layout/loading-skeleton";
import { ErrorState } from "@/components/layout/error-state";
import { superheroApiService } from "@/services/superheroApi";
import { useFavorites } from "@/hooks/useFavorites";
import { Superhero } from "@/types/superhero";
import { cn } from "@/lib/utils";

const HeroDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hero, setHero] = useState<Superhero | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    favorites,
    isFavorite,
    toggleFavorite,
    favoritesCount
  } = useFavorites();

  useEffect(() => {
    const fetchHero = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        const heroData = await superheroApiService.getSuperheroById(id);
        
        if (heroData) {
          setHero(heroData);
        } else {
          setError("Herói não encontrado");
        }
      } catch (err) {
        setError("Erro ao carregar dados do herói");
        console.error("Error fetching hero:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHero();
  }, [id]);

  const getStatIcon = (stat: string) => {
    switch (stat) {
      case "inteligência": return <Brain className="h-4 w-4" />;
      case "força": return <Dumbbell className="h-4 w-4" />;
      case "velocidade": return <Zap className="h-4 w-4" />;
      case "durabilidade": return <Shield className="h-4 w-4" />;
      case "poder": return <Star className="h-4 w-4" />;
      case "combate": return <Shield className="h-4 w-4" />;
      default: return <Star className="h-4 w-4" />;
    }
  };

  const getStatLabel = (stat: string) => {
    const labels: Record<string, string> = {
      intelligence: "Inteligência",
      strength: "Força",
      speed: "Velocidade",
      durability: "Resistência",
      power: "Poder",
      combat: "Combate"
    };
    return labels[stat] || stat;
  };

  if (loading) {
    return (
      <>
        <Header favoritesCount={favoritesCount} />
        <LoadingSkeleton type="detail" />
      </>
    );
  }

  if (error || !hero) {
    return (
      <>
        <Header favoritesCount={favoritesCount} />
        <div className="container mx-auto px-4 py-8">
          <ErrorState 
            type="notFound"
            title="Herói não encontrado"
            message="O herói que você está procurando não foi encontrado. Verifique o ID ou volte à página inicial."
          />
        </div>
      </>
    );
  }

  return (
    <>
      <Header favoritesCount={favoritesCount} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Botão de Voltar */}
        <Button
          asChild
          variant="ghost"
          className="mb-6 hover:bg-primary/10"
        >
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar à Lista
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Imagem do Herói e Ações */}
          <div className="lg:col-span-1">
            <Card className="card-hero overflow-hidden sticky top-24">
              <div className="relative">
                <img
                  src={hero.image?.url || "/placeholder.svg"}
                  alt={hero.name}
                  className="w-full aspect-[3/4] object-cover"
                />
                
                {/* Badge da Editora */}
                {hero.biography?.publisher && (
                  <Badge className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm">
                    {hero.biography.publisher}
                  </Badge>
                )}
              </div>

              <CardContent className="p-6">
                <h1 className="text-2xl font-bold mb-2">{hero.name}</h1>
                
                {hero.biography?.["full-name"] && hero.biography["full-name"] !== "-" && (
                  <p className="text-muted-foreground mb-4">
                    {hero.biography["full-name"]}
                  </p>
                )}

                {/* Botão de Favoritar */}
                <Button
                  onClick={() => toggleFavorite(hero.id, hero.name)}
                  className={cn(
                    "w-full mb-4",
                    isFavorite(hero.id) 
                      ? "btn-hero" 
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  <Heart className={cn(
                    "h-4 w-4 mr-2",
                    isFavorite(hero.id) && "fill-current"
                  )} />
                  {isFavorite(hero.id) ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                </Button>

                {/* Alinhamento */}
                {hero.biography?.alignment && hero.biography.alignment !== "-" && (
                  <div className="text-center">
                    <Badge className={cn(
                      "text-sm",
                      hero.biography.alignment === "good" 
                        ? "bg-primary/20 text-primary" 
                        : hero.biography.alignment === "bad"
                        ? "bg-destructive/20 text-destructive"
                        : "bg-muted/50 text-muted-foreground"
                    )}>
                      {hero.biography.alignment === "good" ? "Herói" : 
                       hero.biography.alignment === "bad" ? "Vilão" : 
                       "Neutro"}
                    </Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Detalhes do Herói */}
          <div className="lg:col-span-2 space-y-6">
            {/* Estatísticas de Poder */}
            <Card className="card-hero">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-accent" />
                  Estatísticas de Poder
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(hero.powerstats).map(([stat, value]) => {
                    const numValue = value !== "null" && value !== "" ? Number(value) : 0;
                    return (
                      <div key={stat} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getStatIcon(stat)}
                            <span className="font-medium">{getStatLabel(stat)}</span>
                          </div>
                          <span className="font-bold text-accent">{numValue}%</span>
                        </div>
                        <Progress value={numValue} className="h-2" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Biografia */}
            <Card className="card-hero">
              <CardHeader>
                <CardTitle>Biografia</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {hero.biography?.["place-of-birth"] && hero.biography["place-of-birth"] !== "-" && (
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                        Local de Nascimento
                      </h4>
                      <p>{hero.biography["place-of-birth"]}</p>
                    </div>
                  )}

                  {hero.biography?.["first-appearance"] && hero.biography["first-appearance"] !== "-" && (
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                        Primeira Aparição
                      </h4>
                      <p>{hero.biography["first-appearance"]}</p>
                    </div>
                  )}

                  {hero.biography?.aliases && hero.biography.aliases.length > 0 && (
                    <div className="md:col-span-2">
                      <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-2">
                        Aliases
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {hero.biography.aliases.map((alias, index) => (
                          <Badge key={index} variant="outline">
                            {alias}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Aparência */}
            <Card className="card-hero">
              <CardHeader>
                <CardTitle>Aparência</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(hero.appearance).map(([key, value]) => {
                    if (!value || value === "-" || (Array.isArray(value) && value.length === 0)) return null;
                    
                    const displayValue = Array.isArray(value) ? value.join(", ") : value;
                    const label = key.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase());
                    
                    return (
                      <div key={key}>
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          {label}
                        </h4>
                        <p className="capitalize">{displayValue}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(hero.work?.occupation && hero.work.occupation !== "-") || (hero.work?.base && hero.work.base !== "-") ? (
                <Card className="card-hero">
                  <CardHeader>
                    <CardTitle>Trabalho</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {hero.work?.occupation && hero.work.occupation !== "-" && (
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          Ocupação
                        </h4>
                        <p>{hero.work.occupation}</p>
                      </div>
                    )}
                    {hero.work?.base && hero.work.base !== "-" && (
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          Base
                        </h4>
                        <p>{hero.work.base}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : null}

              {/* Conexões */}
              {(hero.connections?.["group-affiliation"] && hero.connections["group-affiliation"] !== "-") || (hero.connections?.relatives && hero.connections.relatives !== "-") ? (
                <Card className="card-hero">
                  <CardHeader>
                    <CardTitle>Conexões</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {hero.connections?.["group-affiliation"] && hero.connections["group-affiliation"] !== "-" && (
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          Afiliações
                        </h4>
                        <p>{hero.connections["group-affiliation"]}</p>
                      </div>
                    )}
                    {hero.connections?.relatives && hero.connections.relatives !== "-" && (
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          Parentes
                        </h4>
                        <p>{hero.connections.relatives}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroDetail;