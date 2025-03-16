# oj-frontend

## 前端api代码生成
```shell
openapi --input http://localhost:9527/api/v2/api-docs --output ./generated --client axios  
或 
npx openapi --input http://localhost:9527/api/v2/api-docs --output ./generated --client axios
随后 -> generated -> core -> openapi.ts 修改你的base并将WITH_CREDENTIALS设置为true
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
