import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative gradient-hero rounded-3xl p-8 md:p-16 text-center overflow-hidden"
        >
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10">
            <div className="inline-flex items-center justify-center p-4 rounded-full bg-white/20 mb-6">
              <Heart className="h-10 w-10 text-primary-foreground animate-heart-beat" fill="currentColor" />
            </div>

            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Ready to Find Your
              <br />
              Perfect Match?
            </h2>

            <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto mb-8">
              Join over 10 million singles who have found meaningful connections on SparkLove. 
              Your love story is just a click away.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="xl"
                className="bg-background text-primary hover:bg-background/90 font-semibold w-full sm:w-auto"
                asChild
              >
                <Link to="/signup">
                  Create Free Account
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="xl"
                className="border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/20 w-full sm:w-auto"
                asChild
              >
                <Link to="/discover">
                  Browse Profiles First
                </Link>
              </Button>
            </div>

            <p className="text-sm text-primary-foreground/60 mt-6">
              Free to join • Verified profiles • Cancel anytime
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
