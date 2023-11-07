import {SessionManager} from "../sessionManager";

export class DummySessionManager implements SessionManager {
    getSessions(): number {
        throw new Error("I'am a dummy, this method should not be used")
    };

    login(username: string, password: string): boolean {
        throw new Error("I'am a dummy, this method should not be used")
    }

}