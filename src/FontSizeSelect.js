import Option from "./Option";
import Select from "./Select";

import { FONT_SIZE_STYLE_MAP } from "./RichTextEditorUtils";

export default function FontSizeSelect(props) {
  const editorState = props.editorState;
  const onToggleFontSize = props.onToggleFontSize;
  const styleSelect = props.styleSelect;

  const currentInlineStyle = editorState.getCurrentInlineStyle();

  const selectedFontSizes = FONT_SIZES.filter((fontSize) => currentInlineStyle.has(fontSize.style));
  const selectedFontSize = selectedFontSizes.length > 0 ? selectedFontSizes[0].label : "Font Size";

  function getSelectedOptionText() {
    return selectedFontSize;
  }

  function onChange(e) {
    onToggleFontSize(FONT_SIZES[e.target.selectedIndex].style);
  }

  return (
    <Select onChange={onChange} selectedOptionText={getSelectedOptionText()} style={{ "--columns": "3", ...styleSelect }}>
      {FONT_SIZES.map((fontSize, fontSizeIndex) => (
        <Option key={"option-" + fontSizeIndex} onClick={(e) => onToggleFontSize(fontSize.style)} selected={currentInlineStyle.has(fontSize.style)}>
          {fontSize.label}
        </Option>
      ))}
    </Select>
  );
}

const FONT_SIZES = Object.keys(FONT_SIZE_STYLE_MAP).map((style) => {
  return { label: FONT_SIZE_STYLE_MAP[style].fontSize, style };
});
