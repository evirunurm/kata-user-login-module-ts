import { SessionManager } from '../../src/sessionManager'

export class FacebookSessionManagerMock implements SessionManager {
  private loginHasBeenCalledTimes: number = 0;
  private logoutHasBeenCalledTimes: number = 0;
  private getSessionHasBeenCalledTimes: number = 0;
  private loginImplementation?: (_username: string, _password: string) => boolean;
  private logoutImplementation?: (_username: string) => boolean;
  private getSessionsImplementation?: () => number;

  login(userName: string, password: string): boolean {
    this.loginHasBeenCalledTimes++;
    if (this.loginImplementation) {
      return this.loginImplementation(userName, password);
    }
    return false;
  }

  logout(username: string): boolean {
    this.logoutHasBeenCalledTimes++;
    if (this.logoutImplementation) {
      return this.logoutImplementation(username);
    }
    return false;
  }

  setLoginImplementation(implementation: (_username: string, _password: string) => boolean): void {
    this.loginImplementation = implementation;
  }

  setLogoutImplementation(implementation: (_username: string) => boolean): void {
    this.logoutImplementation = implementation;
  }

  getSessions(): number {
    this.getSessionHasBeenCalledTimes++;
    if (this.getSessionsImplementation) {
      return this.getSessionsImplementation();
    }
    return 0;
  }
}
