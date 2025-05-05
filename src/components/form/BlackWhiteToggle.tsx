
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface BlackWhiteToggleProps {
  includeBW: boolean;
  onChange: (include: boolean) => void;
}

const BlackWhiteToggle = ({ includeBW, onChange }: BlackWhiteToggleProps) => {
  return (
    <div className="mt-4">
      <div className="flex items-center space-x-2">
        <Switch 
          id="include-bw" 
          checked={includeBW} 
          onCheckedChange={onChange} 
        />
        <Label htmlFor="include-bw" className="text-sm font-medium">
          Include Black & White
        </Label>
      </div>
    </div>
  );
};

export default BlackWhiteToggle;
