import {SessionManager} from "../sessionManager";

export class SpyOnSessionManager implements SessionManager {
    getSessions(): number {
        throw new Error("I'm a spy on, this method should not be used")
    }

    login(username: string, password: string): boolean {
        throw new Error("I'm a spy on, this method should not be used")
    }

    logout(username: string): string {
        return "User logged out"
    }
}