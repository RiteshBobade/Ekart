import { Headphones, Shield, Truck } from 'lucide-react'
import React from 'react'
import { motion } from 'framer-motion'

const featuresData = [
  {
    icon: Truck,
    title: "Free Shipping",
    description: "On orders over $50",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
  {
    icon: Shield,
    title: "Secure Payment",
    description: "100% secure transactions",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    icon: Headphones,
    title: "24/7 Support",
    description: "Always here to help",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  }
]

const Features = () => {
  return (
    <section className="py-20 relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-8 text-center">
          {featuresData.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              whileHover={{ y: -5 }}
              className="glass-card rounded-2xl p-8 flex flex-col items-center justify-center space-y-4 hover:border-primary/50 transition-colors cursor-pointer group shadow-lg"
            >
              <div className={`h-20 w-20 rounded-2xl ${feature.bg} flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                <feature.icon className={`h-10 w-10 ${feature.color}`} />
              </div>
              <div>
                <h3 className="font-bold text-xl mb-1 text-foreground tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features