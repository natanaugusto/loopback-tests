import {HttpErrors} from '@loopback/rest'
import * as isEmail from 'isemail'
import {Creadentials} from '../repositories/user.repository'

export function validateCredentials(credentials: Creadentials): void {
  if (!isEmail.validate(credentials.email)) {
    throw new HttpErrors.UnprocessableEntity('invalid Email')
  }

  if (credentials.password.length < 8) {
    throw new HttpErrors.UnprocessableEntity(
      'password length should be greater that 8'
    )
  }
}
