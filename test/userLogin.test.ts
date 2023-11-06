import {UserLoginService} from "../src/userLoginService";
import {User} from "../src/user";


describe('User Service Login', () => {

    it('should log a user', () => {
        const service = new UserLoginService()
        const user = new User("Javier")

        const response = service.manualLogin(user)

        expect(response).toEqual('User successfully logged in')
    })

    it('should not log an already logged user', () => {
        const service = new UserLoginService()
        const user = new User("Javier")
        service.manualLogin(user)

        const response = service.manualLogin(user)

        expect(response).toEqual('User already logged in')
    })

    it('should return us a logged users array',()=>{
        const service = new UserLoginService()
        const user = new User("Javier")
        const user2= new User("Denis")
        service.manualLogin(user)
        service.manualLogin(user2)

        const users=service.getLoggedUsers()

        expect(users).toEqual(["Javier","Denis"])
    })

})
