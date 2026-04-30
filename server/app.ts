import express from 'express'
import cors from 'cors'
import { join } from 'path'
import { __dirname } from './config.ts'
import { router } from './routes.ts'

export const app = express()
app.use(cors())
app.use(express.json())
app.use(router)

const clientDist = join(__dirname, '../client/dist')
app.use(express.static(clientDist))
app.get('*', (_req, res) => res.sendFile(join(clientDist, 'index.html')))