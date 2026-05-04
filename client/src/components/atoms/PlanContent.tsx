import type { ReactNode } from 'react'

type Block =
  | { type: 'heading'; level: number; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'code'; lang: string; text: string }
  | { type: 'quote'; text: string }
  | { type: 'hr' }

function parseMarkdown(input: string): Block[] {
  const lines = input.split('\n')
  const blocks: Block[] = []
  let i = 0
  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('```')) {
      const lang = line.slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++
      blocks.push({ type: 'code', lang, text: codeLines.join('\n') })
      continue
    }

    if (/^---+$/.test(line.trim()) || /^___+$/.test(line.trim())) {
      blocks.push({ type: 'hr' })
      i++
      continue
    }

    const heading = /^(#{1,6})\s+(.+)$/.exec(line)
    if (heading) {
      blocks.push({ type: 'heading', level: heading[1].length, text: heading[2] })
      i++
      continue
    }

    if (/^>\s?/.test(line)) {
      const quoteLines: string[] = []
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        quoteLines.push(lines[i].replace(/^>\s?/, ''))
        i++
      }
      blocks.push({ type: 'quote', text: quoteLines.join(' ') })
      continue
    }

    if (/^\s*[-*+]\s+/.test(line) || /^\s*\d+\.\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && (/^\s*[-*+]\s+/.test(lines[i]) || /^\s*\d+\.\s+/.test(lines[i]))) {
        items.push(lines[i].replace(/^\s*(?:[-*+]|\d+\.)\s+/, ''))
        i++
      }
      blocks.push({ type: 'list', items })
      continue
    }

    if (line.trim() === '') {
      i++
      continue
    }

    const paraLines: string[] = [line]
    i++
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('```') &&
      !/^(#{1,6})\s/.test(lines[i]) &&
      !/^\s*[-*+]\s/.test(lines[i]) &&
      !/^\s*\d+\.\s/.test(lines[i]) &&
      !/^>\s?/.test(lines[i]) &&
      !/^---+$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i])
      i++
    }
    blocks.push({ type: 'paragraph', text: paraLines.join(' ') })
  }
  return blocks
}

type InlineToken =
  | { type: 'text'; text: string }
  | { type: 'code'; text: string }
  | { type: 'bold'; text: string }
  | { type: 'italic'; text: string }

function tokenizeInline(text: string): InlineToken[] {
  const tokens: InlineToken[] = []
  let buf = ''
  let i = 0
  const flush = () => {
    if (buf) {
      tokens.push({ type: 'text', text: buf })
      buf = ''
    }
  }
  while (i < text.length) {
    if (text[i] === '`') {
      const end = text.indexOf('`', i + 1)
      if (end !== -1) {
        flush()
        tokens.push({ type: 'code', text: text.slice(i + 1, end) })
        i = end + 1
        continue
      }
    } else if (text[i] === '*' && text[i + 1] === '*') {
      const end = text.indexOf('**', i + 2)
      if (end !== -1) {
        flush()
        tokens.push({ type: 'bold', text: text.slice(i + 2, end) })
        i = end + 2
        continue
      }
    } else if (text[i] === '*') {
      const end = text.indexOf('*', i + 1)
      if (end !== -1 && end !== i + 1) {
        flush()
        tokens.push({ type: 'italic', text: text.slice(i + 1, end) })
        i = end + 1
        continue
      }
    }
    buf += text[i]
    i++
  }
  flush()
  return tokens
}

function renderInline(text: string): ReactNode {
  return tokenizeInline(text).map((tok, idx) => {
    if (tok.type === 'code') {
      return (
        <code
          key={idx}
          className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-[0.85em] text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700"
        >
          {tok.text}
        </code>
      )
    }
    if (tok.type === 'bold') {
      return (
        <strong key={idx} className="font-semibold text-zinc-900 dark:text-zinc-100">
          {tok.text}
        </strong>
      )
    }
    if (tok.type === 'italic') {
      return (
        <em key={idx} className="italic">
          {tok.text}
        </em>
      )
    }
    return <span key={idx}>{tok.text}</span>
  })
}

const HEADING_CLASSES = [
  '',
  'text-xl font-bold tracking-tight',
  'text-lg font-bold tracking-tight',
  'text-base font-semibold',
  'text-sm font-semibold',
  'text-sm font-medium',
  'text-xs font-medium uppercase tracking-wider'
]

function HeadingBlock({ level, text }: { level: number; text: string }) {
  const cls = HEADING_CLASSES[level] ?? HEADING_CLASSES[6]
  const Tag = `h${Math.min(Math.max(level, 1), 6)}` as unknown as keyof JSX.IntrinsicElements
  return (
    <Tag className={`${cls} text-zinc-900 dark:text-zinc-100 mt-1 first:mt-0`}>
      {renderInline(text)}
    </Tag>
  )
}

function renderBlock(block: Block, idx: number): ReactNode {
  switch (block.type) {
    case 'heading':
      return <HeadingBlock key={idx} level={block.level} text={block.text} />
    case 'paragraph':
      return (
        <p key={idx} className="text-sm leading-6 text-zinc-700 dark:text-zinc-300">
          {renderInline(block.text)}
        </p>
      )
    case 'list':
      return (
        <ul
          key={idx}
          className="flex flex-col gap-1.5 list-disc list-outside pl-5 text-sm leading-6 text-zinc-700 dark:text-zinc-300 marker:text-zinc-400 dark:marker:text-zinc-600"
        >
          {block.items.map((item, i) => (
            <li key={i}>{renderInline(item)}</li>
          ))}
        </ul>
      )
    case 'code':
      return (
        <pre
          key={idx}
          className="font-mono text-xs leading-6 text-zinc-800 dark:text-zinc-200 whitespace-pre rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 p-3 overflow-x-auto"
        >
          {block.text}
        </pre>
      )
    case 'quote':
      return (
        <blockquote
          key={idx}
          className="border-l-2 border-zinc-300 dark:border-zinc-700 pl-3 text-sm italic text-zinc-600 dark:text-zinc-400"
        >
          {renderInline(block.text)}
        </blockquote>
      )
    case 'hr':
      return <hr key={idx} className="border-zinc-200 dark:border-zinc-800" />
  }
}

export interface PlanContentProps {
  content: string
}

export default function PlanContent({ content }: PlanContentProps) {
  const blocks = parseMarkdown(content)
  return <div className="flex flex-col gap-3">{blocks.map(renderBlock)}</div>
}
