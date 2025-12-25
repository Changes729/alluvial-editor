import type { Node } from "@milkdown/prose/model";

import { editorViewCtx } from "@milkdown/core";
import { textblockTypeInputRule } from "@milkdown/prose/inputrules";
import { $inputRule, $nodeAttr, $nodeSchema } from "@milkdown/utils";
import { withMeta } from "../../utils/meta";
import { serializeText } from "../../utils/serialize-text";
import { headingIdGenerator } from "@milkdown/preset-commonmark";

const tidalHeadingIndex = Array(6)
  .fill(0)
  .map((_, i) => i + 1);

/// HTML attributes for tidalHeading node.
export const tidalHeadingAttr = $nodeAttr("tidalHeading");

withMeta(tidalHeadingAttr, {
  displayName: "Attr<tidalHeading>",
  group: "Heading",
});

/// Schema for tidalHeading node.
export const tidalHeadingSchema = $nodeSchema("tidalHeading", (ctx) => {
  const getId = ctx.get(headingIdGenerator.key);
  return {
    content: "inline*",
    group: "block",
    defining: true,
    attrs: {
      id: {
        default: "",
        validate: "string",
      },
      level: {
        default: 1,
        validate: "number",
      },
    },
    parseDOM: tidalHeadingIndex.map((x) => ({
      tag: `h${x}`,
      getAttrs: (node) => {
        return { level: x - 1, id: node.id };
      },
    })),
    toDOM: (node) => {
      return [
        `h${node.attrs.level + 1}`,
        {
          ...ctx.get(tidalHeadingAttr.key)(node),
          id: node.attrs.id || getId(node),
        },
        0,
      ];
    },
    parseMarkdown: {
      match: ({ type }) => type === "heading",
      runner: (state, node, type) => {
        const depth = node.depth as number;
        state.openNode(type, { level: depth });
        state.next(node.children);
        state.closeNode();
      },
    },
    toMarkdown: {
      match: (node) => node.type.name === "tidalHeading",
      runner: (state, node) => {
        state.openNode("heading", undefined, { depth: node.attrs.level });
        serializeText(state, node);
        state.closeNode();
      },
    },
  };
});

withMeta(tidalHeadingSchema.node, {
  displayName: "NodeSchema<tidalHeading>",
  group: "Heading",
});

withMeta(tidalHeadingSchema.ctx, {
  displayName: "NodeSchemaCtx<tidalHeading>",
  group: "Heading",
});

/// This input rule can turn the selected block into tidalHeading.
/// You can input numbers of `#` and a `space` to create tidalHeading.
export const wrapInTidalHeadingInputRule = $inputRule((ctx) => {
  return textblockTypeInputRule(
    /^(?<hashes>##+)\s$/,
    tidalHeadingSchema.type(ctx),
    (match) => {
      const x = match.groups?.hashes?.length || 0;
      return { level: x };
    }
  );
});

withMeta(wrapInTidalHeadingInputRule, {
  displayName: "InputRule<wrapInTidalHeadingInputRule>",
  group: "Heading",
});
