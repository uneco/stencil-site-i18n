import fetch from 'node-fetch'
import config from '../config/docs.config'
import { copy, append, modify, write } from './utils'

function patchFirebaseConfig () {
  copy('./config/docs.firebaserc', './build/docs/.firebaserc')
}

function patchTranslation () {
  copy(`./docs/translation-${config.lang}.md`, './build/docs/src/docs/translation.md')
  append('./build/docs/src/docs/README.md', [
    `* ${config.words.translation}`,
    `  * [${config.words['about-translation']}](translation.md)`,
  ].join('\n'))
}

function patchDocComponent () {
  modify('./build/docs/src/components/doc-component/doc-component.tsx', 1, (ts, emit) => {
    const pattern = /^(\s+)<contributor-list contributors=\{content\.contributors\}><\/contributor-list>/m

    return ts.replace(pattern, (_, indent) => {
      emit()
      return [
        `${indent}<contributor-list contributors={content.contributors} heading="Contributors"></contributor-list>`,
        `${indent}<contributor-list contributors={content.translators} heading="Translators"></contributor-list>`,
      ].join('\n')
    })
  })
}

function patchGlobalDefinitions () {
  modify('./build/docs/src/global/definitions.ts', 1, (ts, emit) => {
    const pattern = /^(\s+)contributors\?: string\[\];$/m

    return ts.replace(pattern, (source, indent) => {
      emit()
      return source + `${indent}translators?: string[];`
    })
  })
}

function patchContributorList () {
  modify('./build/docs/src/components/contributor-list/contributor-list.tsx', 2, (ts, emit) => {
    return ts.replace(/<h5>Contributors<\/h5>/m, () => {
      emit()
      return '<h5>{this.heading}</h5>'
    }).replace(/^(\s+)@Prop\(\) contributors\?: string\[\];/m, (source, indent) => {
      emit()
      return source + `${indent}@Prop() heading?: string;`
    })
  })
}

function patchSiteHeader () {
  modify('./build/docs/src/components/site-header/site-header.tsx', 1, (ts, emit) => {
    const pattern = /^(\s+)<stencil-route-link url="\/" (?:.|\s)+?<\/stencil-route-link>/m

    return ts.replace(pattern, (_, indent) => {
      emit()
      return [
        `${indent}<div class="logo-wrapper">`,
        `${indent}  <stencil-route-link url="/" class="logo-link" anchorTitle="Stencil logo">`,
        `${indent}    <app-icon name="logo"/>`,
        `${indent}  </stencil-route-link>`,
        `${indent}  <stencil-route-link class="translation-link" url="/docs/translation">`,
        `${indent}     ${config.title}`,
        `${indent}  </stencil-route-link>`,
        `${indent}</div>`,
      ].join('\n')
    })
  })

  append('./build/docs/src/components/site-header/site-header.css', [
    '.logo-wrapper {',
    '  display: flex;',
    '}',
    '',
    '.logo-wrapper .translation-link a {',
    '  font-size: 14px;',
    '  color: var(--color-gunpowder);',
    '  text-decoration: none;',
    '  margin-left: 10px',
    '}',
  ].join('\n'))
}

async function downloadTranslatedData () {
  const result = await fetch(`${config.translatable.base}/downloadPhrases`)
  const data = await result.json()
  write('./build/docs/scripts/translated.json', JSON.stringify(data.phrases))
}

function patchRenderer () {
  modify('./build/docs/scripts/markdown-to-html.ts', 1, (ts, emit) => {
    const pattern = /^(\s+)let parsedMarkdown =.+$/m

    return ts.replace(pattern, (source, indent) => {
      emit()
      const code = `${indent}await translateMarkdown(parsedMarkdown)`
      return [source, code].join('\n')
    }).replace(/^/, 'import { translateMarkdown } from \'./translate-markdown\'\n')
  })

  copy('./patches/docs/translate-markdown.ts', './build/docs/scripts/translate-markdown.ts')
}

downloadTranslatedData()
patchTranslation()
patchGlobalDefinitions()
patchDocComponent()
patchContributorList()
patchFirebaseConfig()
patchSiteHeader()
patchRenderer()
