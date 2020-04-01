// Uncomment these imports to begin using these cool features!

import {authenticate, AuthenticationBindings} from '@loopback/authentication'
import {inject} from '@loopback/core'
import {repository} from '@loopback/repository'
import {get, getJsonSchemaRef, post, requestBody} from '@loopback/rest'
import {UserProfile} from '@loopback/security'
import {PermissionKeys} from '../authorization/permission-keys'
import {MyServicesBindings, PasswordHasherBindings, TokenServiceBindings} from '../keys'
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
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
    @inject(MyServicesBindings.USER_SERVICE)
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
    userData.permissions = [PermissionKeys.AccessAuthFeatures]
    userData.password = await this.hasher.hashPassword(userData.password)
    const savedUser = await this.userRepository.create(userData)
    delete savedUser.password
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

  @get('/users/me')
  @authenticate('jwt')
  me(
    @inject(AuthenticationBindings.CURRENT_USER)
    currentUser: UserProfile
  ): Promise<UserProfile> {
    return Promise.resolve(currentUser)
  }
}
