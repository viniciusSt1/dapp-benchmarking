import { ExternalLink, Star } from 'lucide-react';

const dapps = [
  {
    name: 'Uniswap',
    category: 'DeFi',
    description: 'Leading decentralized exchange protocol for trading ERC-20 tokens',
    blockchain: 'Ethereum',
    users: '3.5M+',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1641580559176-d4b2b44863b4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcnlwdG9jdXJyZW5jeSUyMGRpZ2l0YWx8ZW58MXx8fHwxNzY1MTM4MTAzfDA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'OpenSea',
    category: 'NFT',
    description: 'Largest NFT marketplace for buying, selling, and discovering digital assets',
    blockchain: 'Ethereum',
    users: '2.1M+',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1666816943035-15c29931e975?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibG9ja2NoYWluJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NjUwNDI4MTh8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
  {
    name: 'Aave',
    category: 'DeFi',
    description: 'Decentralized lending protocol for earning interest and borrowing assets',
    blockchain: 'Multi-chain',
    users: '1.8M+',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1731690435374-5d8b4f1a3d47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZXR3b3JrJTIwZGVjZW50cmFsaXplZHxlbnwxfHx8fDE3NjUxMzgxMDJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
  },
];

export function FeaturedDApps() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h2 className="text-white mb-4">Featured dApps</h2>
        <p className="text-purple-200/70">
          Popular decentralized applications trusted by millions of users
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {dapps.map((dapp, index) => (
          <div
            key={index}
            className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:bg-white/10 transition-all"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={dapp.image}
                alt={dapp.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />
              <span className="absolute top-4 right-4 px-3 py-1 bg-purple-600 text-white rounded-full">
                {dapp.category}
              </span>
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-white">{dapp.name}</h3>
                <ExternalLink className="w-5 h-5 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              
              <p className="text-purple-200/70 mb-4">{dapp.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div>
                  <div className="text-purple-400">{dapp.blockchain}</div>
                  <div className="text-purple-200">{dapp.users} users</div>
                </div>
                
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                  <span className="text-white">{dapp.rating}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
