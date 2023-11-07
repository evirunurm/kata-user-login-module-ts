import {UserLoginService} from "../src/userLoginService";
import {User} from "../src/user";
import {DummySessionManager} from "../src/__doubles__/DummySessionManager";
import {StubSessionManager} from "../src/__doubles__/StubSessionManager";


describe('User Service Login', () => {

    it('should log a user', () => {
        const dummySessionManager= new DummySessionManager()
        const service = new UserLoginService(dummySessionManager)
        const user = new User("Javier")

        const response = service.manualLogin(user)

        expect(response).toEqual('User successfully logged in')
    })

    it('should not log an already logged user', () => {
        const dummySessionManager= new DummySessionManager()
        const service = new UserLoginService(dummySessionManager)
        const user = new User("Javier")
        service.manualLogin(user)

        const response = service.manualLogin(user)

        expect(response).toEqual('User already logged in')
    })

    it('should return us a logged users array',()=>{
        const dummySessionManager= new DummySessionManager()
        const service = new UserLoginService(dummySessionManager)
        const user = new User("Javier")
        const user2= new User("Denis")
        service.manualLogin(user)
        service.manualLogin(user2)

        const users=service.getLoggedUsers()

        expect(users).toEqual(["Javier","Denis"])
    })

    it('should return us the external sessions',()=>{
        const stubSessionManager= new StubSessionManager()
        const service = new UserLoginService(stubSessionManager)

        const loggedUsers=service.getExternalSessions()

        expect(loggedUsers).toEqual(4)
    })

})
