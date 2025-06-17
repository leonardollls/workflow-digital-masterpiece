import { Link } from "react-router-dom";

const WorkflowFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-workflow-deep text-white py-8">
      <div className="container mx-auto px-6">
        {/* Simple Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          {/* Brand */}
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-display font-bold">
              Work<span className="text-workflow-zen">flow</span>
            </h3>
            <div className="text-white/60 text-sm">
              © {currentYear} Todos os direitos reservados.
            </div>
          </div>
          
          {/* Simple Links */}
          <div className="flex items-center gap-6 text-sm text-white/60">
            <Link 
              to="/briefing" 
              className="hover:text-workflow-zen transition-colors"
              onContextMenu={(e) => e.preventDefault()}
            >
              Briefing Landing Page
            </Link>
            <Link 
              to="/briefing-institucional" 
              className="hover:text-workflow-zen transition-colors"
              onContextMenu={(e) => e.preventDefault()}
            >
              Briefing Site Institucional
            </Link>
            <Link 
              to="/privacidade" 
              className="hover:text-workflow-zen transition-colors"
              onContextMenu={(e) => e.preventDefault()}
            >
              Privacidade
            </Link>
            <Link 
              to="/termos" 
              className="hover:text-workflow-zen transition-colors"
              onContextMenu={(e) => e.preventDefault()}
            >
              Termos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default WorkflowFooter;
