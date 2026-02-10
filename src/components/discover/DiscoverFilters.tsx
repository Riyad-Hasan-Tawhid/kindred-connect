import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DiscoverFiltersProps {
  ageMin: number;
  ageMax: number;
  gender: string;
  division: string;
  educationLevel: string;
  lookingFor: string;
  onAgeMinChange: (value: number) => void;
  onAgeMaxChange: (value: number) => void;
  onGenderChange: (value: string) => void;
  onDivisionChange: (value: string) => void;
  onEducationLevelChange: (value: string) => void;
  onLookingForChange: (value: string) => void;
  onReset: () => void;
  onApply: () => void;
}

const DiscoverFilters = ({
  ageMin,
  ageMax,
  gender,
  division,
  educationLevel,
  lookingFor,
  onAgeMinChange,
  onAgeMaxChange,
  onGenderChange,
  onDivisionChange,
  onEducationLevelChange,
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
      <div className="grid md:grid-cols-3 gap-6">
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
          <label className="text-sm font-medium mb-2 block">Gender</label>
          <select
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
            value={gender}
            onChange={(e) => onGenderChange(e.target.value)}
          >
            <option value="">Any</option>
            <option value="woman">Woman</option>
            <option value="man">Man</option>
            <option value="non-binary">Non-binary</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Division</label>
          <select
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
            value={division}
            onChange={(e) => onDivisionChange(e.target.value)}
          >
            <option value="">Any</option>
            <option value="Dhaka">Dhaka</option>
            <option value="Chattogram">Chattogram</option>
            <option value="Rajshahi">Rajshahi</option>
            <option value="Khulna">Khulna</option>
            <option value="Barishal">Barishal</option>
            <option value="Sylhet">Sylhet</option>
            <option value="Rangpur">Rangpur</option>
            <option value="Mymensingh">Mymensingh</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Education Level</label>
          <select
            className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm"
            value={educationLevel}
            onChange={(e) => onEducationLevelChange(e.target.value)}
          >
            <option value="">Any</option>
            <option value="School">School</option>
            <option value="College">College</option>
            <option value="University">University</option>
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
            <option value="Casual Dating">Casual Dating</option>
            <option value="Relationship">Relationship</option>
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
