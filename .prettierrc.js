//Most of the rules here are default values that can be overridden according to personal habits
module.exports = {
    printWidth: 120, // The length of a single line
    tabWidth: 4, // Indent length
    useTabs: false, // Use spaces instead of tab indentation
    semi: true, // Use a semicolon at the end of the sentence
    singleQuote: true, // Use single quotes
    quoteProps: 'as-needed', // Add quotation marks to the object's key only when necessary
    jsxSingleQuote: false, // Single quotes are used in JSX
    trailingComma: 'all', // Whenever possible, print trailing commas when multiple lines
    bracketSpacing: false, // Add a space before and after the object -eg: { foo: bar }
    jsxBracketSameLine: false, // '>' fold placement of multi-attribute HTML tags
    arrowParens: 'always', // Use parentheses around the single-parameter arrow function argument -eg: (x) = > x
    requirePragma: false, // Formatting without a top comment
    insertPragma: false, // Add annotations to the top of files that have been formatted by prettier
    proseWrap: 'preserve', // I don't know how to translate
    htmlWhitespaceSensitivity: 'ignore', // Insensitive to HTML global whitespace
    vueIndentScriptAndStyle: false, // Do not indent script and style tags in vue
    endOfLine: 'lf', // End line form
    embeddedLanguageFormatting: 'auto', // Format the reference code
};
