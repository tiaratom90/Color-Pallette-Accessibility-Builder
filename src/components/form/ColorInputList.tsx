
import ColorInput from "@/components/ColorInput";

interface ColorInputListProps {
  colors: string[];
  onColorChange: (index: number, value: string) => void;
}

const ColorInputList = ({ colors, onColorChange }: ColorInputListProps) => {
  return (
    <div className="space-y-4">
      {colors.map((color, index) => (
        <ColorInput
          key={index}
          value={color}
          onChange={(value) => onColorChange(index, value)}
          index={index}
        />
      ))}
      <div className="text-sm text-gray-500 mt-2">
        Enter up to 6 colors. Black and White are included by default.
      </div>
    </div>
  );
};

export default ColorInputList;
