[![Build Status](https://travis-ci.org/uneco/stencil-site-i18n.svg?branch=master)](https://travis-ci.org/uneco/stencil-site-i18n)

# Stencil Open Translation Project

## Sites and Translators

| Language | Document                                           | Translator                                                     | Owner                             |
| -------- | -------------------------------------------------- | -------------------------------------------------------------- | --------------------------------- |
| Japanese | [stencil-site-ja](https://stencil-site-ja.web.app) | [stencil-translator-ja](https://stencil-translator-ja.web.app) | [uneco](https://github.com/uneco) |

## How to deployment your site/translator

1. Prepare two Firebase projects
   1. "Site" project (No settings required)
   2. "Translator" project
      1. Enable firestore
      2. Deploy functions and firestore's rules using [uneco/translatable-remote](https://github.com/uneco/translatable-remote)
      3. Enable *Github* as the sign-in provider for auth and enter client id and secret for Github oauth app.
2. Clone this repository.
3. Prepare all [configurations](#configuration-examples) for your language.
4. Write `docs/structure-{LANG}.yml` and `docs/translation-{LANG}.md` for your language. (PRs welcome)
5. run `firebase login:ci` to get Firebase deployment token.
6. Create `deploy.env` and put your `FIREBASE_TOKEN` for deployment, and `GITHUB_TOKEN` for fetch contributors.

```
FIREBASE_TOKEN=1/a0a0aF0FaaaFaa0aFaFaaaa00FaFaF0F0aaaFFFFaF0
GITHUB_TOKEN=a00000a000a0000a00a000aa0a00000a0a00aaa0
```

6. Run `docker-compose run deploy`

## Configuration Examples

`config/docs.firebaserc`

```json5
{
  "projects": {
    // Firebase Project ID for documents
    "default": "stencil-site-en"
  }
}
```

`config/docs.config.ts`

```ts
export default {
  // Language code
  lang: 'en',
  // Title for translated document
  title: 'English Document',
  words: {
    // Section title for translated about page
    'translation': 'Translation',
    // Page title for translated about page
    'about-translation': 'About translation',
  },
  translatable: {
    // Base URL for translatable-remote's Cloud Functions API
    base: 'https://us-east1-stencil-translator-xx.cloudfunctions.net',
  },
}
```

`config/translator.firebaserc`
```json5
{
  "projects": {
    // Firebase Project ID for translator
    "default": "stencil-translator-en"
  }
}
```

`config/translator.config.ts`

```ts
export default {
  // Title for the translator page
  title: 'Stencil Documents Translator (English)',
  // URL for the translatable Web Components
  translatableScriptBase: 'https://unpkg.com/translatable@latest/dist/translatable',
}
```

`config/init.json`

(Retrieved from translator firebase project)

```json
{
  "apiKey": "FFaaFaFFFaF0FaFFFF0_aa0aaaaFaFaaFaaaaFa",
  "appId": "0:000000000000:aaa:a00aa000aa0aa000",
  "databaseURL": "https://stencil-translator-en.firebaseio.com",
  "storageBucket": "stencil-translator-en.appspot.com",
  "authDomain": "stencil-translator-en.firebaseapp.com",
  "messagingSenderId": "000000000000",
  "projectId": "stencil-translator-en"
}
```

## Related Repositories

- [uneco/translatable](https://github.com/uneco/translatable) &mdash; Web Components of translatable
- [uneco/translatable-remote](https://github.com/uneco/translatable-remote) &mdash; Backend part of translatable
