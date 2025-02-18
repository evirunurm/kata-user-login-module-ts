import {User} from "./user"
import { FacebookSessionManager } from './facebookSessionManager'
import { UserNotLoggedInError } from './exceptions/UserNotLoggedInError'
import { ServiceNotAvailableError } from './exceptions/ServiceNotAvailableError'
import { SessionManager } from './sessionManager'

export class UserLoginService {
    private loggedUsers: User[] = []
    private facebookSessionManager: SessionManager

    constructor(facebookSessionManager: SessionManager) {
        this.facebookSessionManager = facebookSessionManager
    }

    public manualLogin = (user: User): string => {
        if (this.isUserAlreadyLogged(user)) {
            return 'User already logged in'
        }
        this.loggedUsers.push(user)
        return 'User successfully logged in'
    }

    public logout = (user: User): string => {
        if (!this.isUsernameAlreadyLogged(user.getUserName())) {
            return 'User not found'
        }
        try {
            this.facebookSessionManager.logout(user.getUserName())
            this.removeUser(user.getUserName())
            return 'User logged out'
        } catch (error) {
            if (error instanceof UserNotLoggedInError) {
                return 'User not logged in'
            } else if (error instanceof ServiceNotAvailableError) {
                return 'Service not available'
            }
        }
    }

    public login = (userName: string, password: string): string => {
        const loginSuccessful = this.facebookSessionManager.login(userName, password)

        if (!loginSuccessful) return 'Login incorrect';

        this.loggedUsers.push(new User(userName))
        return 'Login correct';
    }

    public getLoggedUsers = (): User[] => this.loggedUsers

    public getExternalSessions = (): number => this.facebookSessionManager.getSessions()

    private isUserAlreadyLogged = (user: User)=>
      this.loggedUsers.some(loggedUser => loggedUser.getUserName() === user.getUserName())

    private isUsernameAlreadyLogged = (username: string)=>
      this.loggedUsers.some(loggedUser => loggedUser.getUserName() === username)

    private removeUser = (username: string): void => {
        this.loggedUsers = this.loggedUsers.filter(user => user.getUserName() !== username)
    }
}
