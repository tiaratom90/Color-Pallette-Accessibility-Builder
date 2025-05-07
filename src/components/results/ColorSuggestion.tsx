
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, RefreshCw } from "lucide-react";
import { ColorResult } from "@/utils/contrastUtils";
import { suggestAccessibleColors, getAccessibilityLevelName } from "@/utils/colorAdjustUtils";
import { cn } from "@/lib/utils";

interface ColorSuggestionProps {
  color1: string;
  color2: string;
  result: ColorResult;
  onApplySuggestion: (newColor1: string, newColor2: string) => void;
}

const ColorSuggestion = ({ color1, color2, result, onApplySuggestion }: ColorSuggestionProps) => {
  const { toast } = useToast();
  const [adjustBackground, setAdjustBackground] = useState(false);
  const [suggestion, setSuggestion] = useState<{
    suggestedColor1: string;
    suggestedColor2: string;
    newRatio: string;
    targetLevel: string;
  } | null>(null);

  const generateSuggestion = () => {
    const newSuggestion = suggestAccessibleColors(color1, color2, adjustBackground);
    setSuggestion(newSuggestion);
    
    toast({
      title: "Color suggestion generated",
      description: `Adjusted to reach ${newSuggestion.targetLevel} level contrast.`,
    });
  };

  const toggleAdjustMode = () => {
    setAdjustBackground(!adjustBackground);
    setSuggestion(null); // Reset suggestion when toggling
  };

  const applySuggestion = () => {
    if (suggestion) {
      onApplySuggestion(suggestion.suggestedColor1, suggestion.suggestedColor2);
      toast({
        title: "Colors updated",
        description: "The suggested colors have been applied to your palette.",
      });
      setSuggestion(null);
    }
  };

  // Don't show suggestion UI if already AAA compliant
  if (result.level.aaa) {
    return null;
  }

  const currentLevel = result.level.aa 
    ? "AA" 
    : result.level.aaLarge 
      ? "AA Large" 
      : "Not accessible";

  return (
    <div className="mt-2 space-y-2 bg-gray-50 dark:bg-gray-900 p-2 rounded">
      <div className="flex justify-between items-center">
        <div className="text-xs font-medium">
          Current: <span className="text-gray-600 dark:text-gray-400">{currentLevel}</span>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="h-7 text-xs"
          onClick={toggleAdjustMode}
        >
          Adjust {adjustBackground ? "Background" : "Text"}
        </Button>
      </div>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full flex items-center gap-2 bg-white dark:bg-gray-800"
        onClick={generateSuggestion}
      >
        <Lightbulb className="h-3 w-3" /> Suggest Accessible Color
      </Button>

      {suggestion && (
        <div className="space-y-2">
          <div className="h-12 rounded overflow-hidden border" style={{ backgroundColor: suggestion.suggestedColor1 }}>
            <div className="h-full flex items-center justify-center font-serif text-xl" style={{ color: suggestion.suggestedColor2 }}>
              Aa
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <div className="font-medium">Background:</div>
              <div className="font-mono">{suggestion.suggestedColor1}</div>
            </div>
            <div>
              <div className="font-medium">Text:</div>
              <div className="font-mono">{suggestion.suggestedColor2}</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-xs">
              New ratio: <span className="font-medium">{suggestion.newRatio}:1</span>
              <span className={cn(
                "ml-2 px-1.5 py-0.5 rounded text-[0.65rem] font-semibold",
                suggestion.targetLevel === "AAA" 
                  ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300" 
                  : suggestion.targetLevel === "AA"
                    ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
              )}>
                {suggestion.targetLevel}
              </span>
            </div>
            
            <Button
              size="sm"
              className="h-7 text-xs"
              onClick={applySuggestion}
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ColorSuggestion;
