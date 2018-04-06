---
    url: https://developers.google.com/web/fundamentals/performance/webpack/decrease-frontend-size
---


`code-splitting` scripts into critical and non-critical pieces and stripping out unused code (to name but a few optimizations) can ensure your app has a minimal network and processing cost.



#### 减少体积

- 压缩文件大小，利用插件 UglifyJsPlugin
webpack 4 'production'环境下自动启动 Uglify JS minifier

```
mode: 'production',
optimization: {
    nodeEnv: 'production',
    minimize: true
}
...


```

- 使用 ES Modules
当使用 ES modules 时，webpack可以使用 `tree-shaking`.
`tree-shaking` 只打包用到的代码。

    > In webpack, tree-shaking doesn’t work without a minifier. Webpack just removes export statements for exports that aren’t used; it’s the minifier that removes unused code. Therefore, if you compile the bundle without the minifier, it won’t get smaller. 

#### 优化图片

图片虽然不是关键路径，但是仍然占用了很大一部分的带宽。在 `webpack` 中可以用 
`url-loader`, `svg-url-loader` and `image-webpack-loader` 去优化它们。

`url-loader` 可以把小的静态图片转化为 Base64 数据 url,直接放到应用里面。 
用 `limit`限制字节的大小。

```
module.exports = {
  module: {
    rules: [
      {
        test: /\.(jpe?g|png|gif)$/,
        loader: 'url-loader',
        options: {
          // Inline files smaller than 10 kB (10240 bytes)
          limit: 10 * 1024,
        },
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'image-webpack-loader',
        // This will apply the loader before the other ones
        enforce: 'pre',
      }
    ],
  }
};

```

#### 优化依赖（dependencies）

Javascript 文件的大小有平均有一半是来自依赖。

    - 利用 `babel-plugin-lodash` 删除没有用的方法
        ```
        // .babelrc
        {
            "plugins": [
                ["lodash", {
                    "id": ["async-es"]
                }]
            ]
        }
        ```

    - 利用 `babel-preset-env` 删除不必要的 polyfills
    ```
    // .babelrc
    {
        "presets": [
            "env", {
                "targets": {
                    "browsers": ["last 2 versions", "ie >= 11"]
                }
            }
        ]
    }
    ```
    - 将未转码的代码发送至现代浏览器
    > // https://philipwalton.com/articles/deploying-es2015-code-in-production-today/

    1、 使用插件 `babel-pareset-env`
    2、 <script type="module"> </script>
    3、 配置 webpack rules
        ```
        use: {
            loader: 'babel-loader',
            options: {
            presets: [
                ['env', {
                modules: false,
                useBuiltIns: true,
                targets: {
                    browsers: [
                    'Chrome >= 60',
                    'Safari >= 10.1',
                    'iOS >= 10.3',
                    'Firefox >= 54',
                    'Edge >= 15',
                    ],
                },
                }],
            ],
            },
        }

        // 结果会输出两个文件
        // main.js (the syntax will be ES2015+)
        // main-legacy.js (the syntax will be ES5)
        ```

    - 利用 `moment-locales-webpack-plugin`删除 `moment` 中没有用到的区域设置
    - 利用 `babel-plugin-transform-react-remove-prop-types` 移除 `propTypes`声明
    - 利用 `babel-plugin-transform-imports` 移除没有用到的 模块
        ```
        // .babelrc
        {
            "plugins": [
                ["transform-imports", {
                    "react-router": {
                        transform: "react-router/${member}",
                        "preventFullImport": true
                    }
                }]
            ]
        }
        ```
    
    - babel-plugin-syntax-dynamic-import 动态引入资源
、、

#### 启动ES模块的模块连接

以前，build后的js文件会把 Commjs / AMD 相互隔离，这样会增加文件的大小

```
// index.js
import {render} from './comments.js';
render();

// comments.js
export function render(data, target) {
  console.log('Rendered!');
}
```
打包后的js文件

```
// bundle.js (part  of)
/* 0 */
(function(module, __webpack_exports__, __webpack_require__) {

  "use strict";
  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  var __WEBPACK_IMPORTED_MODULE_0__comments_js__ = __webpack_require__(1);
  Object(__WEBPACK_IMPORTED_MODULE_0__comments_js__["a" /* render */])();

}),
/* 1 */
(function(module, __webpack_exports__, __webpack_require__) {

  "use strict";
  __webpack_exports__["a"] = render;
  function render(data, target) {
    console.log('Rendered!');
  }

})
```
启动 ES模块的模块连接功能后, code 如下：

```
// Unlike the previous snippet, this bundle has only one module
// which includes the code from both files

// bundle.js (part of; compiled with ModuleConcatenationPlugin)
/* 0 */
(function(module, __webpack_exports__, __webpack_require__) {

  "use strict";
  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

  // CONCATENATED MODULE: ./comments.js
  function render(data, target) {
    console.log('Rendered!');
  }

  // CONCATENATED MODULE: ./index.js
  render();

})
```

webpack4 自动启用ES模块的模块连接功能。

```
// webpack4

module.exports = {
    optimization: {
        concatenateModules: true,
    }
}

```

webpack 3 利用插件 `ModuleConcatenationPlugin`

```
module.exports = {
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin()
    ]
}
```

#### 假如webpack 和 no-webpack code都有，请使用 `externals`

```
module.exports = {
    externals: {
        'react': 'React',
        'react-dom': 'ReactDOM'
    }
}
```