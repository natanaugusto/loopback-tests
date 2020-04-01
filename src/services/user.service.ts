import {UserService} from '@loopback/authentication'
import {inject} from '@loopback/core'
import {repository} from '@loopback/repository'
import {HttpErrors} from '@loopback/rest'
import {securityId, UserProfile} from '@loopback/security'
import {User} from '../models/user.model'
import {Credentials, UserRepository} from '../repositories/user.repository'
import {BcryptHasher} from './hash.password.bcrypt'

export class MyUserService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject('service.hasher')
    public hasher: BcryptHasher
  ) {}
  async verifyCredentials(credentials: Credentials): Promise<User> {
    const foundUser = await this.userRepository.findOne({
      where: {
        email: credentials.email
      }
    })
    if (!foundUser) {
      throw new HttpErrors.NotFound(`The email ${credentials.email} was not found`)
    }
    const passwordMatch = await this.hasher.comparePassword(credentials.password, foundUser.password)
    if (!passwordMatch) {
      throw new HttpErrors.Unauthorized('The password is not valid')
    }
    return foundUser
  }
  convertToUserProfile(user: User): UserProfile {
    const userProfile = {
      [securityId]: `${user.id}`,
      name: user.name
    }
    return userProfile
  }
}
