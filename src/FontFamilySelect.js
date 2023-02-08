import Option from "./Option";
import Select from "./Select";

import { FONT_FAMILY_STYLE_MAP } from "./RichTextEditorUtils";

export default function FontFamilySelect(props) {
  const editorState = props.editorState;
  const onToggleFontFamily = props.onToggleFontFamily;
  const styleSelect = props.styleSelect;

  const currentInlineStyle = editorState.getCurrentInlineStyle();

  const selectedFontFamilies = FONT_FAMILIES.filter((fontFamily) => currentInlineStyle.has(fontFamily.style));
  const selectedFontFamily = selectedFontFamilies.length > 0 ? selectedFontFamilies[0].label : "Font Family";
  const selectedFontFamilyExists = selectedFontFamilies.length > 0;

  function getSelectedOptionText() {
    if (selectedFontFamilyExists) {
      return <span style={{ fontFamily: selectedFontFamily }}>{selectedFontFamily}</span>;
    } else {
      return selectedFontFamily;
    }
  }

  function onChange(e) {
    onToggleFontFamily(FONT_FAMILIES[e.target.selectedIndex].style);
  }

  return (
    <Select onChange={onChange} selectedOptionText={getSelectedOptionText()} style={{ "--columns": "4", ...styleSelect }}>
      {FONT_FAMILIES.map((fontFamily, fontFamilyIndex) => (
        <Option key={"option-font-family-" + fontFamilyIndex} onClick={(e) => onToggleFontFamily(fontFamily.style)} selected={currentInlineStyle.has(fontFamily.style)}>
          <span style={{ fontFamily: fontFamily.label }}>{fontFamily.label}</span>
        </Option>
      ))}
    </Select>
  );
}

const FONT_FAMILIES = Object.keys(FONT_FAMILY_STYLE_MAP).map((style) => {
  return { label: FONT_FAMILY_STYLE_MAP[style].fontFamily, style };
});
