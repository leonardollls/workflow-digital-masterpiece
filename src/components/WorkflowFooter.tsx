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
            <a href="/privacidade" className="hover:text-workflow-zen transition-colors">
              Privacidade
            </a>
            <a href="/termos" className="hover:text-workflow-zen transition-colors">
              Termos
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default WorkflowFooter;
