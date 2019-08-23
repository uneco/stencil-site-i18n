/* eslint-disable require-atomic-updates */

import Turndown from 'turndown'
import marked from 'marked'
import { createHash } from 'crypto'
import fetch from 'node-fetch'
import url from 'url'

interface ITranslatedPhrase {
  id: string,
  originalText: string,
  translatedText: string,
  translators: Array<{
    user: {
      id: string,
      photoURL: string,
      githubId: string,
      displayName: string,
    },
  }>,
}

const turndown = new Turndown({
  headingStyle: 'atx',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  fence: '```',
})

function hash (text: string) {
  return createHash('sha1').update(text.trim()).digest().toString('hex')
}

function fetchGithubUsernames (ids: string[]) {
  const fetchTasks = ids.map<Promise<string>>(async (id) => {
    const response = await fetch(url.format({
      protocol: 'https',
      hostname: 'api.github.com',
      pathname: `user/${id}`,
      query: {
        access_token: process.env.GITHUB_TOKEN,
      },
    }))
    const data = await response.json()
    return data.login
  })

  return Promise.all(fetchTasks)
}

export async function translateMarkdown (parsedMarkdown: any) {
  const translatedData: ITranslatedPhrase[] = require('./translated.json')
  const renderer = new marked.Renderer()
  const translators = new Set<string>()
  let totalCharacterCount = 0
  let totalTranslatedCharacterCount = 0

  function translate (text: string) {
    const markdown = turndown.turndown(text).replace(/"/g, '&quot;')
    totalCharacterCount += markdown.length
    const key = hash(markdown)
    const translated = translatedData.find((phrase) => phrase.id === key)

    if (translated) {
      totalTranslatedCharacterCount += markdown.length
      for (const translator of translated.translators) {
        translators.add(translator.user.githubId)
      }
      return translated.translatedText
    } else {
      return text
    }
  }

  renderer.paragraph = (text) => {
    return `<p>${translate(text)}</p>`
  }

  renderer.listitem = (text) => {
    return `<li>${translate(text)}</li>`
  }

  renderer.heading = (text, level) => {
    return `<h${level}>${translate(text)}</h${level}>`
  }

  renderer.tablecell = (text, flags) => {
    const tagName = flags.header ? 'th' : 'td'
    const attributes = flags.align ? ` align="${flags.align}"` : ''
    return `<${tagName}${attributes}>${translate(text)}</${tagName}>`
  }

  const html = marked(parsedMarkdown.body, { renderer })
  parsedMarkdown.body = turndown.turndown(html)

  const translatorIds = [...translators.values()]
  parsedMarkdown.attributes.title = translate(parsedMarkdown.attributes.title)
  parsedMarkdown.attributes.translators = await fetchGithubUsernames(translatorIds)
  parsedMarkdown.attributes.translationCoverage = {
    translated: totalTranslatedCharacterCount,
    total: totalCharacterCount,
  }
}
