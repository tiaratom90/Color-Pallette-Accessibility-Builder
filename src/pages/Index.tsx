import { useState } from 'react';
import ColorInput from '@/components/ColorInput';
import Results from '@/components/Results';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RefreshCw, Check, ExternalLink, FileDown } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface ColorResult {
  ratio: string;
  level: {
    aaa: boolean;
    aa: boolean;
    aaLarge: boolean;
  };
}

interface SummaryType {
  aaa: number;
  aa: number;
  aaLarge: number;
  total: number;
}

const Index = () => {
  const [colors, setColors] = useState<string[]>(Array(6).fill(''));
  const [results, setResults] = useState<Record<string, Record<string, ColorResult>>>({});
  const [summary, setSummary] = useState<SummaryType | null>(null);
  
  const { toast } = useToast();

  const handleColorChange = (index: number, value: string) => {
    const newColors = [...colors];
    newColors[index] = value;
    setColors(newColors);
  };

  const luminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return rs * 0.2126 + gs * 0.7152 + bs * 0.0722;
  };

  const hexToRgb = (hex: string) => {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map(h => h + h).join('');
    }
    const bigint = parseInt(hex, 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  };

  const contrast = (rgb1: number[], rgb2: number[]) => {
    const lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
    const lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return ((brightest + 0.05) / (darkest + 0.05)).toFixed(2);
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

    const allColors = ['#FFFFFF', '#000000', ...validColors];
    const newResults: Record<string, Record<string, ColorResult>> = {};
    let passCounts = { aaa: 0, aa: 0, aaLarge: 0, total: 0 };

    validColors.forEach(color1 => {
      newResults[color1] = {};
      allColors.forEach(color2 => {
        if (color1 === color2) return;

        const ratio = contrast(hexToRgb(color1), hexToRgb(color2));
        const numRatio = parseFloat(ratio);
        
        newResults[color1][color2] = {
          ratio,
          level: {
            aaa: numRatio >= 7,
            aa: numRatio >= 4.5,
            aaLarge: numRatio >= 3,
          }
        };

        passCounts.total++;
        if (numRatio >= 7) passCounts.aaa++;
        if (numRatio >= 4.5) passCounts.aa++;
        if (numRatio >= 3) passCounts.aaLarge++;
      });
    });

    setResults(newResults);
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
              <div className="space-y-4">
                {colors.map((color, index) => (
                  <ColorInput
                    key={index}
                    value={color}
                    onChange={(value) => handleColorChange(index, value)}
                    index={index}
                  />
                ))}
                <div className="text-sm text-gray-500 mt-2">
                  Enter up to 6 colors. Black and White are included by default.
                </div>
                <div className="flex gap-4 mt-6">
                  <Button onClick={checkColors} className="flex-1">
                    Check Contrast
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={resetForm}
                    className="flex gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Reset
                  </Button>
                </div>
                {summary && (
                  <div className="mt-6 space-y-4">
                    <div className="p-4 bg-white rounded-lg border">
                      <h3 className="font-medium mb-2">Summary</h3>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p>{summary.aaa} of {summary.total} pass AAA</p>
                        <p>{summary.aa} of {summary.total} pass AA</p>
                        <p>{summary.aaLarge} of {summary.total} pass AA Large</p>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                      <div className="text-sm font-medium mb-2">WCAG 2.1 Contrast Requirements</div>
                      <div className="space-y-2 text-xs">
                        <div className="flex items-start gap-2">
                          <div className="min-w-[40px] text-green-700 font-semibold">AAA:</div>
                          <span>7:1+ (normal text), 4.5:1+ (large text)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="min-w-[40px] text-blue-700 font-semibold">AA:</div>
                          <span>4.5:1+ (normal text), 3:1+ (large text)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <div className="min-w-[40px] text-yellow-700 font-semibold">AA Large:</div>
                          <span>3:1+ (large text only: 18pt+ or 14pt+ bold)</span>
                        </div>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <a 
                          href="https://www.w3.org/TR/WCAG21/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-xs text-blue-600 hover:underline"
                        >
                          <ExternalLink className="h-3.5 w-3.5 mr-1" />
                          WCAG Guidelines
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
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
