import { DefaultDraftBlockRenderMap, EditorState, Modifier, RichUtils } from "draft-js";
import Immutable from "immutable";

export default class RichTextEditorUtils {
  constructor() {}

  static getBlockRenderMap() {
    return DefaultDraftBlockRenderMap.merge(
      Immutable.Map({
        panel: {
          element: "div",
          wrapper: <Panel />,
        },
      })
    );
  }

  static getBlockStyle(block) {
    switch (block.getType()) {
      case BLOCKQUOTE:
        return RichTextEditorUtils.getTextAlign(block) + " " + BLOCKQUOTE;
      default:
        return RichTextEditorUtils.getTextAlign(block);
    }
  }

  static getStyleMap() {
    return {
      CODE: {
        backgroundColor: "rgba(0, 0, 0, 0.05)",
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 2,
      },
      PANEL: {
        backgroundColor: "#e3e3e3",
        border: "1px solid #b3b3b3",
        display: "inline-block",
        padding: "10px",
      },
      STRIKETHROUGH: {
        textDecoration: "line-through",
      },
      SUBSCRIPT: {
        fontSize: "80%",
        verticalAlign: "sub",
      },
      SUPERSCRIPT: {
        fontSize: "80%",
        verticalAlign: "super",
      },
      ...BACKGROUND_COLOR_STYLE_MAP,
      ...COLOR_STYLE_MAP,
      ...FONT_FAMILY_STYLE_MAP,
      ...FONT_SIZE_STYLE_MAP,
    };
  }

  static getTextAlign(block) {
    let textAlign = TEXT_ALIGN_LEFT;

    block.findStyleRanges((e) => {
      if (e.hasStyle(TEXT_ALIGN_CENTER)) {
        textAlign = TEXT_ALIGN_CENTER;
      }

      if (e.hasStyle(TEXT_ALIGN_JUSTIFY)) {
        textAlign = TEXT_ALIGN_JUSTIFY;
      }

      if (e.hasStyle(TEXT_ALIGN_LEFT)) {
        textAlign = TEXT_ALIGN_LEFT;
      }

      if (e.hasStyle(TEXT_ALIGN_RIGHT)) {
        textAlign = TEXT_ALIGN_RIGHT;
      }
    });

    return textAlign;
  }

  static hasBlockStyle(block, style) {
    let hasStyle = false;

    block.findStyleRanges((e) => {
      if (e.hasStyle(style)) {
        hasStyle = true;
      }
    });

    return hasStyle;
  }

  static isHidingPlaceholder(editorState) {
    const currentContent = editorState.getCurrentContent();

    const hasText = currentContent.hasText();

    const isUnstyled = currentContent.getBlockMap().first().getType() !== UNSTYLED;

    return !hasText && isUnstyled;
  }

  static toggleBackgroundColor(editorState, backgroundColor) {
    return RichTextEditorUtils.toggleInlineStyle(editorState, backgroundColor, BACKGROUND_COLOR_STYLE_MAP);
  }

  static toggleColor(editorState, color) {
    return RichTextEditorUtils.toggleInlineStyle(editorState, color, COLOR_STYLE_MAP);
  }

  static toggleFontFamily(editorState, fontFamily) {
    return RichTextEditorUtils.toggleInlineStyle(editorState, fontFamily, FONT_FAMILY_STYLE_MAP);
  }

  static toggleFontSize(editorState, fontSize) {
    return RichTextEditorUtils.toggleInlineStyle(editorState, fontSize, FONT_SIZE_STYLE_MAP);
  }

  static toggleInlineStyle(editorState, inlineStyle, styleMap) {
    const currentContent = editorState.getCurrentContent();
    const currentInlineStyle = editorState.getCurrentInlineStyle();

    const selection = editorState.getSelection();

    const contentState = Object.keys(styleMap).reduce((contentState, inlineStyle) => Modifier.removeInlineStyle(contentState, selection, inlineStyle), currentContent);

    const editorStateA = EditorState.push(editorState, contentState, CHANGE_INLINE_STYLE);
    const editorStateB = selection.isCollapsed() ? currentInlineStyle.reduce((state, inlineStyle) => RichUtils.toggleInlineStyle(state, inlineStyle), editorStateA) : editorStateA;
    const editorStateC = currentInlineStyle.has(inlineStyle) ? editorStateB : RichUtils.toggleInlineStyle(editorStateB, inlineStyle);

    return editorStateC;
  }

  static toggleLink(editorState, url) {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity("LINK", "MUTABLE", { url });

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    const editorStateA = EditorState.set(editorState, { currentContent: contentStateWithEntity });
    const editorStateB = RichUtils.toggleLink(editorStateA, editorStateA.getSelection(), entityKey);

    return editorStateB;
  }

