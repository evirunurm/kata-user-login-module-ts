import { User } from '../../src/user'

export class UserMother {
  static john(): User {
    return new User("John")
  }
}