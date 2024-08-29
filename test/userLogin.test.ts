import {UserLoginService} from "../src/userLoginService";


describe('User Service Login', () => {
    const service = new UserLoginService()

    it('should log a user', () => {
        expect(service.manualLogin()).toEqual('user logged')
    })

})
