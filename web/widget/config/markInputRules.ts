import { MilkdownPlugin } from "@milkdown/ctx";
import {
  createCodeBlockInputRule,
  emphasisStarInputRule,
  emphasisUnderscoreInputRule,
  inlineCodeInputRule,
  insertHrInputRule,
  insertImageInputRule,
  strongInputRule,
  wrapInBlockquoteInputRule,
  wrapInBulletListInputRule,
  wrapInHeadingInputRule,
  wrapInOrderedListInputRule,
} from "@milkdown/kit/preset/commonmark";
import { wrapInTidalHeadingInputRule } from "../node/tidalHeading";
import { wrapInTidalDatetimeInputRule } from "../node/tidalDatetime";

export const inputRules: MilkdownPlugin[] = [
  wrapInBlockquoteInputRule,
  wrapInBulletListInputRule,
  wrapInOrderedListInputRule,
  createCodeBlockInputRule,
  insertHrInputRule,
  wrapInHeadingInputRule,
  insertImageInputRule,
].flat();

export const markInputRules: MilkdownPlugin[] = [
  emphasisStarInputRule,
  emphasisUnderscoreInputRule,
  inlineCodeInputRule,
  strongInputRule,
];

export const tidalInputRules: MilkdownPlugin[] = [
  wrapInBlockquoteInputRule,
  wrapInBulletListInputRule,
  wrapInOrderedListInputRule,
  createCodeBlockInputRule,
  insertHrInputRule,
  wrapInTidalHeadingInputRule,
  wrapInTidalDatetimeInputRule,
  insertImageInputRule,
].flat();
