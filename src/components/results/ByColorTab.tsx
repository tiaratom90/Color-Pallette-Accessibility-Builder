
import { Card } from "@/components/ui/card";
import { ColorResult } from "@/utils/contrastUtils";
import ColorSwatch from "./ColorSwatch";

interface ByColorTabProps {
  results: Record<string, Record<string, ColorResult>>;
}

const ByColorTab = ({ results }: ByColorTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Object.entries(results).map(([color1, combinations]) => (
        <Card key={color1} className="overflow-hidden bg-white shadow-sm">
          <div className="p-3 border-b">
            <div className="flex items-center gap-2">
              <div 
                className="w-4 h-4 rounded-full border shadow-sm"
                style={{ backgroundColor: color1 }}
              />
              <span className="font-mono text-sm">{color1}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3">
            {Object.entries(combinations).map(([color2, result]) => (
              <div key={color2}>
                <ColorSwatch color1={color1} color2={color2} result={result} />
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ByColorTab;
