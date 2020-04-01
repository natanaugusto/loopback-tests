import {BindingKey} from '@loopback/core'
import {BcryptHasher} from './services/hash.password.bcrypt'
import {JWTService} from './services/jwt.service'
import {MyUserService} from './services/user.service'

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = '1Q234ASEDRFAFsdfsdf'
  export const TOKEN_EXPIRES_IN_VALUE = '7h'
}

export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'auth.jwt.secret'
  )

  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'auth.jwt.expiresIn'
  )

  export const TOKEN_SERVICE = BindingKey.create<JWTService>(
    'auth.jwt.service'
  )
}

export namespace PasswordHasherBindings {
  export const PASSWORD_HASHER = BindingKey.create<BcryptHasher>(
    'service.password.hasher'
  )

  export const PASSWORD_ROUNDS = BindingKey.create<number>(
    'service.password.rounds'
  )
}

export namespace MyServicesBindings {
  export const USER_SERVICE = BindingKey.create<MyUserService>(
    'services.user'
  )
}
