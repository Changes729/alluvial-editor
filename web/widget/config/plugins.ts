import type { MilkdownPlugin } from "@milkdown/ctx";

import {
  hardbreakClearMarkPlugin,
  hardbreakFilterNodes,
  hardbreakFilterPlugin,
  inlineNodesCursorPlugin,
  remarkAddOrderInListPlugin,
  remarkHtmlTransformer,
  remarkInlineLinkPlugin,
  remarkLineBreak,
  remarkMarker,
  remarkPreserveEmptyLinePlugin,
  syncHeadingIdPlugin,
  syncListOrderPlugin,
} from "@milkdown/preset-commonmark";

/// @internal
export const plugins: MilkdownPlugin[] = [
  hardbreakClearMarkPlugin,
  hardbreakFilterNodes,
  hardbreakFilterPlugin,

  inlineNodesCursorPlugin,

  remarkAddOrderInListPlugin,
  remarkInlineLinkPlugin,
  remarkLineBreak,
  remarkHtmlTransformer,
  remarkMarker,
  remarkPreserveEmptyLinePlugin,

  syncHeadingIdPlugin,
  syncListOrderPlugin,
].flat();


export const tidalPlugins: MilkdownPlugin[] = [
  hardbreakClearMarkPlugin,
  hardbreakFilterNodes,
  hardbreakFilterPlugin,

  inlineNodesCursorPlugin,

  remarkAddOrderInListPlugin,
  remarkInlineLinkPlugin,
  remarkLineBreak,
  remarkHtmlTransformer,
  remarkMarker,
  remarkPreserveEmptyLinePlugin,

  syncListOrderPlugin,
].flat();
