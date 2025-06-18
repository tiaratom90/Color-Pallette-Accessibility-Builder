
import { Button } from "@/components/ui/button";
import { Palette } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SuggestPaletteButtonProps {
  onSuggest: (colors: string[]) => void;
}

const colorPalettes = [
  // Material Design palette
  ["#F44336", "#E91E63", "#9C27B0", "#673AB7", "#3F51B5", "#2196F3"],
  // Nature palette
  ["#4CAF50", "#8BC34A", "#CDDC39", "#FFEB3B", "#FFC107", "#FF9800"],
  // Ocean palette
  ["#00BCD4", "#03A9F4", "#2196F3", "#3F51B5", "#673AB7", "#9C27B0"],
  // Pastel palette
  ["#FFB6C1", "#FFD700", "#98FB98", "#AFEEEE", "#D8BFD8", "#DDA0DD"],
  // Monochromatic blue
  ["#E3F2FD", "#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#2196F3"],
  // Bold contrast
  ["#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FFFF00"],
];

const SuggestPaletteButton = ({ onSuggest }: SuggestPaletteButtonProps) => {
  const { toast } = useToast();

  const suggestPalette = () => {
    // Randomly select a palette
    const randomIndex = Math.floor(Math.random() * colorPalettes.length);
    const selectedPalette = colorPalettes[randomIndex];
    
    onSuggest(selectedPalette);
    
    toast({
      title: "Palette Suggested",
      description: "A random color palette has been generated for you.",
    });
  };

  return (
    <Button 
      variant="outline" 
      onClick={suggestPalette}
      size="sm"
      className="flex items-center gap-2"
    >
      <Palette className="h-4 w-4" /> 
      Suggest Palette
    </Button>
  );
};

export default SuggestPaletteButton;
