import {inject} from '@loopback/core'
import {HttpErrors} from '@loopback/rest'
import {UserProfile} from '@loopback/security'
import {promisify} from 'util'

const jwt = require('jsonwebtoken')
const singAsync = promisify(jwt.sign)

export class JWTService {
  @inject('auth.jwt.secret')
  public readonly jwtSecret: string
  @inject('auth.jwt.expiresIn')
  public readonly jwtExpiresIn: string

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors.Unauthorized(
        'Error while generating the token'
      )
    }
    let token = ''
    try {
      token = await singAsync(userProfile, this.jwtSecret, {
        expiresIn: this.jwtExpiresIn
      })
    } catch (err) {
      throw new HttpErrors.Unauthorized(`error generation token ${err}`)
    }
    return token
  }
}
