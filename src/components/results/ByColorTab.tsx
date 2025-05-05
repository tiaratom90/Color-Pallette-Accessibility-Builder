
import { Card } from "@/components/ui/card";
import { ColorResult } from "@/utils/contrastUtils";
import ColorSwatch from "./ColorSwatch";

interface ByColorTabProps {
  results: Record<string, Record<string, ColorResult>>;
  colorNames: string[];
}

const ByColorTab = ({ results, colorNames }: ByColorTabProps) => {
  // Find color name by hex color
  const getColorName = (hexColor: string): string => {
    const index = Object.values(results).findIndex((_, i) => 
      Object.keys(results)[i] === hexColor
    );
    
    return index !== -1 && colorNames[index] ? colorNames[index] : hexColor;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.entries(results).map(([color1, combinations]) => (
        <Card key={color1} className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
          <div className="p-4 border-b dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div 
                className="w-5 h-5 rounded-full border shadow-sm"
                style={{ backgroundColor: color1 }}
              />
              <span className="font-mono text-sm flex-shrink-0">{color1}</span>
              {getColorName(color1) !== color1 && (
                <span className="text-sm text-gray-500 truncate">
                  ({getColorName(color1)})
                </span>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {Object.entries(combinations).map(([color2, result]) => (
              <div key={color2}>
                <ColorSwatch 
                  color1={color1} 
                  color2={color2} 
                  result={result} 
                  colorName={getColorName(color2) !== color2 ? getColorName(color2) : undefined}
                />
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ByColorTab;
