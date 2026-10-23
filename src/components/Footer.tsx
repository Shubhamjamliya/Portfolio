const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground border-t border-secondary-foreground/10">
      <div className="px-6 md:px-12 lg:px-24 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="font-heading text-sm font-bold">
          SJ<span className="text-primary">.</span> © 2025
        </p>
        <p className="text-xs text-secondary-foreground/40 uppercase tracking-widest">
          Designed & Built with precision
        </p>
      </div>
    </footer>
  );
};

export default Footer;
