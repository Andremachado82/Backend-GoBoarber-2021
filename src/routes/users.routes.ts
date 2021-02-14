import { Router } from 'express'
import multer from 'multer'

import CreateUserService from '../service/CreateUserService'
import ensureAuthenticated from '../middlewares/ensureAuthenticated'
import uploadConfig from '../config/upload'
import updateUserAvatarService from '../service/UpdateUserAvatarService'
import UpdateUserAvatarService from '../service/UpdateUserAvatarService'


const usersRouter = Router()
const upload = multer(uploadConfig)

usersRouter.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  const createUser = new CreateUserService();

  const user = await createUser.execute({
    name,
    email,
    password
  })

  delete user.password;

  return res.json(user)
})

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'), async (req, res) => {
  const updateUserAvatar = new UpdateUserAvatarService()

  const user = await updateUserAvatar.execute({
    user_id: req.user.id,
    avatarFileName: req.file.filename
  })

  delete user.password

  return res.json(user)

})

export default usersRouter
