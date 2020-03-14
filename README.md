# eslint-plugin-i18n-plus

The plugin for validating i18n translations in react applications

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-i18n-plus`:

```
$ npm install eslint-plugin-i18n-plus --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-i18n-plus` globally.

## Usage

Add `i18n-plus` to the plugins section of your `.eslintrc` configuration file. You can omit the `eslint-plugin-` prefix:

```json
{
    "plugins": [
        "i18n-plus"
    ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
    "rules": {
        "i18n-plus/rule-name": 2
    }
}
```

## Supported Rules

* Fill in provided rules here





