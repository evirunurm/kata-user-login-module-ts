import {UserLoginService} from "../src/userLoginService";
import {User} from "../src/user";
import {DummySessionManager} from "../src/__doubles__/DummySessionManager";
import {StubSessionManager} from "../src/__doubles__/StubSessionManager";
import {FakeSessionManager} from "../src/__doubles__/FakeSessionManager";
import {SpyOnSessionManager} from "../src/__doubles__/SpyOnSessionManager";
import {MockSessionManager} from "../src/__doubles__/MockSessionManager";


describe('User Service Login', () => {

    it('should log a user', () => {
        const dummySessionManager = new DummySessionManager()
        const service = new UserLoginService(dummySessionManager)
        const user = new User("Javier")

        const response = service.manualLogin(user)

        expect(response).toEqual('User successfully logged in')
    })

    it('should not log an already logged user', () => {
        const dummySessionManager = new DummySessionManager()
        const service = new UserLoginService(dummySessionManager)
        const user = new User("Javier")
        service.manualLogin(user)

        const response = service.manualLogin(user)

        expect(response).toEqual('User already logged in')
    })

    it('should return us a logged users array', () => {
        const dummySessionManager = new DummySessionManager()
        const service = new UserLoginService(dummySessionManager)
        const user = new User("Javier")
        const user2 = new User("Denis")
        service.manualLogin(user)
        service.manualLogin(user2)

        const users = service.getLoggedUsers()

        expect(users).toEqual(["Javier", "Denis"])
    })

    it('should return us the external sessions', () => {
        const stubSessionManager = new StubSessionManager()
        const service = new UserLoginService(stubSessionManager)

        const loggedUsers = service.getExternalSessions()

        expect(loggedUsers).toEqual(4)
    })

    it('should log a user if login action is successful', () => {
        const service = new UserLoginService(new FakeSessionManager())

        const response = service.login("Denis", "contraseñaCorrecta")

        expect(response).toEqual('Login correcto')
    })

    it('should not log a user if login action is denied', () => {
        const service = new UserLoginService(new FakeSessionManager())

        const response = service.login("Denis", "contraseñaIncorrecta")

        expect(response).toEqual('Login incorrecto')
    })

    it("should be able to logout a user", () => {
        const service = new UserLoginService(new SpyOnSessionManager());
        const existingUser = new User("existingUser");

        service.manualLogin(existingUser)
        const response = service.logout(existingUser)
        const logoutParams=service.getLogoutParams()
        const numberOfCalls=service.getNumberOfLogoutCallas()

        expect(response).toEqual("User logged out")
        expect(logoutParams).toEqual(existingUser.getUserName())
        expect(numberOfCalls).toEqual(1)
    })

    it("should not be able to logout not registered users",()=>{
        const service= new UserLoginService(new DummySessionManager())
        const notExistingUser= new User("Javier")

        const response= service.logout(notExistingUser)

        expect(response).toEqual("User not found")
    })

    it('should manage logout service not available exception',()=>{
        const service= new UserLoginService(new MockSessionManager())
        const serviceNotAvailableUser = new User("ServiceNotAvailable");
        const expectedResponse:string="service not available"

        service.manualLogin(serviceNotAvailableUser)
        const response=service.logout(serviceNotAvailableUser);

        expect(response).toEqual(expectedResponse)
    })

    it('should manage not logged user exception',()=>{
        const service= new UserLoginService(new MockSessionManager())
        const notLoggedUser = new User("UserNotAvailable");
        const expectedResponse:string="User not logged in Facebook"

        service.manualLogin(notLoggedUser)
        const response=service.logout(notLoggedUser);

        expect(response).toEqual(expectedResponse)
    })


})
