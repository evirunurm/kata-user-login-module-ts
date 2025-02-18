export class User {
    private readonly userName: string

    constructor(userName: string) {
        this.userName = userName
    }

    getUserName = () => this.userName

}
