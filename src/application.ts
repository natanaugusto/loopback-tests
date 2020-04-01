import {BootMixin} from '@loopback/boot'
import {ApplicationConfig} from '@loopback/core'
import {RepositoryMixin} from '@loopback/repository'
import {RestApplication} from '@loopback/rest'
import {RestExplorerBindings, RestExplorerComponent} from '@loopback/rest-explorer'
import {ServiceMixin} from '@loopback/service-proxy'
import path from 'path'
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
    this.bind('rounds').to(10)
    this.bind('service.jwt').toClass(JWTService)
    this.bind('service.hasher').toClass(BcryptHasher)
    this.bind('services.user.service').toClass(MyUserService)
    this.bind('auth.jwt.secret').to('123qwer')
    this.bind('auth.jwt.expiresIn').to('7h')
  }
}
