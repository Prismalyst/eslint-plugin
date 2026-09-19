import { RULES_MAP } from '../rules.map.js';

export function isRuleName(name: string): name is keyof typeof RULES_MAP {
  return Object.hasOwn(RULES_MAP, name);
}
