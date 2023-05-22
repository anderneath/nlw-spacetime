import 'dotenv/config'

import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import fastify from 'fastify'
import { resolve } from 'node:path'
import { memoryRoutes, uploadRoutes, userRoutes } from './routes'

const app = fastify()

app.register(cors, {
  origin: true,
})
app.register(jwt, {
  secret: process.env.JWT_SECRET || '',
})
app.register(multipart)
app.register(require('@fastify/static'), {
  root: resolve(__dirname, '../uploads'),
  prefix: '/uploads',
})

app.register(memoryRoutes)
app.register(userRoutes)
app.register(uploadRoutes)

app
  .listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('🚀 Server running on http://0.0.0.0:3333')
  })
