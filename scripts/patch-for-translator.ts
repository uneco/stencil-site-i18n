import * as cheerio from 'cheerio'
import { modify, copy } from './utils'
import config from '../config/translator.config'

function patchConfig () {
  modify('./build/translator/stencil.config.ts', 1, (ts, emit) => {
    return ts.replace(/^};$/m, () => {
      emit()
      return '  minifyJs: false,\n};'
    })
  })
}

function patchFirebaseConfig () {
  copy('./patches/translator/firebase.json', './build/translator/firebase.json')
  copy('./config/translator.firebaserc', './build/translator/.firebaserc')
}

function patchIndex () {
  modify('./build/translator/src/index.html', 0, (html) => {
    const doc = cheerio.load(html)
    const scripts = [
      `<script type="module" src="${config.translatableScriptBase}/translatable.esm.js"></script>`,
      `<script nomodule="" src="${config.translatableScriptBase}/translatable.js"></script>`,
    ]

    const attributes = [
      'firebase-config-path="/__/firebase/init.json"',
      `page-title="${config.title}"`,
    ].join(' ')

    doc('head>script:last-of-type').after(['', ...scripts].join('\n'))
    doc('app-root').wrap(`<translatable-container ${attributes}></translatable-container>`)

    return doc.html()
  })
}

function patchMarkdown () {
  modify('./build/translator/scripts/markdown-to-html.ts', 1, (ts, emit) => {
    const pattern = /^(\s+)htmlContents = marked.+$/m

    return ts.replace(pattern, (source, indent) => {
      emit()
      const patchRenderer = `${indent}patchRenderer(renderer, filePath)`
      const patchTitle = `${indent}patchTitle(parsedMarkdown)`
      return [patchRenderer, patchTitle, source].join('\n')
    }).replace(/^/, 'import { patchRenderer } from \'./patch-renderer\'\n')
      .replace(/^/, 'import { patchTitle } from \'./patch-title\'\n')
  })

  copy('./patches/translator/patch-renderer.ts', './build/translator/scripts/patch-renderer.ts')
  copy('./patches/translator/patch-title.ts', './build/translator/scripts/patch-title.ts')
}

patchConfig()
patchFirebaseConfig()
patchIndex()
patchMarkdown()
