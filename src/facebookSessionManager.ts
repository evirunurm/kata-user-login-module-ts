import {SessionManager} from "./sessionManager"
import { UserNotLoggedInError } from './exceptions/UserNotLoggedInError'

export class FacebookSessionManager implements SessionManager {
    login(_userName: string, _password: string): boolean {
        //Imaginad que esto en realidad realiza una llamada al API de Facebook
        return Math.random() < 0.5
    }

    getSessions(): number {
        //Imaginad que esto en realidad realiza una llamada al API de Facebook
        return (Math.random() * 100)
    }

    logout(_userName: string): boolean {
        //Imaginad que esto en realidad realiza una llamada al API de Facebook
        const success = Math.random() < 0.5
        if (!success) throw new UserNotLoggedInError()
        return success
    }
}
