import { Github, Twitter, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-white mb-4">Decentralized Apps</h3>
            <p className="text-purple-200/70 mb-4">
              Your gateway to the decentralized web. Explore, discover, and engage with the next generation of blockchain applications.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                <Twitter className="w-5 h-5 text-purple-400" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                <Github className="w-5 h-5 text-purple-400" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                <MessageCircle className="w-5 h-5 text-purple-400" />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-purple-200/70 hover:text-purple-200 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-purple-200/70 hover:text-purple-200 transition-colors">Tutorials</a></li>
              <li><a href="#" className="text-purple-200/70 hover:text-purple-200 transition-colors">Blog</a></li>
              <li><a href="#" className="text-purple-200/70 hover:text-purple-200 transition-colors">Community</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-purple-200/70">
          <p>&copy; 2025 Decentralized Apps. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
