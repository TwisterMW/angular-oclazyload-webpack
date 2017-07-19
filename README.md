# Angular + ocLazyLoad + Webpack (Component based paradigm approach)
This is an approachment of using Angular, ocLazyLoad and webpack for the development of a component based application with ES6.

## Requisites
This is a list of packages we'll use on development side:
```javascript
"devDependencies": {
    "webpack": "^3.1.0",
    "webpack-dev-server": "^2.5.1",
    "babel-core": "^6.25.0",
    "babel-loader": "^7.1.1",
    "babel-preset-es2015-webpack": "^6.4.3",
    "webpack-preset": "^0.2.0",
    "webpack-preset-babel": "^0.2.0",
    "webpack-preset-babel-stage-2": "^0.2.0",
    "cross-env": "^5.0.1",
    "raw-loader": "^0.5.1",
    "css-loader": "^0.28.4",
    "style-loader": "^0.18.2"
}
```

## Installing webpack and devDependencies
First of all we can start creating a package.json file by running ```$ npm init``` and we can just copy/paste the devDependencies above to the generated file. After that we can run ```$ npm i``` in order to install all devDependencies we need for working with webpack.

"webpack-dev-server" is a webpack package that allows us to mount a local server in order to display the development output.

"babel" is a compiler that transforms the lastest versions of Javascript code to supported version by browsers, and we'll use it for be able to write our code with ES6. 

"babel-loader" is the package that allows the transpilling of Javascript files using babel and webpack.

"babel-preset-es2015-webpack", "webpack-preset", "webpack-preset-babel-stage-2" are all webpack presets for running babel compilator.

"cross-env" is used for setting environment variables with NODE_ENV on windows (Most windows command prompts will choke when you set environment vars with NODE_ENV).

"raw-loader", "css-loader" and "style-loader" are all loaders for different kind of assets bundling of webpack.

## Installing the dependencies of the application
After installing devDependencies we need to install Angular, AngularUiRouter and ocLazyLoad, we can do it by running:

```$ npm i --save angular ocLazyLoad @uirouter/angularjs```

And then in our package.json we add theese scripts definition:

```javascript
"scripts": {
    "build": "cross-env NODE_ENV=production webpack --colors && cp index.html dist/index.html",
    "start": "cross-env NODE_ENV=production webpack-dev-server --progress --colors --content-base dist --watch"
}
```
Whith these scripts we've defined two npm tasks that we can run by ```$ npm run build``` or ```$ npm start```.

The build task will be used for bundling all vendor and development source in a single js file.
The start task will mount a local server watching for changes and pointing to 'dist' folder.

## Creating the main files
### index.html
We need to create our index.html file as entry point so we can start with a blank template like this:

```html
<!DOCTYPE html>
<html lang="es" ng-app="app" ng-cloak>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Angular + ocLazyLoad + Webpack approach</title>
    <base href="" />
</head>
<body>

    <!-- Script includings -->
    <script src="js/vendor.bundle.js"></script>
    <script src="js/bundle.js"></script>
</body>
</html>
```
_Note that we have included separated js files "vendor" and "bundle" in order to keep separated our development of the third party dependencies._

### webpack.config.js
In order to run webpack we need to set its configuration by writting a webpack.config.js file:
```javascript
const webpack = require('webpack');

var config = {
    entry: {
        app: __dirname + '/app/index.js',
        vendor: ['angular', '@uirouter/angularjs', 'oclazyload/dist/ocLazyLoad' ]
    },

    output: {
        path: __dirname + '/app',
        filename: 'js/bundle.js'
    },

    plugins: [ new webpack.optimize.CommonsChunkPlugin({ name: "vendor", filename: "js/vendor.bundle.js" }) ],

    module: {
        loaders: [
            { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
            { test: /\.html$/, loader: 'raw-loader', exclude: /node_modules/ },
            { test: /\.css$/,
                use: [
                    { loader: 'style-loader' }, 
                    { loader: 'css-loader', options: { minimize: true } }
                ]
            },
        ]
    }

};

if(process.env.NODE_ENV === 'production'){
    config.output.path = __dirname + '/dist';
}

module.exports = config;
```

In this case we are supposing this file structure:


    -app
        -common
            -services
            -directives
            -...
        -components
            -c1
            -c2
            -...
            -c(n)
        -index.js
    -index.html

### index.js
At last we need to define our entry point file 'index.js':
```javascript
import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload/dist/ocLazyLoad';

const ngModule = angular.module('app', [
    'ui.router',
    'oc.lazyLoad'
]);
```

With all this done we are ready to start defining our application components to be lazy loaded.

## Our first component: A calendar
First of all we create a folder named 'calendar' in our 'components folder and we create following files inside of it:
-components
    -calendar
        -index.js
        -module.js
        -calendar.css
        -calendarController.js
        -calendar-tpl.html

### index.js
This file is the entry point of the module and on where we define it and export it.
```javascript
    import './calendar.css';
    import calendarController from './calendar/calendarController';

    const calendarModule = angular.module('calendarModule', []);

    calendarController(calendarModule);

    export default calendarModule;
```

### module.js
In this file I like to define the $state associated with the module instead of defining at the angular.config() because it makes more modular if we keep the state definitions together with the component assets. So we can define the calendarState:

```javascript
let calendarState = {
    url: '/calendar'
    controller: 'calendarController',
    controllerAs: 'vm',
    templateProvider: ['$q', ($q) => {
        return $q((resolve) => {
            require.ensure([], () => {
                var template = require('./calendar-tpl.html');
                
                resolve(template);
            });
        });
    }],
    resolve: {
        calendarComponent: ['$q', '$ocLazyLoad', ($q, $ocLazyLoad) => {
            return $q((resolve) => {
                require.ensure([], () => {
                    let mod = require('./');
                    $ocLazyLoad.load({ name: mod.default.name });
                    resolve(mod.default);
                });
            });
        }]
    }
};

export default calendarState;
```
### calendarController.js
We need to create our controller for the component:
```javascript
let calendarController = function(){
    var vm = this;

    // Declaration
    vm.init = init;

    // Definition
    function init(){

    }

    // Initialization
    vm.init();
}

export default ngModule => {
    ngModule.controller('calendarController', calendarController);
}
```

Then we need to do a little "magic" in our app/index.js file (entry point of webpack) and it should look like this after all:

```javascript
import angular from 'angular';
import '@uirouter/angularjs';
import 'oclazyload/dist/ocLazyLoad';
import calendarState from './components/calendar/module.js';

const ngModule = angular.module('app', [
    'ui.router',
    'oc.lazyLoad'
]);

function config($stateProvider, $urlRouterProvider, $locationProvider){
    $stateProvider.state('calendar', calendarState);
    ...

    $urlRouterProvider.otherwise('/');
}

ngModule.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', config]);
```

## Conclusion
With these few steps we can set up our component based application with Angular, ocLazyLoad and Webpack using ES6 definitions and compiling it with Babel.

You can download the demo application and check it on _src_ folder.

Approach by M. [Hernández](http://www.mhernav.com)