  static togglePanel(editorState) {
    const selection = editorState.getSelection();
    const anchorKey = selection.getAnchorKey();
    const focusKey = selection.getFocusKey();

    if (selection.isCollapsed() || anchorKey !== focusKey) {
      return RichUtils.toggleBlockType(editorState, "panel");
    }

    return RichUtils.toggleInlineStyle(editorState, "PANEL");
  }

  static toggleSubscript(editorState) {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity("SUBSCRIPT", "MUTABLE", {});

    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

    const editorStateA = EditorState.set(editorState, { currentContent: contentStateWithEntity });
    const editorStateB = EditorState.push(editorStateA, Modifier.applyEntity(editorStateA.getCurrentContent(), editorStateA.getSelection(), entityKey), "apply-entity");

    return editorStateB;
  }

  static toggleTextAlign(editorState, textAlign) {
    const currentContent = editorState.getCurrentContent();

    const selection = editorState.getSelection();

    const blockForFocusKey = currentContent.getBlockForKey(selection.getFocusKey());
    const blockForAnchorKey = currentContent.getBlockForKey(selection.getAnchorKey());

    const hasTextAlign = RichTextEditorUtils.hasBlockStyle(blockForFocusKey, textAlign) || RichTextEditorUtils.hasBlockStyle(blockForAnchorKey, textAlign);

    const finalSelection = selection.merge({ anchorOffset: selection.getIsBackward() ? blockForAnchorKey.getLength() : 0, focusOffset: blockForFocusKey.getLength() });

    const textAligns = TEXT_ALIGNS;
    const textAlignsToRemove = hasTextAlign ? textAligns : textAligns.filter((currentTextAlign) => currentTextAlign !== textAlign);

    const contentStateA = textAlignsToRemove.reduce((content, currentTextAlignToRemove) => Modifier.removeInlineStyle(content, finalSelection, currentTextAlignToRemove), currentContent);
    const contentStateB = hasTextAlign ? contentStateA : Modifier.applyInlineStyle(contentStateA, finalSelection, textAlign);

    const newEditorState = EditorState.push(editorState, contentStateB, CHANGE_INLINE_STYLE);

    return newEditorState;
  }
}

function Panel(props) {
  return <div style={{ backgroundColor: "#e3e3e3", border: "1px solid #b3b3b3", padding: "10px" }}>{props.children}</div>;
}

export const BACKGROUND_COLOR_STYLE_MAP = {
  BACKGROUND_COLOR_ALICE_BLUE: {
    backgroundColor: "AliceBlue",
  },
  BACKGROUND_COLOR_ANTIQUE_WHITE: {
    backgroundColor: "AntiqueWhite",
  },
  BACKGROUND_COLOR_AQUA: {
    backgroundColor: "Aqua",
  },
  BACKGROUND_COLOR_AQUAMARINE: {
    backgroundColor: "Aquamarine",
  },
  BACKGROUND_COLOR_AZURE: {
    backgroundColor: "Azure",
  },
  BACKGROUND_COLOR_BEIGE: {
    backgroundColor: "Beige",
  },
  BACKGROUND_COLOR_BISQUE: {
    backgroundColor: "Bisque",
  },
  BACKGROUND_COLOR_BLACK: {
    backgroundColor: "Black",
  },
  BACKGROUND_COLOR_BLANCHED_ALMOND: {
    backgroundColor: "BlanchedAlmond",
  },
  BACKGROUND_COLOR_BLUE: {
    backgroundColor: "Blue",
  },
  BACKGROUND_COLOR_BLUE_VIOLET: {
    backgroundColor: "BlueViolet",
  },
  BACKGROUND_COLOR_BROWN: {
    backgroundColor: "Brown",
  },
  BACKGROUND_COLOR_BURLY_WOOD: {
    backgroundColor: "BurlyWood",
  },
  BACKGROUND_COLOR_CADET_BLUE: {
    backgroundColor: "CadetBlue",
  },
  BACKGROUND_COLOR_CHARTREUSE: {
    backgroundColor: "Chartreuse",
  },
  BACKGROUND_COLOR_CYAN: {
    backgroundColor: "Cyan",
  },
  BACKGROUND_COLOR_GREEN: {
    backgroundColor: "Green",
  },
  BACKGROUND_COLOR_INDIGO: {
    backgroundColor: "Indigo",
  },
  BACKGROUND_COLOR_MAGENTA: {
    backgroundColor: "Magenta",
  },
  BACKGROUND_COLOR_ORANGE: {
    backgroundColor: "Orange",
  },
  BACKGROUND_COLOR_RED: {
    backgroundColor: "Red",
  },
  BACKGROUND_COLOR_VIOLET: {
    backgroundColor: "Violet",
  },
  BACKGROUND_COLOR_WHITE: {
    backgroundColor: "White",
  },
  BACKGROUND_COLOR_YELLOW: {
    backgroundColor: "Yellow",
  },
};

