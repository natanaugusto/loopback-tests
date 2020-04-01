import {BootMixin} from '@loopback/boot'
import {ApplicationConfig} from '@loopback/core'
import {RepositoryMixin} from '@loopback/repository'
import {RestApplication} from '@loopback/rest'
import {RestExplorerBindings, RestExplorerComponent} from '@loopback/rest-explorer'
import {ServiceMixin} from '@loopback/service-proxy'
import path from 'path'
import {MyServicesBindings, PasswordHasherBindings, TokenServiceBindings, TokenServiceConstants} from './keys'
import {MySequence} from './sequence'
import {BcryptHasher} from './services/hash.password.bcrypt'
import {JWTService} from './services/jwt.service'
import {MyUserService} from './services/user.service'

export class Lb4AppApplication extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options)

    // Set up the custom sequence
    this.sequence(MySequence)

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'))

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    })
    this.component(RestExplorerComponent)

    this.projectRoot = __dirname
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    }
    this.bind(PasswordHasherBindings.PASSWORD_ROUNDS).to(10)
    this.bind(PasswordHasherBindings.PASSWORD_HASHER).toClass(BcryptHasher)
    this.bind(MyServicesBindings.USER_SERVICE).toClass(MyUserService)
    this.bind(TokenServiceBindings.TOKEN_SERVICE).toClass(JWTService)
    this.bind(TokenServiceBindings.TOKEN_SECRET).to(TokenServiceConstants.TOKEN_SECRET_VALUE)
    this.bind(TokenServiceBindings.TOKEN_EXPIRES_IN).to(TokenServiceConstants.TOKEN_EXPIRES_IN_VALUE)
  }
}
