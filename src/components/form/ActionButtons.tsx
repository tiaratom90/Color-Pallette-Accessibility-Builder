
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface ActionButtonsProps {
  onCheckContrast: () => void;
  onReset: () => void;
}

const ActionButtons = ({ onCheckContrast, onReset }: ActionButtonsProps) => {
  return (
    <div className="space-y-4 mt-6">
      <div className="flex gap-4">
        <Button onClick={onCheckContrast} className="flex-1">
          Check Contrast
        </Button>
        <Button 
          variant="outline" 
          onClick={onReset}
          className="flex gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Reset
        </Button>
      </div>
    </div>
  );
};

export default ActionButtons;
