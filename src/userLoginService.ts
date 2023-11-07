import {User} from "./user"
import {FacebookSessionManager} from "./facebookSessionManager";
import {SessionManager} from "./sessionManager";

export class UserLoginService {
    private loggedUsers: User[] = []
    private sessionManager: SessionManager
    private logoutCalls = 0;
    private logoutParams;

    constructor(sessionManager: SessionManager) {
        this.sessionManager = sessionManager
    }

    public manualLogin = (user: User): string => {
        if (this.isUserAlreadyLogged(user)) {
            return "User already logged in"
        }

        this.loggedUsers.push(user)
        return "User successfully logged in"
    }

    getLoggedUsers() {
        return this.loggedUsers.map(user => user.getUserName())
    }

    getExternalSessions(): number {
        const externalLoggedUsers = this.sessionManager.getSessions()
        return externalLoggedUsers;
    }

    login(username: string, password: string): string {
        if (!this.sessionManager.login(username, password)) {
            return "Login incorrecto"
        }

        this.loggedUsers.push(new User(username));
        return "Login correcto"
    }

    logout(user: User): string {
        try {
            if (!this.loggedUsers.includes(user)) {
                return "User not found"
            }

            this.loggedUsers = this.loggedUsers.filter(arrayUser => arrayUser != user);
            this.logoutCalls++;
            this.logoutParams = user.getUserName();
            return this.sessionManager.logout(user.getUserName())

        } catch (e) {
            return e.message
        }
    }


    getLogoutParams(): string {
        return this.logoutParams
    }

    getNumberOfLogoutCallas(): number {
        return this.logoutCalls
    }


    private isUserAlreadyLogged = (user: User) => this.loggedUsers.some(loggedUser => loggedUser.getUserName() === user.getUserName())
}
