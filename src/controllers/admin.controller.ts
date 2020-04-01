// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core'
import {repository} from '@loopback/repository'
import {getJsonSchemaRef, post, requestBody} from '@loopback/rest'
import {PermissionKeys} from '../authorization/permission-keys'
import {PasswordHasherBindings} from '../keys'
import {User} from '../models/user.model'
import {UserRepository} from '../repositories/user.repository'
import {BcryptHasher} from '../services/hash.password.bcrypt'
import {validateCredentials} from '../services/validator'

// import {inject} from '@loopback/context';


export class AdminController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher
  ) {}

  @post('/admin', {
    responses: {
      '200': {
        description: 'User',
        content: {
          schema: getJsonSchemaRef(User)
        }
      }
    }
  })
  async create(@requestBody() adminData: User) {
    validateCredentials(adminData)
    adminData.permissions = [
      PermissionKeys.CreateJob,
      PermissionKeys.UpdateJob,
      PermissionKeys.DeleteJob
    ]
    adminData.password = await this.hasher.hashPassword(adminData.password)
    const savedAdmin = await this.userRepository.create(adminData)
    delete savedAdmin.password
    return savedAdmin
  }
}
