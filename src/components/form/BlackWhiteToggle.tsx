
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface BlackWhiteToggleProps {
  includeBW: boolean;
  onChange: (include: boolean) => void;
}

const BlackWhiteToggle = ({ includeBW, onChange }: BlackWhiteToggleProps) => {
  return (
    <div className="px-3 py-2 inline-flex items-center space-x-2 bg-white dark:bg-gray-800">
      <Switch 
        id="include-bw" 
        checked={includeBW} 
        onCheckedChange={onChange} 
      />
      <Label htmlFor="include-bw" className="text-sm font-medium cursor-pointer">
        Include Black & White
      </Label>
    </div>
  );
};

export default BlackWhiteToggle;
