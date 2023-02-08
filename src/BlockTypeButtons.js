import Button from "./Button";

export default function BlockTypeButtons(props) {
  const editorState = props.editorState;
  const onToggleBlockType = props.onToggleBlockType;
  const styleButton = props.styleButton;

  const selection = editorState.getSelection();
  const blockType = editorState.getCurrentContent().getBlockForKey(selection.getStartKey()).getType();

  return (
    <>
      {BLOCK_TYPES.map((type, typeIndex) => (
        <Button active={type.style === blockType} disabled={!selection.isCollapsed()} key={type.style} onClick={(e) => onToggleBlockType(type.style)} style={styleButton} type="button">
          {type.code}
        </Button>
      ))}
    </>
  );
}

const BLOCK_TYPES = [
  { code: <span className="fa fa-quote-left"></span>, style: "blockquote" },
  { code: <span className="fas fa-list-ul"></span>, style: "unordered-list-item" },
  { code: <span className="fas fa-list-ol"></span>, style: "ordered-list-item" },
  { code: <span className="fa fa-code"></span>, style: "code-block" },
];
