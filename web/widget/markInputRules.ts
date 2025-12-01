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


export const inputRules: MilkdownPlugin[] = [
  wrapInBlockquoteInputRule,
  wrapInBulletListInputRule,
  wrapInOrderedListInputRule,
  createCodeBlockInputRule,
  insertHrInputRule,
  wrapInHeadingInputRule,
  insertImageInputRule,
].flat()

export const markInputRules: MilkdownPlugin[] = [
  emphasisStarInputRule,
  emphasisUnderscoreInputRule,
  inlineCodeInputRule,
  strongInputRule,
];
