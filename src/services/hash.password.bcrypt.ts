import {inject} from '@loopback/core'
import {compare, genSalt, hash} from 'bcryptjs'

interface PasswordHasher<T = string> {
  hashPassword(password: T): Promise<T>
  comparePassword(providePass: T, storedPass: T): Promise<boolean>
}

export class BcryptHasher implements PasswordHasher<string> {
  @inject('rounds')
  public readonly rounds: number
  round = 10
  async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(this.round)
    const hashed = await hash(password, salt)
    return hashed
  }

  async comparePassword(providePass: string, storedPass: string): Promise<boolean> {
    const passwordMatch = compare(providePass, storedPass)
    return passwordMatch
  }
}
