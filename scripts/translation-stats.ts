import * as glob from 'glob'
import { readFileSync, writeFileSync } from 'fs'

interface ICoverage {
  filepath: string
  total: number
  translated: number
}

const files = glob.sync('build/docs/src/assets/docs/**/*.json')
const coverages: ICoverage[] = []

for (const file of files) {
  const doc = JSON.parse(readFileSync(file).toString())
  if (doc.translationCoverage) {
    coverages.push({
      filepath: file.split('/').slice(3).join('/'),
      ...doc.translationCoverage,
    })
  }
}

const total = coverages.reduce((value, coverage) => value + coverage.total, 0)
const translated = coverages.reduce((value, coverage) => value + coverage.translated, 0)

console.log('='.repeat(10), 'Coverage', '='.repeat(10))
console.log('total:', total, 'characters')
console.log('translated:', translated, 'characters')
console.log('rate:', (translated / total * 100).toFixed(1), '%')
console.log('='.repeat(30))

writeFileSync('build/docs/src/assets/translation-coverage.json', JSON.stringify({
  total,
  translated,
  coverages,
}, null, 4))
