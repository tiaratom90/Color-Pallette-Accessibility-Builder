
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import Results from '@/components/Results';
import ColorInputList from '@/components/form/ColorInputList';
import ActionButtons from '@/components/form/ActionButtons';
import ContrastSummary from '@/components/summary/ContrastSummary';
import BlackWhiteToggle from '@/components/form/BlackWhiteToggle';
import { calculateColorContrast, SummaryType } from '@/utils/contrastUtils';
import ThemeToggle from '@/components/ThemeToggle';
import { useSearchParams } from 'react-router-dom';

// Add a style tag for PDF optimization
const pdfOptimizationStyles = `
@media print {
  /* Hide elements not needed in print */
  button {
    display: none !important;
  }
  
  /* Ensure backgrounds and colors are printed */
  * {
    -webkit-print-color-adjust: exact !important;
    color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  /* Force page breaks where needed */
  .page-break-after {
    page-break-after: always;
  }

  /* Ensure containers have proper dimensions */
  .card, .grid {
    break-inside: avoid;
    margin-bottom: 20px;
  }

  /* Force visibility of text */
  .text-gray-600, .text-gray-500, .text-gray-400, 
  .dark\\:text-gray-300, .dark\\:text-gray-400 {
    color: #333333 !important;
  }

  /* Better text legibility */
  * {
    font-family: Arial, sans-serif;
  }
}
`;

const Index = () => {
  const [colors, setColors] = useState<string[]>(Array(6).fill(''));
  const [colorNames, setColorNames] = useState<string[]>(Array(6).fill(''));
  const [results, setResults] = useState<Record<string, Record<string, any>>>({});
  const [summary, setSummary] = useState<SummaryType | null>(null);
  const [includeBW, setIncludeBW] = useState<boolean>(true);
  const [searchParams, setSearchParams] = useSearchParams();
  
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

  // Add the PDF optimization styles
  useEffect(() => {
    // Add the style element
    const styleEl = document.createElement('style');
    styleEl.textContent = pdfOptimizationStyles;
    document.head.appendChild(styleEl);
    
    // Clean up
    return () => {
      document.head.removeChild(styleEl);
    };
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

    const { results: contrastResults, passCounts } = calculateColorContrast(colors, includeBW);
    
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
            <Results results={results} colorNames={colorNames} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
