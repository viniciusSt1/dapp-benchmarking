import { Blocks } from 'lucide-react';

export function Hero() {
  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-purple-600/20 rounded-2xl backdrop-blur-sm border border-purple-500/30">
              <Blocks className="w-16 h-16 text-purple-400" />
            </div>
          </div>
          
          <h1 className="text-white mb-6 tracking-tight">
            Decentralized Applications
          </h1>
          
          <p className="text-purple-200 max-w-2xl mx-auto mb-8">
            Explore the future of blockchain technology with decentralized applications that put control back in your hands. No intermediaries, no censorship, just pure peer-to-peer innovation.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
              Explore dApps
            </button>
            <button className="px-8 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm border border-white/20">
              Learn More
            </button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
    </div>
  );
}
