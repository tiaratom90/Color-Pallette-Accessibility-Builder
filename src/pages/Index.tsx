
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import Results from '@/components/Results';
import ColorInputList from '@/components/form/ColorInputList';
import ActionButtons from '@/components/form/ActionButtons';
import ContrastSummary from '@/components/summary/ContrastSummary';
import { calculateColorContrast, SummaryType } from '@/utils/contrastUtils';

const Index = () => {
  const [colors, setColors] = useState<string[]>(Array(6).fill(''));
  const [results, setResults] = useState<Record<string, Record<string, any>>>({});
  const [summary, setSummary] = useState<SummaryType | null>(null);
  
  const { toast } = useToast();

  const handleColorChange = (index: number, value: string) => {
    const newColors = [...colors];
    newColors[index] = value;
    setColors(newColors);
  };

  const checkColors = () => {
    const validColors = colors.filter(color => /^#[0-9A-Fa-f]{6}$/.test(color));
    
    if (validColors.length < 1) {
      toast({
        title: "Invalid Input",
        description: "Please enter at least one valid hex color code.",
        variant: "destructive",
      });
      return;
    }

    const { results: contrastResults, passCounts } = calculateColorContrast(colors);
    
    setResults(contrastResults);
    setSummary(passCounts);
    
    toast({
      title: "Analysis Complete",
      description: "Color contrast analysis has been updated.",
    });
  };

  const resetForm = () => {
    setColors(Array(6).fill(''));
    setResults({});
    setSummary(null);
    toast({
      title: "Form Reset",
      description: "All inputs have been cleared.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h1 className="text-2xl font-semibold mb-6 text-gray-900">
                Color Contrast Checker
              </h1>
              <ColorInputList 
                colors={colors} 
                onColorChange={handleColorChange} 
              />
              <ActionButtons 
                onCheckContrast={checkColors} 
                onReset={resetForm} 
              />
              {summary && <ContrastSummary summary={summary} />}
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            <Results results={results} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
