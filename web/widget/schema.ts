import { MilkdownPlugin } from "@milkdown/ctx";
import {
  emphasisAttr,
  emphasisSchema,
  inlineCodeAttr,
  inlineCodeSchema,
  linkAttr,
  linkSchema,
  blockquoteAttr,
  blockquoteSchema,
  bulletListAttr,
  bulletListSchema,
  codeBlockAttr,
  codeBlockSchema,
  docSchema,
  hardbreakAttr,
  hardbreakSchema,
  headingAttr,
  headingIdGenerator,
  headingSchema,
  hrAttr,
  hrSchema,
  htmlAttr,
  htmlSchema,
  imageAttr,
  imageSchema,
  listItemAttr,
  listItemSchema,
  orderedListAttr,
  orderedListSchema,
  strongAttr,
  strongSchema,
  textSchema,
} from "@milkdown/kit/preset/commonmark";

import { paragraphAttr, paragraphSchema } from "./node/paragraph";
import { spanAttr, spanSchema } from "./node/span";

export const schema: MilkdownPlugin[] = [
  docSchema,

  paragraphAttr,
  paragraphSchema,

  spanAttr,
  spanSchema,

  headingIdGenerator,
  headingAttr,
  headingSchema,

  hardbreakAttr,
  hardbreakSchema,

  blockquoteAttr,
  blockquoteSchema,

  codeBlockAttr,
  codeBlockSchema,

  hrAttr,
  hrSchema,

  imageAttr,
  imageSchema,

  bulletListAttr,
  bulletListSchema,

  orderedListAttr,
  orderedListSchema,

  listItemAttr,
  listItemSchema,

  emphasisAttr,
  emphasisSchema,

  strongAttr,
  strongSchema,

  inlineCodeAttr,
  inlineCodeSchema,

  linkAttr,
  linkSchema,

  htmlAttr,
  htmlSchema,

  textSchema,
].flat();
