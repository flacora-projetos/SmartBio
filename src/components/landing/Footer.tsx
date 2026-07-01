import { landingData } from '@/data/mock';

export function Footer() {
  return (
    <footer className="bg-ink text-white py-12 border-t border-white/10">
      <div className="container mx-auto px-4 max-w-6xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-ink font-bold text-lg italic font-heading">S</div>
          <span className="font-bold text-lg tracking-tight uppercase">SmartBio</span>
        </div>
        
        <nav className="flex items-center gap-8">
          {landingData.footer.links.map((link, i) => (
            <span key={i} className="text-sm text-white/40 cursor-default select-none">
              {link}
            </span>
          ))}
        </nav>
        
        <div className="text-sm text-white/50">
          &copy; {new Date().getFullYear()} SmartBio. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
