import { MilkdownPlugin } from "@milkdown/ctx";
import {
  emphasisStarInputRule,
  emphasisUnderscoreInputRule,
  inlineCodeInputRule,
  strongInputRule,
} from "@milkdown/kit/preset/commonmark";

export const markInputRules: MilkdownPlugin[] = [
  emphasisStarInputRule,
  emphasisUnderscoreInputRule,
  inlineCodeInputRule,
  strongInputRule,
];
