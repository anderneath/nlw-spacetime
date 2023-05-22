import axios from 'axios'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function userRoutes(app: FastifyInstance) {
  app.get('/user', async () => {
    const user = await prisma.memory.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    })

    return user.map((memory) => ({
      id: memory.id,
      coverUrl: memory.coverUrl,
      excerpt: memory.content.substring(0, 115).concat('...'),
    }))
  })

  app.get('/user/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const memory = await prisma.memory.findUniqueOrThrow({
      where: {
        id,
      },
    })

    return memory
  })

  app.post('/user', async (request) => {
    const bodySchema = z.object({
      code: z.string(),
    })

    const { code } = bodySchema.parse(request.body)

    const accessTokenUrl = process.env.GITHUB_ACCESS_TOKEN_URL || ''

    const accessTokenResponse = await axios.post(accessTokenUrl, null, {
      params: {
        code,
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
      },
      headers: {
        Accept: 'application/json',
      },
    })

    const { access_token } = accessTokenResponse.data

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    })

    const userSchema = z.object({
      id: z.number(),
      login: z.string(),
      name: z.string(),
      avatar_url: z.string().url(),
    })

    const githubUser = userSchema.parse(userResponse.data)

    let user = await prisma.user.findUnique({
      where: {
        githubId: githubUser.id,
      },
    })

    if (!user) {
      user = await prisma.user.create({
        data: {
          githubId: githubUser.id,
          login: githubUser.login,
          name: githubUser.name,
          avatarUrl: githubUser.avatar_url,
        },
      })
    }

    const token = app.jwt.sign(
      {
        name: user.name,
        avatarUrl: user.avatarUrl,
      },
      {
        sub: user.id,
        expiresIn: '30 days',
      },
    )

    return { token }
  })

  app.put('/user/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
      content: z.string().optional(),
      coverUrl: z.string().optional(),
      isPublic: z.coerce.boolean().default(false).optional(),
    })

    const { content, coverUrl, isPublic } = bodySchema.parse(request.body)

    const memory = await prisma.memory.update({
      where: {
        id,
      },
      data: {
        content,
        coverUrl,
        isPublic,
        userId: '89a946f7-570c-4438-bc49-9fd6612a5c98',
      },
    })

    return memory
  })

  app.delete('/user/:id', async (request) => {
    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    await prisma.memory.delete({
      where: {
        id,
      },
    })
  })
}
