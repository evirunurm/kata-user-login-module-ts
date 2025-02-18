/* eslint-disable no-unused-vars */

import { SessionManager } from '../../src/sessionManager'

export class FacebookSessionManagerSpy implements SessionManager {
  public hasLoginBeenCalled: boolean = false
  public hasLogoutBeenCalled: boolean = false
  private readonly sessions: number
  private readonly loginReturn: boolean
  private readonly logoutReturn: boolean

  constructor(sessions: number = 0, login: boolean = false, logout: boolean = false) {
    this.sessions = sessions
    this.loginReturn = login
    this.logoutReturn = logout
  }

  getSessions = () => this.sessions

  login = (_username: string, _password: string): boolean => {
    this.hasLoginBeenCalled = true
    return this.loginReturn
  }

  logout = (_username: string) => {
    this.hasLogoutBeenCalled = true
    return this.logoutReturn
  }
}