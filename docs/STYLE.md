# style
System use[less](http://lesscss.org/)Write the style.

## css modularization
In order to avoid multi-player co-op style conflicts, the system enables LESS files under SRC Css Module，CSS file is not used Css Module。

style.less
```less
.root{
    width: 100%;
    height: 100%;
}
```
Some.jsx
```jsx
import styles from '/path/to/style.less';

export default class Some extends React.Component {
    render() {
        return (
            <div className={styles.root}></div>            
        );
    }
}
```

## topic
Use less, which is achieved through style overrides.

### Write a topic
- Less files use subject-related variables;
- compose `/src/theme.less` Pass [less-loader](https://github.com/webpack-contrib/less-loader) `modifyVars` override variables in less;

### reference
- Ant Design topic
