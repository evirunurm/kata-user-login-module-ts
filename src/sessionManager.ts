import {User} from "./user";

export interface SessionManager {
    getSessions: () => number
    login: (userName: string, password: string) => boolean
    logout:(user:User)=>string
}
