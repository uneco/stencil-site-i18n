import { readFileSync, writeFileSync, copyFileSync } from 'fs'

export function write (path: string, content: string) {
  writeFileSync(path, content)
}

export function copy (from: string, to: string) {
  copyFileSync(from, to)
}

export function append (filepath: string, appendText: string) {
  const content = readFileSync(filepath).toString()
  writeFileSync(filepath, content + appendText)
}

type Modifier = (content: string, emit: () => void) => string
export function modify (filepath: string, expectedEmits: number, modifier: Modifier) {
  const content = readFileSync(filepath).toString()
  let count = 0
  const modified = modifier(content, () => count++)
  if (count !== expectedEmits) {
    throw new Error(`'${filepath}': patch failed`)
  }
  writeFileSync(filepath, modified)
}
