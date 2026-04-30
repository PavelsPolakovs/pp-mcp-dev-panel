import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

export const __dirname = dirname(fileURLToPath(import.meta.url))
export const UI_PORT = process.env.UI_PORT || 3333
export const PROJECT_DIR = process.env.PROJECT_DIR || join(__dirname, '..')