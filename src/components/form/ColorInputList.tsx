
import ColorInput from "@/components/ColorInput";

interface ColorInputListProps {
  colors: string[];
  colorNames: string[];
  onColorChange: (index: number, value: string) => void;
  onColorNameChange: (index: number, value: string) => void;
}

const ColorInputList = ({ colors, colorNames, onColorChange, onColorNameChange }: ColorInputListProps) => {
  return (
    <div className="space-y-5">
      {colors.map((color, index) => (
        <ColorInput
          key={index}
          value={color}
          name={colorNames[index]}
          onChange={(value) => onColorChange(index, value)}
          onNameChange={(value) => onColorNameChange(index, value)}
          index={index}
        />
      ))}
      <div className="text-sm text-gray-500 mt-2">
        Enter up to 6 colors. You can customize the color labels.
      </div>
    </div>
  );
};

export default ColorInputList;
