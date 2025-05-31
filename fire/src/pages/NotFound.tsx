
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md mx-auto px-4">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="text-xl font-semibold text-neutral-900">Página não encontrada</h2>
          <p className="text-neutral-600">
            A página que você está procurando não existe ou foi movida.
          </p>
        </div>
        
        <a 
          href="/" 
          className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-800 transition-colors"
        >
          <Home className="w-4 h-4" />
          Voltar ao Início
        </a>
      </div>
    </div>
  );
};

export default NotFound;
