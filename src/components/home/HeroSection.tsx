import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, Shield, Users } from "lucide-react";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  const stats = [
    { value: "10M+", label: "Active Users" },
    { value: "500K+", label: "Matches Made" },
    { value: "98%", label: "Satisfaction Rate" },
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Romantic sunset"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 pt-24 pb-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/80 backdrop-blur-sm text-accent-foreground mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Find your perfect match today</span>
            </div>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Where <span className="text-gradient">Love</span> Stories
              <br />
              Begin
            </h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
              Join millions of singles looking for meaningful connections. 
              Our intelligent matchmaking helps you find someone who truly gets you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link to="/signup">
                <Button variant="hero" size="xl" className="w-full sm:w-auto">
                  <Heart className="h-5 w-5" />
                  Start Finding Love
                </Button>
              </Link>
              <Link to="/discover">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Browse Profiles
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                  className="text-center lg:text-left"
                >
                  <div className="font-display text-2xl sm:text-3xl font-bold text-gradient">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="hidden lg:block"
          >
            <div className="space-y-4">
              {[
                {
                  icon: Heart,
                  title: "Smart Matching",
                  description: "AI-powered algorithm finds your most compatible matches",
                },
                {
                  icon: Shield,
                  title: "Safe & Secure",
                  description: "Verified profiles and encrypted conversations",
                },
                {
                  icon: Users,
                  title: "Real Connections",
                  description: "Meet genuine people looking for real relationships",
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.15 }}
                  className="glass rounded-2xl p-6 shadow-card hover:shadow-hover transition-all duration-300 border border-border/50"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl gradient-primary">
                      <feature.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-10" />
    </section>
  );
};

export default HeroSection;
