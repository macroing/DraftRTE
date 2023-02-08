import BackgroundColorSelect from "./BackgroundColorSelect";
import BlockTypeButtons from "./BlockTypeButtons";
import ColorSelect from "./ColorSelect";
import FontFamilySelect from "./FontFamilySelect";
import FontSizeSelect from "./FontSizeSelect";
import GroupSeparator from "./GroupSeparator";
import HeaderSelect from "./HeaderSelect";
import InlineStyleButtons from "./InlineStyleButtons";
import MediaButtons from "./MediaButtons";
import PanelButtons from "./PanelButtons";
import RedoAndUndoButtons from "./RedoAndUndoButtons";
import TextAlignButtons from "./TextAlignButtons";

import importedStyles from "./Toolbar.module.css";

export default function Toolbar(props) {
  const editorState = props.editorState;
  const isGrouping = props.isGrouping;
  const onInsertAudio = props.onInsertAudio;
  const onInsertImage = props.onInsertImage;
  const onInsertLink = props.onInsertLink;
  const onInsertVideo = props.onInsertVideo;
  const onRedo = props.onRedo;
  const onToggleBackgroundColor = props.onToggleBackgroundColor;
  const onToggleBlockType = props.onToggleBlockType;
  const onToggleColor = props.onToggleColor;
  const onToggleFontFamily = props.onToggleFontFamily;
  const onToggleFontSize = props.onToggleFontSize;
  const onToggleInlineStyle = props.onToggleInlineStyle;
  const onTogglePanel = props.onTogglePanel;
  const onToggleTextAlign = props.onToggleTextAlign;
  const onUndo = props.onUndo;
  const setIsFocusing = props.setIsFocusing;
  const styleButton = props.styleButton;
  const styleSelect = props.styleSelect;
  const styles = props.styles || importedStyles;

  return (
    <div className={styles.toolbar}>
      <RedoAndUndoButtons editorState={editorState} onRedo={onRedo} onUndo={onUndo} styleButton={styleButton} />
      {isGrouping && <GroupSeparator />}
      <BlockTypeButtons editorState={editorState} onToggleBlockType={onToggleBlockType} styleButton={styleButton} />
      {isGrouping && <GroupSeparator />}
      <PanelButtons onTogglePanel={onTogglePanel} styleButton={styleButton} />
      {isGrouping && <GroupSeparator />}
      <InlineStyleButtons editorState={editorState} onToggleInlineStyle={onToggleInlineStyle} styleButton={styleButton} />
      {isGrouping && <GroupSeparator />}
      <TextAlignButtons editorState={editorState} onToggleTextAlign={onToggleTextAlign} styleButton={styleButton} />
      {isGrouping && <GroupSeparator />}
      <MediaButtons onInsertAudio={onInsertAudio} onInsertImage={onInsertImage} onInsertLink={onInsertLink} onInsertVideo={onInsertVideo} styleButton={styleButton} />
      {isGrouping && <GroupSeparator />}
      <HeaderSelect editorState={editorState} onToggleBlockType={onToggleBlockType} styleSelect={styleSelect} />
      {isGrouping && <GroupSeparator />}
      <BackgroundColorSelect editorState={editorState} onToggleBackgroundColor={onToggleBackgroundColor} styleSelect={styleSelect} />
      {isGrouping && <GroupSeparator />}
      <ColorSelect editorState={editorState} onToggleColor={onToggleColor} styleSelect={styleSelect} />
      {isGrouping && <GroupSeparator />}
      <FontFamilySelect editorState={editorState} onToggleFontFamily={onToggleFontFamily} styleSelect={styleSelect} />
      {isGrouping && <GroupSeparator />}
      <FontSizeSelect editorState={editorState} onToggleFontSize={onToggleFontSize} styleSelect={styleSelect} />
    </div>
  );
}
