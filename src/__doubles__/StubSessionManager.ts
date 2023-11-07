import {SessionManager} from "../sessionManager";

export class StubSessionManager implements SessionManager {
    getSessions(): number {
        return 4
    }

    login(username: string, password: string): boolean {
        throw new Error("I'm a stub, this method should not used in this case")
    }

    logout(username:string):string{
        throw new Error("I'm a stub, this method should not be used")
    }
}