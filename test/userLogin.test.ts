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

    it('should logout a user in case it is logged',()=>{
        const spySessionManager = new SpyOnSessionManager()
        const service= new UserLoginService(spySessionManager)
        const loggedUser= new User("Javier")
        const loggedUser2 = new User("Denis")
        service.manualLogin(loggedUser);
        service.manualLogin(loggedUser2)

        const response = service.logout(loggedUser)

        expect(service.getLoggedUsers()).not.toContain("Javier") // comprobar que la sesión del usuario ha expirado
        expect(spySessionManager.logoutHaveBeenCalled).toBeTruthy()
        expect(response).toEqual("User logged out")
    })

    it('should manage service not available error', ()=> {
        const mockSessionManager = new MockSessionManager('serviceNotAvailable')
        const service= new UserLoginService(mockSessionManager)
        const loggedUser= new User("Javier")
        service.manualLogin(loggedUser);

        const response = service.logout(loggedUser)

        expect(mockSessionManager.logoutHaveBeenCalled).toBeTruthy()
        expect(response).toEqual('Service not available')
    })

    it('should manage user not logged in facebook', ()=> {
        const mockSessionManager = new MockSessionManager('userNotLoggedIn')
        const service= new UserLoginService(mockSessionManager)
        const loggedUser= new User("Javier")
        service.manualLogin(loggedUser);

        const response = service.logout(loggedUser)

        expect(mockSessionManager.logoutHaveBeenCalled).toBeTruthy()
        expect(response).toEqual('User not logged in Facebook')
    })

})
