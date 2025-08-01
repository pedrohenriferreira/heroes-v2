import React from "react";
import { AlertTriangle, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  type?: "error" | "empty" | "notFound";
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title,
  message,
  onRetry,
  type = "error"
}) => {
  const getIcon = () => {
    switch (type) {
      case "empty":
        return <Search className="h-16 w-16 text-muted-foreground" />;
      case "notFound":
        return <Search className="h-16 w-16 text-muted-foreground" />;
      default:
        return <AlertTriangle className="h-16 w-16 text-destructive" />;
    }
  };

  const getDefaultTitle = () => {
    switch (type) {
      case "empty":
        return "Nenhum herói encontrado";
      case "notFound":
        return "Herói não encontrado";
      default:
        return "Ops! Algo deu errado";
    }
  };

  const getDefaultMessage = () => {
    switch (type) {
      case "empty":
        return "Tente ajustar os filtros ou fazer uma nova busca para encontrar heróis.";
      case "notFound":
        return "O herói que você está procurando não foi encontrado. Verifique o ID ou tente voltar à página inicial.";
      default:
        return "Ocorreu um erro ao carregar os dados. Verifique sua conexão e tente novamente.";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] w-full">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center">
          <div className="flex justify-center mb-4">
            {getIcon()}
          </div>
          
          <h3 className="text-xl font-semibold mb-2">
            {title || getDefaultTitle()}
          </h3>
          
          <p className="text-muted-foreground mb-6">
            {message || getDefaultMessage()}
          </p>

          {onRetry && type === "error" && (
            <Button onClick={onRetry} className="btn-hero">
              <RefreshCw className="h-4 w-4 mr-2" />
              Tentar Novamente
            </Button>
          )}

          {type === "notFound" && (
            <Button asChild className="btn-hero">
              <a href="/">
                Voltar ao Início
              </a>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};