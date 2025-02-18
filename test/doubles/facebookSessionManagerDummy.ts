/* eslint-disable no-unused-vars */

import { SessionManager } from '../../src/sessionManager'

export class FacebookSessionManagerDummy  implements SessionManager {
    getSessions = () => {
      throw new Error("Method not implemented. This is a Dummy.")
    }

    login = (_username: string, _password: string) => {
      throw new Error("Method not implemented. This is a Dummy.")
    }

    logout = (_username: string) => {
      throw new Error("Method not implemented. This is a Dummy.")
    }
}