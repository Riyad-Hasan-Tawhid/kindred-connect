import { motion } from "framer-motion";
import { UserPlus, Heart, MessageCircle, Coffee } from "lucide-react";

const HowItWorksSection = () => {
  const steps = [
    {
      icon: UserPlus,
      step: "01",
      title: "Create Your Profile",
      description: "Sign up in minutes. Add photos, share your interests, and tell your story.",
    },
    {
      icon: Heart,
      step: "02",
      title: "Get Matched",
      description: "Our smart algorithm finds compatible profiles based on your preferences.",
    },
    {
      icon: MessageCircle,
      step: "03",
      title: "Start Connecting",
      description: "Like profiles you're interested in. When it's mutual, start chatting!",
    },
    {
      icon: Coffee,
      step: "04",
      title: "Meet In Person",
      description: "Take your connection offline and meet for a coffee or dinner date.",
    },
  ];

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            How <span className="text-gradient">SparkLove</span> Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Finding your perfect match is simple with our easy 4-step process
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative text-center"
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-coral to-lavender" />
              )}

              {/* Step Number */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center shadow-lg">
                  <step.icon className="h-10 w-10 text-primary-foreground" />
                </div>
                <span className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-card border-4 border-background flex items-center justify-center font-display font-bold text-coral shadow-md">
                  {step.step}
                </span>
              </div>

              <h3 className="font-semibold text-xl mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
