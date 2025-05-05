
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
    
    return index !== -1 && colorNames[index] ? colorNames[index] : `Color ${index + 1}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Object.entries(results).map(([color1, combinations]) => (
        <Card key={color1} className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm">
          <div className="p-4 border-b dark:border-gray-700">
            <div className="flex flex-col items-center">
              <div 
                className="w-8 h-8 rounded-full border shadow-sm mb-1"
                style={{ backgroundColor: color1 }}
              />
              <div className="text-center">
                <div className="font-medium">
                  {getColorName(color1)}
                </div>
                <div className="font-mono text-sm text-gray-500 dark:text-gray-400">
                  {color1}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
            {Object.entries(combinations).map(([color2, result]) => (
              <div key={color2}>
                <ColorSwatch 
                  color1={color1} 
                  color2={color2} 
                  result={result} 
                  colorName={getColorName(color2)}
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
