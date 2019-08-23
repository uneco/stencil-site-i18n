import * as YAML from 'js-yaml'
import config from '../config/docs.config'
import { readFileSync } from 'fs'
import { modify } from './utils'

interface IStructureSection {
  text: string
  children: IStructurePage[]
}

interface IStructurePage {
  text: string
  filePath: string
  url: string
}

interface IDictionary {
  sections: {
    [key: string]: IDictionarySection,
  }
}

interface IDictionarySection {
  text: string
  children: {
    [key: string]: string,
  }
}

modify('build/docs/src/assets/docs-structure.json', 0, (content) => {
  const dictionaryPath = `./docs/structure-${config.lang}.yml`
  const structure: IStructureSection[] = JSON.parse(content)
  const dictionary: IDictionary = YAML.load(readFileSync(dictionaryPath).toString())
  for (const section of structure) {
    const sectionInDictionary = dictionary.sections[section.text]
    if (sectionInDictionary) {
      section.text = sectionInDictionary.text
      for (const page of section.children) {
        page.text = sectionInDictionary.children[page.text]
      }
    }
  }
  return JSON.stringify(structure, null, 2)
})
