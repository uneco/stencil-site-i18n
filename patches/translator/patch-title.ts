export function patchTitle (parsedMarkdown: any) {
  parsedMarkdown.body = [
    `# !title!${parsedMarkdown.attributes.title}`,
    '',
    parsedMarkdown.body,
  ].join('\n')
}
