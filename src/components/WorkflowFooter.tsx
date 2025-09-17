const WorkflowFooter = () => {
  const currentYear = new Date().getFullYear();

  const handlePrivacyClick = () => {
    window.location.href = '/politica-de-privacidade';
  };

  const handleTermsClick = () => {
    window.location.href = '/termos-de-uso';
  };

  return (
    <footer className="bg-workflow-deep text-white py-8 relative z-10">
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
            <button
              onClick={handlePrivacyClick}
              className="hover:text-workflow-zen transition-colors cursor-pointer bg-transparent border-none text-sm text-white/60 hover:underline"
              type="button"
            >
              Privacidade
            </button>
            <button
              onClick={handleTermsClick}
              className="hover:text-workflow-zen transition-colors cursor-pointer bg-transparent border-none text-sm text-white/60 hover:underline"
              type="button"
            >
              Termos
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default WorkflowFooter;
