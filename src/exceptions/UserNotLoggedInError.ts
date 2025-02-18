export class UserNotLoggedInError extends Error {
    constructor() {
        super('User is not logged in');
        this.name = 'UserNotLoggedIn';
    }
}
