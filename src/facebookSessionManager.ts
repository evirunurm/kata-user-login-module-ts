import {SessionManager} from "./sessionManager"
import {User} from "./user";

export class FacebookSessionManager implements SessionManager {
    login(userName: string, password: string): boolean {
        //Imaginad que esto en realidad realiza una llamada al API de Facebook
        return Math.random() < 0.5
    }

    getSessions(): number {
        //Imaginad que esto en realidad realiza una llamada al API de Facebook
        return (Math.random() * 100)
    }

    logout(user: User): string {
        return "user logged out"
    }
}
