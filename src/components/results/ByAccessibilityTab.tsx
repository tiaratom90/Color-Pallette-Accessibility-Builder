
import { AccessibilityGroups } from "@/utils/contrastUtils";
import SwatchWithLabel from "./SwatchWithLabel";

interface ByAccessibilityTabProps {
  accessibilityGroups: AccessibilityGroups;
  colorNames: string[];
  onColorUpdate?: (originalColor: string, newColor: string) => void;
}

const ByAccessibilityTab = ({ accessibilityGroups, colorNames, onColorUpdate }: ByAccessibilityTabProps) => {
  // Find color name by hex color
  const getColorName = (hexColor: string): string => {
    // Handle black and white separately
    if (hexColor === '#FFFFFF') return 'White';
    if (hexColor === '#000000') return 'Black';
    
    // Find the index of this color in the user's original color list
    const colorIndex = colorNames.findIndex((_, index) => {
      // Get the original list of user colors from the first color of each pair
      // in the results, excluding black and white
      const userColors = Object.values(accessibilityGroups)
        .flat()
        .map(combo => combo.color1)
        .filter(color => color !== '#FFFFFF' && color !== '#000000');
      
      // Get unique colors to map to indices
      const uniqueColors = Array.from(new Set(userColors));
      
      // Check if the current hexColor matches the color at this index
      return uniqueColors[index] === hexColor;
    });
    
    if (colorIndex !== -1 && colorNames[colorIndex] && colorNames[colorIndex].trim() !== '') {
      return colorNames[colorIndex];
    }
    
    // If no name is found, use a generic name based on color position
    const allColors = Object.values(accessibilityGroups)
      .flat()
      .map(combo => [combo.color1, combo.color2])
      .flat();
    
    const uniqueColors = Array.from(new Set(allColors))
      .filter(color => color !== '#FFFFFF' && color !== '#000000');
    
    const position = uniqueColors.indexOf(hexColor);
    
    if (position !== -1) {
      return `Color ${position + 1}`;
    }
    
    return ""; // Fallback
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
                  onColorUpdate={onColorUpdate}
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
                  onColorUpdate={onColorUpdate}
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
                  onColorUpdate={onColorUpdate}
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
                  onColorUpdate={onColorUpdate}
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
