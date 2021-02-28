import 'reflect-metadata'
import 'dotenv/config';

import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import { errors } from 'celebrate';
import 'express-async-errors'

import uploadConfig from '@config/upload'
import AppError from '@shared/errors/AppError'
import rateLimiter from './middleware/rateLimiter';
import routes from './routes'

import '@shared/infra/typeorm/index'
import '@shared/infra/typeorm'
import '@shared/container'

const app = express()

app.use(rateLimiter);
app.use(cors())
app.use(express.json())
app.use('/files', express.static(uploadConfig.uploadsFolder))
app.use(routes)

app.use(errors());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    return res
      .status(
        err.statusCode >= 100 && err.statusCode < 600 ? err.statusCode : 500,
      )
      .send(err.message)
      .json({
        status: 'error',
        message: err.message,
      });
  }

  console.error(err)

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error'
  })
})

app.listen(3333, () => {
  console.log('Server rodando na porta 3333!')
})
