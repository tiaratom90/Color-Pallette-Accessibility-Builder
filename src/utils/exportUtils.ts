
import html2canvas from "html2canvas";
import { ColorResult } from "./contrastUtils";

// Format data for export to JSON
export const formatDataForExport = (
  results: Record<string, Record<string, ColorResult>>,
  colorNames: string[]
) => {
  const exportData = {
    colors: Object.keys(results).map((color, index) => ({
      hex: color,
      name: colorNames[index] || `Color ${index + 1}`,
    })),
    combinations: [] as Array<{
      color1: string;
      color2: string;
      ratio: string;
      level: {
        aaa: boolean;
        aa: boolean;
        aaLarge: boolean;
      };
    }>,
    timestamp: new Date().toISOString(),
  };

  // Add all combinations
  Object.entries(results).forEach(([color1, combinations]) => {
    Object.entries(combinations).forEach(([color2, result]) => {
      exportData.combinations.push({
        color1,
        color2,
        ratio: result.ratio,
        level: result.level,
      });
    });
  });

  return exportData;
};

// Export as JSON file
export const exportAsJSON = (
  results: Record<string, Record<string, ColorResult>>,
  colorNames: string[]
) => {
  const data = formatDataForExport(results, colorNames);
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.href = url;
  link.download = `contrast-results-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
  return true;
};

// Enhanced PNG export with custom renderer
export const exportAsPNG = async (
  activeTabPanel: Element
): Promise<boolean> => {
  // Get the current tab type (by-color or by-accessibility)
  const tabType = activeTabPanel.getAttribute('value') || 'by-color';
  
  // Create a container for our custom rendering
  const exportContainer = document.createElement('div');
  exportContainer.style.position = 'fixed';
  exportContainer.style.left = '-9999px';
  exportContainer.style.top = '0';
  exportContainer.style.width = '1200px'; // Fixed width for consistent output
  exportContainer.style.backgroundColor = 'white';
  exportContainer.style.padding = '40px';
  exportContainer.style.fontFamily = 'system-ui, -apple-system, sans-serif';
  document.body.appendChild(exportContainer);
  
  try {
    // Clone the content but customize it for export
    const clone = activeTabPanel.cloneNode(true) as HTMLElement;
    
    // Remove interactive elements and UI controls
    const elementsToRemove = [
      'button:has(.lucide-copy)', // Copy buttons
      '.dropdown-menu', // Dropdown menus
      '[role="tablist"]', // Tab lists
    ];
    
    elementsToRemove.forEach(selector => {
      clone.querySelectorAll(selector).forEach(el => {
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      });
    });
    
    // Add title
    const title = document.createElement('h1');
    title.textContent = `Contrast Results - ${new Date().toLocaleDateString()}`;
    title.style.fontSize = '28px';
    title.style.marginBottom = '24px';
    title.style.fontWeight = 'bold';
    
    exportContainer.appendChild(title);
    exportContainer.appendChild(clone);
    
    // Ensure all color swatches render properly
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Enhance visuals for export
    const swatches = exportContainer.querySelectorAll('.relative.group');
    swatches.forEach(swatch => {
      const swatchEl = swatch as HTMLElement;
      swatchEl.style.marginBottom = '10px';
      swatchEl.style.pageBreakInside = 'avoid';
    });
    
    // Take screenshot with enhanced settings
    const canvas = await html2canvas(exportContainer, {
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#ffffff",
      logging: false,
      width: 1200,
      height: exportContainer.offsetHeight,
    });
    
    // Convert to PNG and download
    canvas.toBlob((blob) => {
      if (!blob) {
        throw new Error("Failed to create image");
      }
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `contrast-results-${new Date().toISOString().slice(0, 10)}.png`;
      link.href = url;
      link.click();
      
      URL.revokeObjectURL(url);
    }, "image/png", 1.0);
    
    return true;
  } catch (error) {
    console.error("Error in PNG export:", error);
    throw error;
  } finally {
    document.body.removeChild(exportContainer);
  }
};

// Create a function to generate improved SVG from the contrast results
export const exportAsSVG = (
  results: Record<string, Record<string, ColorResult>>,
  colorNames: string[]
): boolean => {
  // Get proper color names, avoid overlapping labels
  const getProperColorName = (color: string, index: number): string => {
    if (color === '#FFFFFF') return 'White';
    if (color === '#000000') return 'Black';
    
    const colorIndex = Object.keys(results).indexOf(color);
    if (colorIndex !== -1 && colorNames[colorIndex] && colorNames[colorIndex].trim() !== '') {
      return colorNames[colorIndex];
    }
    
    return `Color ${index + 1}`;
  };
  
  // Start SVG document
  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="${Object.keys(results).length * 200 + 100}" viewBox="0 0 800 ${Object.keys(results).length * 200 + 100}">
  <style>
    .title { font: bold 24px sans-serif; }
    .color-name { font: bold 16px sans-serif; }
    .color-hex { font: 14px monospace; }
    .sample-text { font: 24px serif; text-anchor: middle; dominant-baseline: central; }
    .ratio-text { font: 12px monospace; text-anchor: middle; }
    .result-badge { font: bold 10px sans-serif; text-anchor: middle; dominant-baseline: central; }
  </style>
  <rect width="100%" height="100%" fill="white"/>
  <text x="20" y="40" class="title">Contrast Results - ${new Date().toLocaleDateString()}</text>`;

  // Function to create color swatch in SVG
  const createSwatch = (color1: string, color2: string, result: ColorResult, x: number, y: number, colorName: string) => {
    // Color display block
    const swatchWidth = 120;
    const swatchHeight = 80;
    
    // Create the color sample
    let swatch = `
    <g transform="translate(${x}, ${y})">
      <!-- Color Info -->
      <text x="0" y="-10" class="color-name">${colorName}</text>
      
      <!-- Color Sample -->
      <rect x="0" y="0" width="${swatchWidth}" height="${swatchHeight}" fill="${color1}" stroke="#ddd" stroke-width="1" />
      <text x="${swatchWidth/2}" y="${swatchHeight/2}" class="sample-text" fill="${color2}">Aa</text>
      
      <!-- Contrast Ratio -->
      <text x="${swatchWidth/2}" y="${swatchHeight + 20}" class="ratio-text">${result.ratio}:1</text>
      
      <!-- Result Badges -->
      <rect x="0" y="${swatchHeight + 30}" width="40" height="20" rx="4" fill="${result.level.aaa ? '#d1fae5' : '#fee2e2'}" />
      <text x="20" y="${swatchHeight + 40}" class="result-badge" fill="${result.level.aaa ? '#047857' : '#b91c1c'}">AAA</text>
      
      <rect x="45" y="${swatchHeight + 30}" width="40" height="20" rx="4" fill="${result.level.aa ? '#d1fae5' : '#fee2e2'}" />
      <text x="65" y="${swatchHeight + 40}" class="result-badge" fill="${result.level.aa ? '#047857' : '#b91c1c'}">AA</text>
      
      <rect x="90" y="${swatchHeight + 30}" width="40" height="20" rx="4" fill="${result.level.aaLarge ? '#d1fae5' : '#fee2e2'}" />
      <text x="110" y="${swatchHeight + 40}" class="result-badge" fill="${result.level.aaLarge ? '#047857' : '#b91c1c'}">AA+</text>
    </g>`;
    
    return swatch;
  };

  // Position counters
  let yOffset = 100;
  
  // Process each color
  Object.entries(results).forEach(([color1, combinations], colorIndex) => {
    const colorName = getProperColorName(color1, colorIndex);
    
    // Add color heading
    svgContent += `
    <g transform="translate(20, ${yOffset - 40})">
      <circle cx="10" cy="10" r="10" fill="${color1}" />
      <text x="30" y="15" class="color-name">${colorName}</text>
      <text x="30" y="35" class="color-hex">${color1}</text>
    </g>`;
    
    let xOffset = 20;
    
    // Process combinations for this color
    Object.entries(combinations).forEach(([color2, result], comboIndex) => {
      // Find color name for color2 - fixed to avoid overlapping labels
      const color2Index = Object.keys(results).indexOf(color2);
      const color2Name = getProperColorName(color2, color2Index);
      
      // Add the swatch to SVG
      svgContent += createSwatch(color1, color2, result, xOffset, yOffset, color2Name);
      
      // Move right for next swatch
      xOffset += 140;
      
      // If reached the edge, move to next line
      if ((comboIndex + 1) % 5 === 0) {
        xOffset = 20;
        yOffset += 150;
      }
    });
    
    // Move to next line for next color group
    yOffset += 200;
  });
  
  // Close SVG document
  svgContent += `</svg>`;
  
  // Create download link
  const blob = new Blob([svgContent], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = `contrast-results-${new Date().toISOString().slice(0, 10)}.svg`;
  link.href = url;
  link.click();
  
  URL.revokeObjectURL(url);
  return true;
};
