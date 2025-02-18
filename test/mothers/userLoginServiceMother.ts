import { UserLoginService } from '../../src/userLoginService'
import { User } from '../../src/user'
import { FacebookSessionManager } from '../../src/facebookSessionManager'

export class UserLoginServiceMother {
  static withLoggedUser(user: User, facebookSessionManager: FacebookSessionManager): UserLoginService {
      const service = new UserLoginService(facebookSessionManager)
      service.manualLogin(user)
      return service
    }
}