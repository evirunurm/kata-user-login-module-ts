import {SessionManager} from "../sessionManager";
import {FacebookSessionManager} from "../facebookSessionManager";

export class MockSessionManager implements SessionManager {
    private _logoutHaveBeenCalled: boolean //flag que nos indica si el método logout ha sido invocado
    private readonly _logoutBehaviour: 'userNotLoggedIn' | 'serviceNotAvailable'

    constructor(logoutBehaviour: 'userNotLoggedIn' | 'serviceNotAvailable') {
        this._logoutHaveBeenCalled = false
        this._logoutBehaviour = logoutBehaviour
    }

    getSessions(): number {
        return 5
    }

    login(userName: string, password: string): boolean {
        return true
    }

    logout(username: string): boolean {
        this._logoutHaveBeenCalled = true;
        if (this._logoutBehaviour === 'userNotLoggedIn' ) {
            throw new Error("UserNotLoggedIn")
        }

        throw new Error("ServiceNotAvailable")
    }

    get logoutHaveBeenCalled(): boolean {
        return this._logoutHaveBeenCalled;
    }

}