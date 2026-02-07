import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DiscoverFiltersProps {
  ageMin: number;
  ageMax: number;
  location: string;
  distance: string;
  lookingFor: string;
  onAgeMinChange: (value: number) => void;
  onAgeMaxChange: (value: number) => void;
  onLocationChange: (value: string) => void;
  onDistanceChange: (value: string) => void;
  onLookingForChange: (value: string) => void;
  onReset: () => void;
  onApply: () => void;
}

const DiscoverFilters = ({
  ageMin,
  ageMax,
  location,
  distance,
  lookingFor,
  onAgeMinChange,
  onAgeMaxChange,
  onLocationChange,
  onDistanceChange,
  onLookingForChange,
  onReset,
  onApply,
}: DiscoverFiltersProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-card rounded-2xl p-6 mb-8 shadow-card border border-border/50 overflow-hidden"
    >
      <div className="grid md:grid-cols-4 gap-6">
        <div>
          <label className="text-sm font-medium mb-2 block">Age Range</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
              value={ageMin}
              onChange={(e) => onAgeMinChange(parseInt(e.target.value) || 18)}
              min={18}
              max={100}
            />
            <span className="text-muted-foreground">-</span>
            <input
              type="number"
              placeholder="Max"
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
              value={ageMax}
              onChange={(e) => onAgeMaxChange(parseInt(e.target.value) || 100)}
              min={18}
              max={100}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="City or ZIP"
              className="w-full pl-10 pr-3 py-2 rounded-lg border border-input bg-background text-sm"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Distance</label>
          <select
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
            value={distance}
            onChange={(e) => onDistanceChange(e.target.value)}
          >
            <option value="10">10 miles</option>
            <option value="25">25 miles</option>
            <option value="50">50 miles</option>
            <option value="100">100 miles</option>
            <option value="anywhere">Anywhere</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Looking For</label>
          <select
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
            value={lookingFor}
            onChange={(e) => onLookingForChange(e.target.value)}
          >
            <option value="">Any</option>
            <option value="Relationship">Relationship</option>
            <option value="Casual Dating">Casual Dating</option>
            <option value="Friendship">Friendship</option>
            <option value="Not Sure Yet">Not Sure Yet</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <Button variant="ghost" onClick={onReset}>
          Reset
        </Button>
        <Button onClick={onApply}>Apply Filters</Button>
      </div>
    </motion.div>
  );
};

export default DiscoverFilters;
