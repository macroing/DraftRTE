import Button from "./Button";

export default function InlineStyleButtons(props) {
  const editorState = props.editorState;
  const onToggleInlineStyle = props.onToggleInlineStyle;
  const styleButton = props.styleButton;

  const currentInlineStyle = editorState.getCurrentInlineStyle();
  const selection = editorState.getSelection();

  return (
    <>
      {INLINE_STYLES.map((type, typeIndex) => (
        <Button active={currentInlineStyle.has(type.style)} disabled={selection.isCollapsed()} key={type.style} onClick={(e) => onToggleInlineStyle(type.style)} style={styleButton} type="button">
          {type.code}
        </Button>
      ))}
    </>
  );
}

const INLINE_STYLES = [
  { code: <span className="fas fa-bold"></span>, style: "BOLD" },
  { code: <span className="fas fa-italic"></span>, style: "ITALIC" },
  { code: <span className="fas fa-underline"></span>, style: "UNDERLINE" },
  { code: <span className="fas fa-strikethrough"></span>, style: "STRIKETHROUGH" },
  { code: <span style={{ fontFamily: "monospace" }}>MS</span>, style: "CODE" },
  { code: <span className="fas fa-subscript"></span>, style: "SUBSCRIPT" },
  { code: <span className="fas fa-superscript"></span>, style: "SUPERSCRIPT" },
];
