# React Admin

Based on[React17.x](https://react.dev)、[Ant Design4.x](https://ant.design) management system architecture.

## Install dependencies

- node v12.14.0
- yarn 1.22.10

```bash
yarn
```

Set environment variables, which can be used on the Windows platform [cross-env](https://github.com/kentcdodds/cross-env#)

## Development initiated

If you are using it for the first time and want to quickly preview the effect, you can start it with a mock：`REACT_APP_MOCK=true yarn start`

```
# Start the development mode normally
yarn start 

# Custom ports
PORT=3001 yarn start

# HTTPS way to start
HTTPS=true yarn start

# Enable local mocks
REACT_APP_MOCK=true yarn start
```

## Development Agent & Test Agent

revise `src/setupProxyConfig.json`, there is a drop-down in the header in the upper right corner of the page, so you can quickly switch proxies.

```json
[
    {
        "name": "Tom",
        "disabled": false,
        "baseUrl": "/zhangsan",
        "target": "http://127.0.0.1:8080"
    },
    {
        "name": "Test environment",
        "baseUrl": "/api",
        "target": "http://127.0.0.1:8080"
    }
]
```

## Production builds

```
# Normal build
yarn build

# Build to the specified directory
BUILD_PATH=./dist yarn build

# Specify the configuration environment
REACT_APP_CONFIG_ENV=test yarn build

# Package size analysis
yarn build:analyzer

# Packing time analysis
yarn build:time
```

## style

- Support LESS and CSS
- sLess is used for CSS module processing under RC, and CSS is not processed for CSS module
- css module Apply styling
    ```jsx
    import styles from './style.module.less';
    
    <div className={styles.root}>
        <h1 className={styles.title}></h1>
    </div>
    ```
- added to the project[classnames](https://github.com/JedWatson/classnames) Extensions, which can be followed directly [classnames](https://github.com/JedWatson/classnames) The way is in class name Writing styles;
    ```jsx
        import styles from './style.module.less';
    
        const isActive = true;
  
        <div className={[styles.root, isActive && styles.active]}>
            <h1 className={styles.title}></h1>
        </div>
    ```
- Subject variable modification theme.less [antd Style variables](https://ant.design/docs/react/customize-theme)

## Code Specification

Code specification usage [prettier](https://prettier.io/) 

Team multi-person development, whether using WebStorm or vscode, uses prettier (configuration file :.prettierrc.js) for code formatting.

IDE formatting shortcuts can be configured as prettier

Git commits the code according to the prettier to ensure that the code submitted to the repository is within specification

