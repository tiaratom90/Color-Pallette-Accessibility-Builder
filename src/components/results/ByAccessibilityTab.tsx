
import { AccessibilityGroups } from "@/utils/contrastUtils";
import SwatchWithLabel from "./SwatchWithLabel";

interface ByAccessibilityTabProps {
  accessibilityGroups: AccessibilityGroups;
}

const ByAccessibilityTab = ({ accessibilityGroups }: ByAccessibilityTabProps) => {
  return (
    <div className="space-y-6">
      {accessibilityGroups.aaa.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2 text-green-700 border-b pb-1">
            Passing AAA Level ({accessibilityGroups.aaa.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {accessibilityGroups.aaa.map(({ color1, color2, result }, index) => (
              <div key={`aaa-${index}`} className="relative">
                <SwatchWithLabel color1={color1} color2={color2} result={result} />
              </div>
            ))}
          </div>
        </div>
      )}

      {accessibilityGroups.aa.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2 text-blue-700 border-b pb-1">
            Passing AA Level ({accessibilityGroups.aa.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {accessibilityGroups.aa.map(({ color1, color2, result }, index) => (
              <div key={`aa-${index}`} className="relative">
                <SwatchWithLabel color1={color1} color2={color2} result={result} />
              </div>
            ))}
          </div>
        </div>
      )}

      {accessibilityGroups.aaLarge.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2 text-yellow-700 border-b pb-1">
            Passing AA Large Only ({accessibilityGroups.aaLarge.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {accessibilityGroups.aaLarge.map(({ color1, color2, result }, index) => (
              <div key={`aaLarge-${index}`} className="relative">
                <SwatchWithLabel color1={color1} color2={color2} result={result} />
              </div>
            ))}
          </div>
        </div>
      )}

      {accessibilityGroups.failed.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2 text-red-700 border-b pb-1">
            Failed All Levels ({accessibilityGroups.failed.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {accessibilityGroups.failed.map(({ color1, color2, result }, index) => (
              <div key={`failed-${index}`} className="relative">
                <SwatchWithLabel color1={color1} color2={color2} result={result} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ByAccessibilityTab;
