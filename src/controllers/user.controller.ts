// Uncomment these imports to begin using these cool features!

import {inject} from '@loopback/core'
import {repository} from '@loopback/repository'
import {getJsonSchemaRef, post, requestBody} from '@loopback/rest'
import {User} from '../models/user.model'
import {Credentials, UserRepository} from '../repositories/user.repository'
import {BcryptHasher} from '../services/hash.password.bcrypt'
import {JWTService} from '../services/jwt.service'
import {MyUserService} from '../services/user.service'
import {validateCredentials} from '../services/validator'
import {CredentialsRequestBody} from './specs/user.controller.spec'

// import {inject} from '@loopback/context'


export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject('service.hasher')
    public hasher: BcryptHasher,
    @inject('service.jwt')
    public jwtService: JWTService,
    @inject('services.user.service')
    public userService: MyUserService
  ) {}

  @post('/users/signup', {
    responses: {
      '200': {
        description: 'User',
        content: {
          schema: getJsonSchemaRef(User)
        }
      }
    }
  })
  async signup(@requestBody() userData: User) {
    validateCredentials(userData)
    userData.password = await this.hasher.hashPassword(userData.password)
    const savedUser = await this.userRepository.create(userData)
    return savedUser
  }

  @post('/users/login', {
    responses: {
      '200': {
        description: 'Token',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string'
                }
              }
            }
          }
        }
      }
    }
  })
  async login(@requestBody(CredentialsRequestBody) credentials: Credentials): Promise<{token: string}> {
    const user = await this.userService.verifyCredentials(credentials)
    const userProfile = this.userService.convertToUserProfile(user)
    const token = await this.jwtService.generateToken(userProfile)
    return Promise.resolve({token})
  }

}