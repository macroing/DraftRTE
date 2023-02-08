import Option from "./Option";
import Select from "./Select";

export default function HeaderSelect(props) {
  const editorState = props.editorState;
  const onToggleBlockType = props.onToggleBlockType;
  const styleSelect = props.styleSelect;

  const selection = editorState.getSelection();
  const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();

  const selectedHeaderTypes = HEADER_TYPES.filter((headerType) => headerType.style === blockType);
  const selectedHeaderType = selectedHeaderTypes.length > 0 ? selectedHeaderTypes[0].label : <span className="fas fa-heading"></span>;
  const selectedHeaderTypeExists = selectedHeaderTypes.length > 0;

  function getSelectedOptionText() {
    if (selectedHeaderTypeExists) {
      return selectedHeaderType;
    } else {
      return selectedHeaderType;
    }
  }

  function onChange(e) {
    onToggleBlockType(HEADER_TYPES[e.target.selectedIndex].style);
  }

  return (
    <Select onChange={onChange} selectedOptionText={getSelectedOptionText()} style={{ "--columns": "2", ...styleSelect }}>
      {HEADER_TYPES.map((headerType, headerTypeIndex) => (
        <Option key={"option-header-" + headerTypeIndex} onClick={(e) => onToggleBlockType(headerType.style)} selected={headerType.style === blockType}>
          {headerType.label}
        </Option>
      ))}
    </Select>
  );
}

const HEADER_TYPES = [
  { label: "H1", style: "header-one" },
  { label: "H2", style: "header-two" },
  { label: "H3", style: "header-three" },
  { label: "H4", style: "header-four" },
  { label: "H5", style: "header-five" },
  { label: "H6", style: "header-six" },
];
