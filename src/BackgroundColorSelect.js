import Option from "./Option";
import Select from "./Select";

import { BACKGROUND_COLOR_STYLE_MAP } from "./RichTextEditorUtils";

export default function BackgroundColorSelect(props) {
  const editorState = props.editorState;
  const onToggleBackgroundColor = props.onToggleBackgroundColor;
  const styleSelect = props.styleSelect;

  const currentInlineStyle = editorState.getCurrentInlineStyle();

  const selectedBackgroundColors = BACKGROUND_COLORS.filter((backgroundColor) => currentInlineStyle.has(backgroundColor.style));
  const selectedBackgroundColor = selectedBackgroundColors.length > 0 ? selectedBackgroundColors[0].label : "Background Color";
  const selectedBackgroundColorCode = selectedBackgroundColors.length > 0 ? selectedBackgroundColors[0].code : null;

  function getSelectedOptionText() {
    if (selectedBackgroundColorCode) {
      return (
        <>
          {selectedBackgroundColorCode}
          <div style={{ width: "10px" }}></div>
          {selectedBackgroundColor}
        </>
      );
    } else {
      return selectedBackgroundColor;
    }
  }

  function onChange(e) {
    onToggleBackgroundColor(BACKGROUND_COLORS[e.target.selectedIndex].style);
  }

  return (
    <Select onChange={onChange} selectedOptionText={getSelectedOptionText()} style={{ "--columns": "5", ...styleSelect }}>
      {BACKGROUND_COLORS.map((backgroundColor, backgroundColorIndex) => (
        <Option key={"option-" + backgroundColorIndex} onClick={(e) => onToggleBackgroundColor(backgroundColor.style)} selected={currentInlineStyle.has(backgroundColor.style)}>
          {backgroundColor.code}
          <div style={{ flexGrow: "1" }}></div>
          {backgroundColor.label}
        </Option>
      ))}
    </Select>
  );
}

const BACKGROUND_COLORS = Object.keys(BACKGROUND_COLOR_STYLE_MAP).map((style) => {
  return {
    code: <div style={{ alignItems: "center", backgroundColor: BACKGROUND_COLOR_STYLE_MAP[style].backgroundColor, border: "1px solid #b3b3b3", display: "flex", height: "16px", justifyContent: "center", width: "16px" }}></div>,
    label: BACKGROUND_COLOR_STYLE_MAP[style].backgroundColor,
    style,
  };
});
