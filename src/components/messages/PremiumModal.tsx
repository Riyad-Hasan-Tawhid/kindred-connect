import { motion, AnimatePresence } from "framer-motion";
import { Crown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface PremiumModalProps {
  open: boolean;
  onClose: () => void;
  feature?: string;
}

const PremiumModal = ({ open, onClose, feature = "Audio and Video calls" }: PremiumModalProps) => {
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-card rounded-2xl shadow-card border border-border/50 p-6 max-w-sm w-full text-center"
          >
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-muted transition-colors duration-200 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="w-16 h-16 rounded-2xl gradient-premium flex items-center justify-center mx-auto mb-4">
              <Crown className="h-8 w-8 text-primary-foreground" />
            </div>

            <h3 className="font-display text-xl font-bold text-foreground mb-2">
              Premium Feature
            </h3>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              {feature} are available for Premium users only. Upgrade to unlock unlimited access.
            </p>

            <div className="flex flex-col gap-2">
              <Button
                onClick={() => {
                  onClose();
                  navigate("/profile");
                }}
                className="w-full gradient-premium text-primary-foreground font-semibold rounded-xl hover:shadow-hover transition-all duration-200 hover:-translate-y-0.5"
              >
                <Crown className="h-4 w-4 mr-2" />
                Upgrade to Premium
              </Button>
              <Button
                variant="ghost"
                onClick={onClose}
                className="w-full text-muted-foreground hover:text-foreground rounded-xl"
              >
                Maybe Later
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PremiumModal;
