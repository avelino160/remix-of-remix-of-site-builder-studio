import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Página de projetos desativada: sempre redireciona para a tela de criação com IA
const Projects = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/app", { replace: true });
  }, [navigate]);

  return null;
};

export default Projects;
