/* eslint-disable no-unused-vars */

import { SessionManager } from '../../src/sessionManager'

export class FacebookSessionManagerStub  implements SessionManager {
  private readonly sessions: number
  private readonly loginReturn: boolean

  constructor(sessions: number = 0, login: boolean = false) {
    this.sessions = sessions
    this.loginReturn = login
  }

  getSessions = () => this.sessions

  login = (_username: string, _password: string): boolean => this.loginReturn

  logout = (_username: string) => {
    throw new Error("Method not implemented. This is a Stub.")
  }
}