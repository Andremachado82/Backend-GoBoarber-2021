import User from '../models/User'
import { getRepository } from 'typeorm'
import { compare } from 'bcryptjs'

import { sign } from 'jsonwebtoken'
import auth from '../config/auth'

import AppError from '../errors/AppError'

interface RequestDto {
  email: string;
  password: string;
}

interface Response {
  user: User,
  token: string
}

class AuthenticateUserService {
  public async execute({ email, password }: RequestDto): Promise<Response> {
    const userRepository = getRepository(User)

    const user = await userRepository.findOne({ where: { email } })

    if (!user) {
      throw new AppError('Incorrect email/password combination.', 401)
    }

    const passwordMacthed = await compare(password, user.password)

    if (!passwordMacthed) {
      throw new AppError('Incorrect email/password combination.', 401)
    }

    const { secret, expiresIn } = auth.jwt

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    })

    return {
      user,
      token
    }
  }

}

export default AuthenticateUserService
