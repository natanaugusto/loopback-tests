import {AuthenticationBindings, AuthenticationMetadata} from '@loopback/authentication'
import {Getter, globalInterceptor, Interceptor, InvocationContext, InvocationResult, Provider, ValueOrPromise} from '@loopback/context'
import {inject} from '@loopback/core'
import {HttpErrors} from '@loopback/rest'
import {intersection} from 'lodash'
import {MyUserProfile, RequiredPermissions} from '../types'
/**
 * This class will be bound to the application as an `Interceptor` during
 * `boot`
 */
@globalInterceptor('', {tags: {name: 'authorize'}})
export class AuthorizeInterceptor implements Provider<Interceptor> {
  constructor(
    @inject(AuthenticationBindings.METADATA)
    public metadata: AuthenticationMetadata,
    @inject.getter(AuthenticationBindings.CURRENT_USER)
    public getCurrentUser: Getter<MyUserProfile>
  ) {}

  /**
   * This method is used by LoopBack context to produce an interceptor function
   * for the binding.
   *
   * @returns An interceptor function
   */
  value() {
    return this.intercept.bind(this)
  }

  /**
   * The logic to intercept an invocation
   * @param invocationCtx - Invocation context
   * @param next - A function to invoke next interceptor or the target method
   */
  async intercept(
    invocationCtx: InvocationContext,
    next: () => ValueOrPromise<InvocationResult>,
  ) {
    // Add pre-invocation logic here
    const result = await next()

    // Verify if the authenticate decorator was provided
    if (this.metadata) {
      const user = await this.getCurrentUser()
      const requiredPermissions = this.metadata.options as RequiredPermissions
      const userHasPermissions = intersection(user.permissions, requiredPermissions.required)
      if (userHasPermissions.length < requiredPermissions.required.length) {
        throw new HttpErrors.Unauthorized('The user don\'t have permissions to access that')
      }
    }
    // Add post-invocation logic here
    return result
  }
}
