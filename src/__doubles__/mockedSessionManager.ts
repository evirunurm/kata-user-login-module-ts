import {SessionManager} from "../sessionManager";
import {User} from "../user";

export class MockedSessionManager implements SessionManager {
    private logoutParams: User;
    private numberOfCalls: number = 0;
    getSessions = (): number => {
        return 4
    };

    login(username: string, password: string): boolean {
        return username === "Denis"
    }

    logout(user: User): string {
        switch (user.getUserName()) {
            case "NoResponseError":
                throw new Error("ServiceNotAvailable");

            case"UserNotLoggedIn":
                throw new Error("UserNotLoggedIn")

            default:
                this.logoutParams = user;
                this.numberOfCalls++;
                return "User logged out"

        }
    }

    getLogoutParams() {
        return this.logoutParams
    }

    getNumberOfLogoutCallas() {
        return this.numberOfCalls
    }

}