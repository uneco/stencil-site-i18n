import { createHash } from 'crypto'
import marked from 'marked'

import Turndown from 'turndown'
const turndown = new Turndown()

function hash (text: string) {
  return createHash('sha1').update(text.trim()).digest().toString('hex')
}

export function patchRenderer (renderer: marked.Renderer, filePath: string) {
  const unwrapPairs: { [rendered: string]: string } = {}

  function inject (text: string, c: string) {
    const markdown = turndown.turndown(text).replace(/"/g, '&quot;')
    if (markdown.length === 0) {
      return text
    }
    const injected = [
      `<translatable-text hash="${hash(markdown)}" original-text="${markdown}" class="${c}" file="${filePath}">`,
      unwrapPairs[text] || text,
      '</translatable-text>',
    ].join('')
    return injected
  }

  function wrap (text: string, tagName: string, c: string, attributes?: any) {
    const attributeEntries = Object.entries({ ...attributes, class: 'translatable' })
    const attributesText = attributeEntries
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}="${value}"`).join(' ')
    const wrapped = [
      `<${tagName} ${attributesText}>`,
      inject(text, c),
      `</${tagName}>`,
    ].join('')
    unwrapPairs[wrapped] = `<${tagName}>${text}</${tagName}>`
    return wrapped
  }

  function wrapHeading (text: string, level: number, raw: string) {
    const id = raw.toLowerCase().replace(/[^\w]+/g, '-')
    const link = (content: string) => ([
      (level !== 1) ? `<a class="heading-link" href="#${id}"><app-icon name="link"></app-icon>` : '',
      content,
      (level !== 1) ? '</a>' : '',
    ].join(''))
    const headerize = (content: string) => `<h${level} id="${id}">${content}</h${level}>`
    const wrapped = headerize(link(inject(text, 'heading')))
    unwrapPairs[wrapped] = headerize(link(text))
    return wrapped
  }

  function wrapTitle (text: string) {
    return `<p>page title: ${inject(text, 'page-title')}</p>`
  }

  renderer.paragraph = (text) => {
    return wrap(text, 'p', 'paragraph')
  }

  const previousHeading = renderer.heading
  renderer.heading = (text, level, raw, slugger) => {
    const matchForTitle = text.trim().match(/!title!(.+)$/)
    if (matchForTitle) {
      return wrapTitle(matchForTitle[1])
    } else {
      previousHeading(text, level, raw, slugger) // for metadata
      return wrapHeading(text, level, raw)
    }
  }

  renderer.listitem = (text) => {
    return wrap(text, 'li', 'list-item')
  }

  renderer.tablecell = (content, flags) => {
    return wrap(content, flags.header ? 'th' : 'td', 'table-cell', {
      align: flags.align,
    })
  }
}
