import type { MilkdownPlugin } from "@milkdown/ctx";

import {
  blockquoteKeymap,
  bulletListKeymap,
  codeBlockKeymap,
  hardbreakKeymap,
  headingKeymap,
  listItemKeymap,
  orderedListKeymap,
  paragraphKeymap,
  emphasisKeymap,
  inlineCodeKeymap,
  strongKeymap,
} from "@milkdown/preset-commonmark";

/// @internal
export const keymap: MilkdownPlugin[] = [
  blockquoteKeymap,
  codeBlockKeymap,
  hardbreakKeymap,
  headingKeymap,
  listItemKeymap,
  orderedListKeymap,
  bulletListKeymap,
  paragraphKeymap,

  emphasisKeymap,
  inlineCodeKeymap,
  strongKeymap,
].flat();


export const tidalKeymap: MilkdownPlugin[] = [
  blockquoteKeymap,
  codeBlockKeymap,
  hardbreakKeymap,
  listItemKeymap,
  orderedListKeymap,
  bulletListKeymap,
  paragraphKeymap,

  emphasisKeymap,
  inlineCodeKeymap,
  strongKeymap,
].flat();
