import {SessionManager} from "../../src/sessionManager";
import {UserLoginService} from "../../src/userLoginService";
import {User} from "../../src/user";
import {FacebookSessionManager} from "../../src/facebookSessionManager";

// jest.mock("../src/facebookSessionManager", () => {
//     return {
//         __esModule: true,
//         FacebookSessionManager: class {
//             getSessions = jest.fn();
//             login = jest.fn();
//         }
//
//     }
// })

class DummySessionManager implements SessionManager {
    getSessions(): number {
        throw new Error("soy un dummy, si me llamas algo mal estás haciendo")
    }

    login(username: string, password: string): boolean {
        throw new Error("soy un dummy, si me llamas es que algo mal estás haciendo")
    }

    logout(userName: string): boolean {
        throw new Error("soy un dummy, si me llamas es que algo mal estás haciendo")
    }
}

describe('User Service Login', () => {

    describe('Dummy Double', () => {
        it('should log a user', () => {
            const dummySessionManager = new DummySessionManager()
            const service = new UserLoginService(dummySessionManager)
            const mockedUser: User = new User("Denis")

            const response: string = service.manualLogin(mockedUser)

            expect(response).toEqual('User successfully logged in')
        })

        it('should not log an already logged user', () => {
            const dummySessionManager = new DummySessionManager()
            const service = new UserLoginService(dummySessionManager)
            const mockedUser: User = new User("Denis")

            service.manualLogin(mockedUser)
            const response: string = service.manualLogin(mockedUser)

            expect(response).toEqual("User already logged in")
        })
    });


    describe('Stub Double', () => {
        it('should provide us the logged users', () => {
            // para mockear o espiar clases, primeramente deberías de haberlas instanciado
            const stubFacebookSessionManager = new FacebookSessionManager();
            jest.spyOn(stubFacebookSessionManager, "getSessions").mockReturnValueOnce(4)
            const service = new UserLoginService(stubFacebookSessionManager)

            expect(service.getExternalSessions()).toEqual(4)
        })
    })

    describe('Fake Double', () => {
        it('should add a new user', () => {
            const fakeFacebookSessionManager = new FacebookSessionManager()
            jest.spyOn(fakeFacebookSessionManager, "login").mockImplementationOnce(() => true)
            const service = new UserLoginService(fakeFacebookSessionManager)

            const response = service.login("UsuarioCorrecto", "contraseña1234")
            const isUserIncluded: boolean = service.getLoggedUsers().includes("UsuarioCorrecto")

            expect(isUserIncluded).toBeTruthy()
            expect(response).toEqual("Login correcto")
        })

        it('should not add a new user if it is already logged', () => {
            const fakeFacebookSessionManager = new FacebookSessionManager()
            jest.spyOn(fakeFacebookSessionManager, "login").mockImplementationOnce(() => false)
            const service = new UserLoginService(fakeFacebookSessionManager)

            const response = service.login("UsuarioIncorrecto", "contraseña1234")
            const isUserIncluded: boolean = service.getLoggedUsers().includes("UsuarioIncorrecto")

            expect(isUserIncluded).toBeFalsy()
            expect(response).toEqual("Login incorrecto")
            expect(fakeFacebookSessionManager.login).toHaveBeenCalledWith("UsuarioIncorrecto", "contraseña1234")
        })
    })
    describe('Spy Double', () => {
        it('should logout a user', () => {
            const spyFacebookSessionManager = new FacebookSessionManager();
            jest.spyOn(spyFacebookSessionManager, "logout")
            const service = new UserLoginService(spyFacebookSessionManager)
            const user = new User("Denis")

            service.manualLogin(user)
            const response: string = service.logout(user)

            expect(response).toEqual("User logged out")
            expect(service.getLoggedUsers().length).toEqual(0)
            //Verificaciones propias de un espía. Verificaciones de comportamiento
            expect(spyFacebookSessionManager.logout).toHaveBeenCalledWith("Denis")
            expect(spyFacebookSessionManager.logout).toHaveBeenCalledTimes(1)
        })
        // Es interesante destacar que para este test con un dummy nos vale, porque no se hace uso de la dependencia externa
        it('should not logout a user if it´s not logged', () => {
            const service = new UserLoginService(new DummySessionManager())
            const user = new User("Denis")

            const response: string = service.logout(user)

            expect(response).toEqual("User not found")
        })
        describe('Mock Doubles', () => {
            it('should manage an UserNotFound exception', () => {
                const mockedError= new Error("ServiceNotAvailable")
                const mockedManager = new FacebookSessionManager()
                jest.spyOn(mockedManager, "logout").mockImplementation(()=> {throw new Error("ServiceNotAvailable")})
                const service = new UserLoginService(mockedManager)
                const user = new User("Denis")

                service.manualLogin(user)
                const response = service.logout(user)

                expect(response).toEqual("Service not available")
            })

            it('should manage a not logged exception', () => {
                const mockedManager = new FacebookSessionManager()
                jest.spyOn(mockedManager, "logout").mockImplementation(()=> {throw new Error("UserNotLoggedIn")})
                const service = new UserLoginService(mockedManager)
                const user = new User("Denis")

                service.manualLogin(user)
                const response = service.logout(user)

                expect(response).toEqual("User not logged in Facebook")
            })
        })
    })
})
