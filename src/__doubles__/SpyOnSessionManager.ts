import {SessionManager} from "../sessionManager";
import {FacebookSessionManager} from "../facebookSessionManager";

export class SpyOnSessionManager implements SessionManager {
    private facebookSessionManager: FacebookSessionManager
    private _logoutHaveBeenCalled: boolean //flag que nos indica si el método logout ha sido invocado

    constructor() {
        this.facebookSessionManager = new FacebookSessionManager()
        this._logoutHaveBeenCalled = false
    }

    getSessions(): number {
        return this.facebookSessionManager.getSessions()
    }

    login(userName: string, password: string): boolean {
        return this.facebookSessionManager.login(userName, password)
    }

    logout(username: string): boolean {
        this._logoutHaveBeenCalled = true

        return this.facebookSessionManager.logout()
    }

    get logoutHaveBeenCalled(): boolean {
        return this._logoutHaveBeenCalled;
    }
}