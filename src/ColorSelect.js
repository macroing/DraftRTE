import Option from "./Option";
import Select from "./Select";

import { COLOR_STYLE_MAP } from "./RichTextEditorUtils";

export default function ColorSelect(props) {
  const editorState = props.editorState;
  const onToggleColor = props.onToggleColor;
  const styleSelect = props.styleSelect;

  const currentInlineStyle = editorState.getCurrentInlineStyle();

  const selectedColors = COLORS.filter((color) => currentInlineStyle.has(color.style));
  const selectedColor = selectedColors.length > 0 ? selectedColors[0].label : "Color";
  const selectedColorCode = selectedColors.length > 0 ? selectedColors[0].code : null;

  function getSelectedOptionText() {
    if (selectedColorCode) {
      return (
        <>
          {selectedColorCode}
          <div style={{ width: "10px" }}></div>
          {selectedColor}
        </>
      );
    } else {
      return selectedColor;
    }
  }

  function onChange(e) {
    onToggleColor(COLORS[e.target.selectedIndex].style);
  }

  return (
    <Select onChange={onChange} selectedOptionText={getSelectedOptionText()} style={{ "--columns": "5", ...styleSelect }}>
      {COLORS.map((color, colorIndex) => (
        <Option key={"option-" + colorIndex} onClick={(e) => onToggleColor(color.style)} selected={currentInlineStyle.has(color.style)}>
          {color.code}
          <div style={{ flexGrow: "1" }}></div>
          {color.label}
        </Option>
      ))}
    </Select>
  );
}

const COLORS = Object.keys(COLOR_STYLE_MAP).map((style) => {
  return {
    code: <div style={{ alignItems: "center", backgroundColor: COLOR_STYLE_MAP[style].color, border: "1px solid #b3b3b3", display: "flex", height: "16px", justifyContent: "center", width: "16px" }}></div>,
    label: COLOR_STYLE_MAP[style].color,
    style,
  };
});
