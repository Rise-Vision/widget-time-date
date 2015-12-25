# Risevision Quiz widget

This widget will show the current time and date according to the time and date configured on the operating system it is used on.

## How to use

This app has a `dist` folder which contains final distribution files after the build. Copy the dist folder and deploy it over any static host and use the following files:

* `settings.html`: serves the settings page.
* `widget.html`: serves the widget page.

## building it yourself

First you need to install `npm` which comes along `node` js. Once you have these running, do the following:

#### Install bower components
This project uses `bower` to manage client side dependencies.

Make sure you have bower installed, if not use following command to install:
```
> npm install -g bower
```

Install bower deps, run this command in the project root directory:
```
> bower install
```

It will pull all dependencies and put it in `src/components` folder.

#### Do a gulp build
This project uses `gulp` to build the project to `dist` folder.

Make sure you have gulp installed, if not use following command to install:
```
> npm install -g gulp
```

Install gulp packages via npm, please run the following command in the project root:
```
> npm install
```

Do the gulp build in `prod` environment:
```
> NODE_ENV=prod gulp build
```

> whenever you build, build using NODE_ENV=prod gulp build to build it in prod env such that valid i18n files are picked.

All Done! the built code must be in the dist folder replacing old one there.

## Add app ID
If you need risevision store auth in the project, you can add the risevision store ID in the file `src/widget/quiz-widget.js` where `productId` is mentioned:

```javascript
quizWidget = {

  /**
   * Widget only config here
   * */
  config: {
    /**
     * Product Code for access to Store API
     * If null / false / undefined / Empty String then authorization will be ignored.
     * */
    productId: '' // <--- ADD HERE

  },

```

Once you add, rebuild the project again following the steps mentioned above.


