
import { AccessibilityGroups } from "@/utils/contrastUtils";
import SwatchWithLabel from "./SwatchWithLabel";

interface ByAccessibilityTabProps {
  accessibilityGroups: AccessibilityGroups;
  colorNames: string[];
}

const ByAccessibilityTab = ({ accessibilityGroups, colorNames }: ByAccessibilityTabProps) => {
  // Find color name by hex color
  const getColorName = (hexColor: string): string => {
    const index = colorNames.findIndex((_, i) => 
      colorNames[i] === hexColor
    );
    
    return index !== -1 && colorNames[index] ? colorNames[index] : "";
  };

  return (
    <div className="space-y-8">
      {accessibilityGroups.aaa.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3 text-green-700 dark:text-green-400 border-b pb-2 dark:border-gray-700">
            Passing AAA Level ({accessibilityGroups.aaa.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {accessibilityGroups.aaa.map(({ color1, color2, result }, index) => (
              <div key={`aaa-${index}`} className="relative">
                <SwatchWithLabel 
                  color1={color1} 
                  color2={color2} 
                  result={result}
                  color1Name={getColorName(color1)}
                  color2Name={getColorName(color2)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {accessibilityGroups.aa.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3 text-blue-700 dark:text-blue-400 border-b pb-2 dark:border-gray-700">
            Passing AA Level ({accessibilityGroups.aa.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {accessibilityGroups.aa.map(({ color1, color2, result }, index) => (
              <div key={`aa-${index}`} className="relative">
                <SwatchWithLabel 
                  color1={color1} 
                  color2={color2} 
                  result={result}
                  color1Name={getColorName(color1)}
                  color2Name={getColorName(color2)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {accessibilityGroups.aaLarge.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3 text-yellow-700 dark:text-yellow-400 border-b pb-2 dark:border-gray-700">
            Passing AA Large Only ({accessibilityGroups.aaLarge.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {accessibilityGroups.aaLarge.map(({ color1, color2, result }, index) => (
              <div key={`aaLarge-${index}`} className="relative">
                <SwatchWithLabel 
                  color1={color1} 
                  color2={color2} 
                  result={result}
                  color1Name={getColorName(color1)}
                  color2Name={getColorName(color2)}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {accessibilityGroups.failed.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-3 text-red-700 dark:text-red-400 border-b pb-2 dark:border-gray-700">
            Failed All Levels ({accessibilityGroups.failed.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {accessibilityGroups.failed.map(({ color1, color2, result }, index) => (
              <div key={`failed-${index}`} className="relative">
                <SwatchWithLabel 
                  color1={color1} 
                  color2={color2} 
                  result={result}
                  color1Name={getColorName(color1)}
                  color2Name={getColorName(color2)}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ByAccessibilityTab;
