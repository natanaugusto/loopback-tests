// Uncomment these imports to begin using these cool features!

import {repository} from '@loopback/repository';
import {getJsonSchemaRef, post, requestBody} from '@loopback/rest';
import {User} from '../models/user.model';
import {UserRepository} from '../repositories/user.repository';
import {validateCredentials} from '../services/validator';

// import {inject} from '@loopback/context';


export class UserController {
  userRepository: UserRepository
  constructor(
    @repository(UserRepository)
    userRepository: UserRepository
  ) {
    this.userRepository = userRepository
  }

  @post('/signup', {
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
    const savedUser = await this.userRepository.create(userData)
    delete savedUser.password
    return savedUser
  }
}
