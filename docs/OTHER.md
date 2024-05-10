# other

A few other notes

## Page printing

Control what is printed by adding the appropriate class to the element:

- `.just-print` Displays only when printing
- `.no-print` It is not displayed when printing

## subassembly

directory `src/library/antd` Some common components have been extended based on Ant Design

When writing these components, keep the following points in mind:

- The generic component does not use CSS module, which is convenient for style override in the process of use;
- Unify the directory structure of each component to facilitate the generation of documents and demos;
- `src/pages/example/antd`、`src/menus-ant-design-example.js` Through scripts `src/library/antd/generator-demos.js` to generate;

## Webpack

### I used it alias {src:'/path/to/src'}

- It is convenient for path writing, and you don't have to care about the relative path structure
- Copy and paste to other files without having to modify the path

### Judgment operators are supported

```js
const name = res?.data?.user?.name || 'anonymity';
```

## ESLint illustrate

If the front-end project is not the git root, the error 'Not a git repository' will be reported when committing.

revise package.json，lint-staged The following is sufficient

```json
"lint-staged": {
"gitDir": "../",
"linters": {
"**/*.{js,jsx}": "lint-staged:js",
"**/*.less": "stylelint --syntax less"
}
},
```
