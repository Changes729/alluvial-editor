import type { Node } from "@milkdown/prose/model";

import { InputRule, textblockTypeInputRule } from "@milkdown/prose/inputrules";
import { $inputRule, $nodeAttr, $nodeSchema } from "@milkdown/utils";
import { withMeta } from "../../utils/meta";
import { serializeText } from "../../utils/serialize-text";
import { headingIdGenerator } from "@milkdown/preset-commonmark";
import { splitBlock } from "@milkdown/prose/commands";
import { schema } from "@milkdown/core";
import { paragraphSchema } from "./paragraph";
import { TextSelection } from "prosemirror-state";

/// HTML attributes for tidalDatetime node.
export const tidalDatetimeAttr = $nodeAttr("tidalDatetime");

withMeta(tidalDatetimeAttr, {
  displayName: "Attr<tidalDatetime>",
  group: "Datetime",
});

/// Schema for tidalDatetime node.
export const tidalDatetimeSchema = $nodeSchema("tidalDatetime", (ctx) => {
  const getId = ctx.get(headingIdGenerator.key);
  return {
    group: "block",
    selectable: true,
    draggable: false,
    marks: "",
    atom: true,
    defining: true,
    isolating: true,
    attrs: {
      date: {},
    },
    parseDOM: [
      {
        tag: "h1",
        // getAttrs: (node) => {
        //   return { date: new Date(node.innerText) };
        // },
      },
    ],
    toDOM: (node) => {
      return [`h1`, { ...ctx.get(tidalDatetimeAttr.key)(node) }, 0];
    },
    parseMarkdown: {
      match: ({ type }) => false,
      runner: (state, node, type) => {},
    },
    toMarkdown: {
      match: (node) => node.type.name === "tidalDatetime",
      runner: (state, node) => {
        state.next(node.content);
      },
    },
  };
});

withMeta(tidalDatetimeSchema.node, {
  displayName: "NodeSchema<tidalDatetime>",
  group: "Datetime",
});

withMeta(tidalDatetimeSchema.ctx, {
  displayName: "NodeSchemaCtx<tidalDatetime>",
  group: "Datetime",
});

/// This input rule can turn the selected block into tidalDatetime.
/// You can input numbers of `#` and a `space` to create tidalDatetime.
export const wrapInTidalDatetimeInputRule = $inputRule(
  (ctx) =>
    new InputRule(
      /^#\s(?<year>\d{4})\-(?<month>0?[1-9]|1[012])\-(?<day>0?[1-9]|[12][0-9]|3[01])[\s\n]$/,
      (state, match, start, end) => {
        const [matched, year, month, day] = match;
        if (matched) {
          return state.tr
            .replaceWith(
              start,
              end,
              tidalDatetimeSchema.type(ctx).create({
                date: new Date(Number(year), Number(month) - 1, Number(day)),
              })
            )
            .split(start + 1)
            .scrollIntoView();
        }

        return null;
      }
    )
);

withMeta(wrapInTidalDatetimeInputRule, {
  displayName: "InputRule<wrapInTidalDatetimeInputRule>",
  group: "Datetime",
});
