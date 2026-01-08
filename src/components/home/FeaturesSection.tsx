import { motion } from "framer-motion";
import { Heart, MessageCircle, Search, Shield, Sparkles, Star, Crown, Zap } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      icon: Search,
      title: "Advanced Search",
      description: "Filter by age, location, interests, lifestyle, and more to find exactly who you're looking for.",
      color: "bg-coral",
    },
    {
      icon: Sparkles,
      title: "Smart Matching",
      description: "Our AI analyzes compatibility based on personality, values, and interests for better matches.",
      color: "bg-lavender",
    },
    {
      icon: MessageCircle,
      title: "Real-Time Chat",
      description: "Connect instantly with emojis, photos, read receipts, and typing indicators.",
      color: "bg-coral",
    },
    {
      icon: Shield,
      title: "Verified Profiles",
      description: "Photo and ID verification ensures you're connecting with real, genuine people.",
      color: "bg-lavender",
    },
    {
      icon: Heart,
      title: "Like & Match",
      description: "Express interest and get notified instantly when there's a mutual connection.",
      color: "bg-coral",
    },
    {
      icon: Star,
      title: "Compatibility Score",
      description: "See your match percentage with each profile based on shared values and interests.",
      color: "bg-lavender",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to Find <span className="text-gradient">Love</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you make meaningful connections
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-2xl p-6 shadow-card hover:shadow-hover transition-all duration-300 border border-border/50 group"
            >
              <div className={`${feature.color} w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-xl mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Premium Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 gradient-premium rounded-3xl p-8 md:p-12 shadow-lg"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-2xl bg-foreground/10">
                <Crown className="h-10 w-10 text-foreground" />
              </div>
              <div>
                <h3 className="font-display text-2xl font-bold mb-1">Upgrade to Premium</h3>
                <p className="text-foreground/80">Unlock unlimited messages, see who liked you, and boost your profile</p>
              </div>
            </div>
            <button className="px-8 py-4 bg-foreground text-background rounded-xl font-semibold hover:bg-foreground/90 transition-colors flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Get Premium
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
