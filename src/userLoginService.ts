import {User} from "./user"
import {SessionManager} from "./sessionManager";

export class UserLoginService {
    private loggedUsers: User[] = []
    private isUserAlreadyLogged = (user: User) => this.loggedUsers.some(loggedUser => loggedUser.getUserName() === user.getUserName())
    sessionManager: SessionManager;

    constructor(sessionManager: SessionManager) {
        this.sessionManager = sessionManager
    }

    public manualLogin(user: User): string {
        return this.isUserAlreadyLogged(user)
            ? "User already logged in"
            : (this.loggedUsers.push(user), "User successfully logged in")
    }

    public getLoggedUsers(): string[] {
        return this.loggedUsers.map((user) => user.getUserName())
    }

    public getExternalSessions() {
        return this.sessionManager.getSessions()
    }

    public login(username: string, password: string): string {
        return this.sessionManager.login(username, password)
            ? (this.loggedUsers.push(new User(username)), "login correcto")
            : "login incorrecto"
    }

    public logout(user: User) {
        try{
            console.log(this.loggedUsers.includes(user))
            return this.loggedUsers.includes(user)
                ? this.sessionManager.logout(user)
                : "user not found";
        }catch (e){
            return e.message
        }
    }


}