export const COLOR_STYLE_MAP = {
  COLOR_ALICE_BLUE: {
    color: "AliceBlue",
  },
  COLOR_ANTIQUE_WHITE: {
    color: "AntiqueWhite",
  },
  COLOR_AQUA: {
    color: "Aqua",
  },
  COLOR_AQUAMARINE: {
    color: "Aquamarine",
  },
  COLOR_AZURE: {
    color: "Azure",
  },
  COLOR_BEIGE: {
    color: "Beige",
  },
  COLOR_BISQUE: {
    color: "Bisque",
  },
  COLOR_BLACK: {
    color: "Black",
  },
  COLOR_BLANCHED_ALMOND: {
    color: "BlanchedAlmond",
  },
  COLOR_BLUE: {
    color: "Blue",
  },
  COLOR_BLUE_VIOLET: {
    color: "BlueViolet",
  },
  COLOR_BROWN: {
    color: "Brown",
  },
  COLOR_BURLY_WOOD: {
    color: "BurlyWood",
  },
  COLOR_CADET_BLUE: {
    color: "CadetBlue",
  },
  COLOR_CHARTREUSE: {
    color: "Chartreuse",
  },
  COLOR_CYAN: {
    color: "Cyan",
  },
  COLOR_GREEN: {
    color: "Green",
  },
  COLOR_INDIGO: {
    color: "Indigo",
  },
  COLOR_MAGENTA: {
    color: "Magenta",
  },
  COLOR_ORANGE: {
    color: "Orange",
  },
  COLOR_RED: {
    color: "Red",
  },
  COLOR_VIOLET: {
    color: "Violet",
  },
  COLOR_WHITE: {
    color: "White",
  },
  COLOR_YELLOW: {
    color: "Yellow",
  },
};

export const FONT_FAMILY_STYLE_MAP = {
  FONT_FAMILY_ARIAL: {
    fontFamily: "Arial",
  },
  FONT_FAMILY_BRUSH_SCRIPT_M_T: {
    fontFamily: "Brush Script MT",
  },
  FONT_FAMILY_COURIER_NEW: {
    fontFamily: "Courier New",
  },
  FONT_FAMILY_GARAMOND: {
    fontFamily: "Garamond",
  },
  FONT_FAMILY_GEORGIA: {
    fontFamily: "Georgia",
  },
  FONT_FAMILY_HELVETICA: {
    fontFamily: "Helvetica",
  },
  FONT_FAMILY_TAHOMA: {
    fontFamily: "Tahoma",
  },
  FONT_FAMILY_TIMES_NEW_ROMAN: {
    fontFamily: "Times New Roman",
  },
  FONT_FAMILY_TREBUCHET_M_S: {
    fontFamily: "Trebuchet MS",
  },
  FONT_FAMILY_VERDANA: {
    fontFamily: "Verdana",
  },
};

export const FONT_SIZE_STYLE_MAP = {
  FONT_SIZE_10: {
    fontSize: "10px",
  },
  FONT_SIZE_12: {
    fontSize: "12px",
  },
  FONT_SIZE_14: {
    fontSize: "14px",
  },
  FONT_SIZE_16: {
    fontSize: "16px",
  },
  FONT_SIZE_18: {
    fontSize: "18px",
  },
  FONT_SIZE_20: {
    fontSize: "20px",
  },
  FONT_SIZE_22: {
    fontSize: "22px",
  },
  FONT_SIZE_24: {
    fontSize: "24px",
  },
  FONT_SIZE_26: {
    fontSize: "26px",
  },
  FONT_SIZE_28: {
    fontSize: "28px",
  },
  FONT_SIZE_30: {
    fontSize: "30px",
  },
  FONT_SIZE_32: {
    fontSize: "32px",
  },
  FONT_SIZE_34: {
    fontSize: "34px",
  },
  FONT_SIZE_36: {
    fontSize: "36px",
  },
  FONT_SIZE_38: {
    fontSize: "38px",
  },
  FONT_SIZE_40: {
    fontSize: "40px",
  },
};

const BLOCKQUOTE = "blockquote";

const CHANGE_INLINE_STYLE = "change-inline-style";

const TEXT_ALIGN_CENTER = "center";
const TEXT_ALIGN_JUSTIFY = "justify";
const TEXT_ALIGN_LEFT = "left";
const TEXT_ALIGN_RIGHT = "right";
const TEXT_ALIGNS = [TEXT_ALIGN_LEFT, TEXT_ALIGN_CENTER, TEXT_ALIGN_RIGHT, TEXT_ALIGN_JUSTIFY];

const UNSTYLED = "unstyled";
