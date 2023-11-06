import {UserLoginService} from "../src/userLoginService";
import {User} from "../src/user";
import {MockedSessionManager} from "../src/__doubles__/mockedSessionManager";


describe('User Service Login', () => {
    // en este caso se mantiene el resultado del array de Usuarios debido a que estoy utilizando la misma instancia de UserLoginService
    // si queremos que se reinicia o restablezca deberemos de instanciar la clase UserLoginService en cada test
    const mockManager = new MockedSessionManager()
    const service = new UserLoginService(mockManager)

    it('should log a user', () => {
        expect(service.manualLogin(mockedUserDummy)).toEqual('User successfully logged in')
    });

    it('should tell us that an user is already logged', () => {

        expect(service.manualLogin(mockedUserDummy)).toBe("User already logged in")
    });

    it('should return the array of the logged users', () => {

        service.manualLogin(new User("Pablo"))

        expect(service.getLoggedUsers()).toEqual(expectedUsersLoggedUsers)
    });

    it('should return the number of logged users', () => {
        expect(service.getExternalSessions()).toEqual(4)
    });

    it('should add new user', () => {
        expect(service.login("Denis", "1234patata",)).toBe("login correcto")
    });

    it("shouldn't add a new user", () => {
        expect(service.login("Javier", "1234patatica")).toBe("login incorrecto")
    });
    it("should logout a user", () => {
        const logoutResponse = service.logout(mockedUserDummy)

        expect(logoutResponse).toBe("User logged out")
        expect(mockManager.getLogoutParams()).toBe(mockedUserDummy)
        expect(mockManager.getNumberOfLogoutCallas()).toBe(1)
    });

    it('shouldn"t allow to logout if user is not register', () => {

        expect(service.logout(notRegisteredUser)).toBe("user not found")
    });

    it("should return a no response error", () => {

        service.manualLogin(noResponseError)
        expect(service.logout(noResponseError)).toBe("ServiceNotAvailable")
    });

    it("should return a no user response error", () => {
        service.manualLogin(userNotLoggedIn)

        expect(service.logout(userNotLoggedIn)).toBe("UserNotLoggedIn")
    })

})
const mockedUserDummy = new User("Denis")
const expectedUsersLoggedUsers: string[] = ["Denis", "Pablo"]
const notRegisteredUser = new User("Maik")
const noResponseError = new User("NoResponseError")
const userNotLoggedIn = new User("UserNotLoggedIn")
