import { Coins, Image, Gamepad2, Vote, ShoppingBag, TrendingUp } from 'lucide-react';

const categories = [
  {
    icon: Coins,
    title: 'DeFi',
    description: 'Decentralized Finance',
    count: '500+ Apps',
    color: 'from-yellow-600 to-orange-600',
  },
  {
    icon: Image,
    title: 'NFT Marketplaces',
    description: 'Digital Collectibles',
    count: '200+ Apps',
    color: 'from-pink-600 to-purple-600',
  },
  {
    icon: Gamepad2,
    title: 'Gaming',
    description: 'Play-to-Earn',
    count: '150+ Apps',
    color: 'from-green-600 to-emerald-600',
  },
  {
    icon: Vote,
    title: 'DAOs',
    description: 'Decentralized Governance',
    count: '100+ Apps',
    color: 'from-blue-600 to-cyan-600',
  },
  {
    icon: ShoppingBag,
    title: 'Marketplaces',
    description: 'Decentralized Commerce',
    count: '80+ Apps',
    color: 'from-indigo-600 to-purple-600',
  },
  {
    icon: TrendingUp,
    title: 'Trading',
    description: 'Decentralized Exchanges',
    count: '120+ Apps',
    color: 'from-red-600 to-pink-600',
  },
];

export function Categories() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-white mb-4">Explore by Category</h2>
        <p className="text-purple-200/70">
          Discover decentralized applications across various blockchain ecosystems
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 p-6 hover:bg-white/10 transition-all cursor-pointer"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
            
            <div className="relative">
              <div className={`w-14 h-14 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <category.icon className="w-7 h-7 text-white" />
              </div>
              
              <h3 className="text-white mb-1">{category.title}</h3>
              <p className="text-purple-200/70 mb-3">{category.description}</p>
              <span className="text-purple-400">{category.count}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
