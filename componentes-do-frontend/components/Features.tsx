import { Shield, Zap, Users, Lock } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Trustless',
    description: 'Smart contracts execute automatically without intermediaries',
  },
  {
    icon: Lock,
    title: 'Secure',
    description: 'Cryptographic security ensures data integrity and privacy',
  },
  {
    icon: Users,
    title: 'Decentralized',
    description: 'No single point of failure or control by any entity',
  },
  {
    icon: Zap,
    title: 'Transparent',
    description: 'All transactions are publicly verifiable on the blockchain',
  },
];

export function Features() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
          >
            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center mb-4">
              <feature.icon className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="text-white mb-2">{feature.title}</h3>
            <p className="text-purple-200/70">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
