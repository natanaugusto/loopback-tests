import {AuthenticationStrategy} from '@loopback/authentication'
import {inject} from '@loopback/core'
import {HttpErrors, Request} from '@loopback/rest'
import {UserProfile} from '@loopback/security'
import {TokenServiceBindings} from '../keys'
import {JWTService} from '../services/jwt.service'

export class JWTStrategy implements AuthenticationStrategy {
  name = 'jwt'
  constructor(
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JWTService
  ) {}
  async authenticate(
    request: Request
  ): Promise<UserProfile> {
    const token: string = this.extractCredentials(request)
    const userProfile = await this.jwtService.verifyToken(token)
    return userProfile
    // throw new Error('Method not implemented.')
  }

  extractCredentials(request: Request): string {
    if (!request.headers.authorization) {
      throw new HttpErrors.Unauthorized('Authorization header is missing')
    }

    const authHeaderValue = request.headers.authorization
    if (!authHeaderValue.startsWith('Bearer')) {
      throw new HttpErrors.Unauthorized('Authorization header is not Bearer type')
    }
    const parts = authHeaderValue.split(' ')
    if (parts.length !== 2) {
      throw new HttpErrors.Unauthorized('Authorization header has not the right parts')
    }
    const token = parts[1]
    return token
  }
}
