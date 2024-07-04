/**
 * @type {import('stylelint').Config}
 */
export default {
  extends: ["stylelint-config-css-modules", "stylelint-config-recommended-scss"],
  rules: {
    "scss/at-rule-no-unknown": [true, { ignoreAtRules: ["tailwind", "apply", "variants", "responsive", "screen"] }],
    "at-rule-no-unknown": [true, { ignoreAtRules: ["tailwind", "apply", "variants", "responsive", "screen"] }],
    "no-descending-specificity": null,
    "selector-class-pattern": null,
  },
}
