# Get started quickly

Use the commands described below to perform a development or production build.

## environment

- [yarn](https://yarnpkg.com) v1.22.10
- [node](https://nodejs.org) v12.14.0

## Install dependencies

```bash
$ cd ant-react-admin
$ yarn
```
## Development initiated

```bash
$ cd ant-react-admin
$ yarn start

# Specify the port
$ PORT=8080 yarn start

# Start in HTTPS mode
$ HTTPS=true yarn start
```

Note: The startup will be a little slow, wait patiently for a while, the browser will automatically open after the startup is successful. It can be used in Windows environment [cross-env](https://www.npmjs.com/package/cross-env) Set command-line variables.

## Production builds

```bash
$ cd ant-react-admin

$ yarn build

# Build input to the specified directory
$ BUILD_PATH=../dist yarn build
```

Note: The files generated by the default build are in `/ant-react-admin/build` directory;[Nginx configuration reference](NGINX.md)。

## Domain name subdirectory publishing project

If the project needs to be mounted to a subdirectory of the domain name, for example: `http://xxx.com/ant-react-admin`.Add command-line arguments REACT_APP_BASE_NAME=/ant-react-admin

Note: If the front-end has completed the static page, put it in the ant react admin directory of the nginx static directory, and add command line parameters PUBLIC_URL=/ant-react-admin;


