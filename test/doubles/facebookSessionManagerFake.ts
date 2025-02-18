/* eslint-disable no-unused-vars */

import { SessionManager } from '../../src/sessionManager'

export class FacebookSessionManagerFake implements SessionManager {
  private readonly sessions: number

  constructor(sessions: number = 0) {
    this.sessions = sessions
  }

  getSessions = () => this.sessions

  login = (_username: string, _password: string): boolean =>
    _username === 'John' && _password === 'password'

  logout = (_username: string) => true
}