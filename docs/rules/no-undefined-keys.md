# All used i18n keys should be defined in json files (no-undefined-keys)

## Rule Details

Examples of **incorrect** code for this rule:

```js

// .json file with translations
{
    "foo": "bar"
}

// usage in code
const label = t('success');

```

Examples of **correct** code for this rule:

```js

// .json file with translations
{
    "foo": "bar",
    "home": {
        "header": {
            "title": "Home"
        }
    }
}

// usage in code
const label = t('foo');

const header = <div>{t('home.header.title')}</div>

```

## Options

You may provide an options array to the rule:
```json
{
    "rules": {
        "i18n-plus/no-undefined-keys": ["error", {
            "translations": ["src/i18n/resources/en.json"],
            "accessor": "o => o"
        }]
    },
}
```

### translations

String array.

Contains paths to the translations files.

*Example*:

```json
{
    "translations": ["src/i18n/resources/en.json", "src/i18n/resources/ru.json"]
}
```

### accessor

(jsonContent: object) => object.

A string representation of JS function that takes a full json content from `translations` option and returns translations object.

*Example*:

1. You may define your translation.json file just as an object `[i18n_key: string]: string | object` like
```json
{
    "title": "Home"
}
```
then the accessor function will look like
```json
{
    "accessor": "jsonContent => jsonContent"
}
```

`jsonContent => jsonContent` is a default value of the `accessor` option.

2. If your translations file has a different structure for some reason, for example
```json
{
    "translation": {
        "title": "Home"
    }
}
```
then the accessor function will be
```json
{
    "accessor": "jsonContent => jsonContent.translation"
}
```

<!--## When Not To Use It

Give a short description of when it would be appropriate to turn off this rule. -->
