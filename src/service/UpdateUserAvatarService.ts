import { getRepository } from 'typeorm'
import User from '../models/User'
import uploadConfig from '../config/upload'

import path from 'path'
import fs from 'fs'

import AppError from '../errors/AppError'

interface RequestDto {
  user_id: string,
  avatarFileName: string
}
class UpdateUserAvatarService {
  public async execute({ user_id, avatarFileName }: RequestDto): Promise<User> {
    const userRepository = getRepository(User)

    const user = await userRepository.findOne(user_id)

    if (!user_id) {
      throw new AppError('Only authenticate users can change avatar', 401)
    }

    if (user.avatar) {
      //deletar o avatar anterior

      const userAvatarFilePath = path.join(uploadConfig.directory, user.avatar)
      const userAvatarFileExists = await fs.promises.stat(userAvatarFilePath)

      if (userAvatarFileExists) {
        await fs.promises.unlink(userAvatarFilePath)
      }
    }

    user.avatar = avatarFileName

    await userRepository.save(user)

    return user
  }
}

export default UpdateUserAvatarService