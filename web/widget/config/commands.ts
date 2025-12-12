import type { MilkdownPlugin } from "@milkdown/ctx";

import {
  addBlockTypeCommand,
  clearTextInCurrentBlockCommand,
  isMarkSelectedCommand,
  isNodeSelectedCommand,
  selectTextNearPosCommand,
  setBlockTypeCommand,
  wrapInBlockTypeCommand,
  toggleEmphasisCommand,
  toggleInlineCodeCommand,
  toggleLinkCommand,
  toggleStrongCommand,
  updateLinkCommand,
  createCodeBlockCommand,
  downgradeHeadingCommand,
  insertHardbreakCommand,
  insertHrCommand,
  insertImageCommand,
  liftFirstListItemCommand,
  liftListItemCommand,
  sinkListItemCommand,
  splitListItemCommand,
  updateImageCommand,
  wrapInBlockquoteCommand,
  wrapInBulletListCommand,
  wrapInHeadingCommand,
  wrapInOrderedListCommand,
  turnIntoTextCommand,
} from "@milkdown/preset-commonmark";

/// @internal
export const commands: MilkdownPlugin[] = [
  turnIntoTextCommand,
  wrapInBlockquoteCommand,
  wrapInHeadingCommand,
  downgradeHeadingCommand,
  createCodeBlockCommand,
  insertHardbreakCommand,
  insertHrCommand,

  insertImageCommand,
  updateImageCommand,

  wrapInOrderedListCommand,
  wrapInBulletListCommand,
  sinkListItemCommand,
  splitListItemCommand,
  liftListItemCommand,
  liftFirstListItemCommand,

  toggleEmphasisCommand,
  toggleInlineCodeCommand,
  toggleStrongCommand,

  toggleLinkCommand,
  updateLinkCommand,

  isMarkSelectedCommand,
  isNodeSelectedCommand,

  clearTextInCurrentBlockCommand,
  setBlockTypeCommand,
  wrapInBlockTypeCommand,
  addBlockTypeCommand,
  selectTextNearPosCommand,
];

export const tidalCommands: MilkdownPlugin[] = [
  turnIntoTextCommand,
  wrapInBlockquoteCommand,
  downgradeHeadingCommand,
  createCodeBlockCommand,
  insertHardbreakCommand,
  insertHrCommand,

  insertImageCommand,
  updateImageCommand,

  wrapInOrderedListCommand,
  wrapInBulletListCommand,
  sinkListItemCommand,
  splitListItemCommand,
  liftListItemCommand,
  liftFirstListItemCommand,

  toggleEmphasisCommand,
  toggleInlineCodeCommand,
  toggleStrongCommand,

  toggleLinkCommand,
  updateLinkCommand,

  isMarkSelectedCommand,
  isNodeSelectedCommand,

  clearTextInCurrentBlockCommand,
  setBlockTypeCommand,
  wrapInBlockTypeCommand,
  addBlockTypeCommand,
  selectTextNearPosCommand,
];
