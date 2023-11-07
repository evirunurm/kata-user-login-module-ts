export interface SessionManager {
    getSessions: () => number
    login: (userName: string, password: string) => boolean
    logout:(username:string) => boolean
}
