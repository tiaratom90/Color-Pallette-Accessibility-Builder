
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import Results from '@/components/Results';
import ColorInputList from '@/components/form/ColorInputList';
import ActionButtons from '@/components/form/ActionButtons';
import ContrastSummary from '@/components/summary/ContrastSummary';
import BlackWhiteToggle from '@/components/form/BlackWhiteToggle';
import { calculateColorContrast, SummaryType } from '@/utils/contrastUtils';
import ThemeToggle from '@/components/ThemeToggle';
import { useSearchParams } from 'react-router-dom';

const Index = () => {
  const [colors, setColors] = useState<string[]>(Array(6).fill(''));
  const [colorNames, setColorNames] = useState<string[]>(Array(6).fill(''));
  const [results, setResults] = useState<Record<string, Record<string, any>>>({});
  const [summary, setSummary] = useState<SummaryType | null>(null);
  const [includeBW, setIncludeBW] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Add color history tracking for undo functionality
  const [colorHistory, setColorHistory] = useState<string[][]>([]);
  const [canUndo, setCanUndo] = useState<boolean>(false);
  
  const { toast } = useToast();

  // Load colors from URL if available
  useEffect(() => {
    const urlColors = searchParams.get('colors');
    if (urlColors) {
      try {
        const parsedColors = urlColors.split(',');
        if (parsedColors.length > 0) {
          const newColors = [...colors];
          parsedColors.forEach((color, index) => {
            if (index < 6 && /^#[0-9A-Fa-f]{6}$/.test(color)) {
              newColors[index] = color;
            }
          });
          setColors(newColors);
          checkColors(newColors);
        }
      } catch (error) {
        console.error('Error parsing colors from URL:', error);
      }
    }
  }, []);

  const handleColorChange = (index: number, value: string) => {
    const newColors = [...colors];
    newColors[index] = value;
    setColors(newColors);
  };

  const handleColorNameChange = (index: number, value: string) => {
    const newNames = [...colorNames];
    newNames[index] = value;
    setColorNames(newNames);
  };

  const handleColorUpdate = (originalColor: string, newColor: string) => {
    // Save current colors to history before updating
    setColorHistory(prev => [...prev, [...colors]]);
    setCanUndo(true);
    
    // Find this color in the colors array and update it
    const colorIndex = colors.findIndex(color => color === originalColor);
    
    if (colorIndex !== -1) {
      // Update the color in the array
      const newColors = [...colors];
      newColors[colorIndex] = newColor;
      setColors(newColors);
      
      // Recalculate results with the new color
      checkColors(newColors);
      
      toast({
        title: "Color updated",
        description: `${originalColor} has been updated to ${newColor} for better accessibility.`,
      });
    } else {
      // This might be a black or white color that's not in the colors array
      toast({
        title: "Color update notice",
        description: "This color isn't part of your palette and can't be updated.",
      });
    }
  };

  const undoColorChange = () => {
    if (colorHistory.length > 0) {
      const previousColors = colorHistory[colorHistory.length - 1];
      setColors(previousColors);
      checkColors(previousColors);
      
      // Remove the last item from history
      setColorHistory(prev => prev.slice(0, -1));
      setCanUndo(colorHistory.length > 1);
      
      toast({
        title: "Change undone",
        description: "Previous color palette has been restored.",
      });
    }
  };

  const checkColors = (colorsToCheck = colors) => {
    const validColors = colorsToCheck.filter(color => /^#[0-9A-Fa-f]{6}$/.test(color));
    
    if (validColors.length < 1) {
      toast({
        title: "Invalid Input",
        description: "Please enter at least one valid hex color code.",
        variant: "destructive",
      });
      return;
    }

    const { results: contrastResults, passCounts } = calculateColorContrast(validColors, includeBW);
    
    setResults(contrastResults);
    setSummary(passCounts);
    
    // Update URL with current colors
    setSearchParams({ colors: validColors.join(',') });
    
    toast({
      title: "Analysis Complete",
      description: "Color contrast analysis has been updated.",
    });
  };

  const resetForm = () => {
    setColors(Array(6).fill(''));
    setColorNames(Array(6).fill(''));
    setResults({});
    setSummary(null);
    setIncludeBW(true);
    setColorHistory([]);
    setCanUndo(false);
    setSearchParams({});
    toast({
      title: "Form Reset",
      description: "All inputs have been cleared.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <Card className="p-6 dark:bg-gray-800">
              <h1 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Color Scheme Accessibility Checker
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm">
                Check the contrast ratios between your colors to ensure your design meets accessibility standards.
              </p>

              <div className="mb-6">
                <BlackWhiteToggle
                  includeBW={includeBW}
                  onChange={setIncludeBW}
                />
              </div>
              
              <ColorInputList 
                colors={colors} 
                colorNames={colorNames}
                onColorChange={handleColorChange}
                onColorNameChange={handleColorNameChange}
              />
              
              <ActionButtons 
                onCheckContrast={() => checkColors()} 
                onReset={resetForm}
              />
              {summary && <ContrastSummary summary={summary} />}
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            <Results 
              results={results} 
              colorNames={colorNames} 
              summary={summary} 
              onColorUpdate={handleColorUpdate}
              canUndo={canUndo}
              onUndo={undoColorChange} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
