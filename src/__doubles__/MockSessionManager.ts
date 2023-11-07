import {SessionManager} from "../sessionManager";

export class MockSessionManager implements SessionManager {
    getSessions(): number {
        throw new Error("I,m the mock, this method should not be used")
    }

    login(username: string, password: string): boolean {
        throw new Error("I,m the mock, this method should not be used")
    }

    logout(username: string): string {
        if (username === "ServiceNotAvailable") {
            throw new Error("service not available")
        } else if(username==="UserNotAvailable"){
            throw new Error("User not logged in Facebook")
        }

        return "User logged out"
    }

}