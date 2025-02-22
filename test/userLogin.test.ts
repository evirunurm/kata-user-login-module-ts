import {UserLoginService} from "../src/userLoginService";
import { User } from '../src/user'
import { FacebookSessionManager } from '../src/facebookSessionManager'
import { UserLoginServiceMother } from './mothers/userLoginServiceMother'
import { UserMother } from './mothers/userMother'
import { ServiceNotAvailableError } from '../src/exceptions/ServiceNotAvailableError'
import { UserNotLoggedInError } from '../src/exceptions/UserNotLoggedInError'

// The comments in this file are meant to be a guide to
// help me understand the differences between the test-double types.

jest.mock('../src/facebookSessionManager', () => ({
    // By default, FacebookSessionManager is a Dummy: It has no actual implementation.
    // If any of its methods were called, it would throw an error.
    FacebookSessionManager: jest.fn(),
}));

describe('User Service Login', () => {
    let service: UserLoginService;
    let facebookSessionManager: FacebookSessionManager;

    beforeEach(() => {
        facebookSessionManager = new FacebookSessionManager()
        service = new UserLoginService(facebookSessionManager)
    })

    describe('When logging in a user', () => {
        it('should log a user', () => {
            const user: User = UserMother.john()

            const result = service.manualLogin(user)

            expect(result).toEqual('User successfully logged in')
        })

        it('should not allow to log in an already logged in user', () => {
            const user: User = UserMother.john()

            service.manualLogin(user)
            const result = service.manualLogin(user)

            expect(result).toEqual('User already logged in')
        })

        it('should return currently logged in users', () => {
            const user: User = UserMother.john()

            service.manualLogin(user)
            const users: User [] = service.getLoggedUsers()

            expect(users.length).toEqual(1)
            expect(users[0].getUserName()).toEqual(user.getUserName())
        })

        it('should return currently logged in users in external sessions', () => {
            // We set the return value, transforming FacebookSessionManager into a Stub.
            // We control the return value we need to test a specific scenario.
            // If we tried calling another method, it would throw an error.
            facebookSessionManager.getSessions = jest.fn().mockReturnValue(100)
            const user: User = UserMother.john()

            service.manualLogin(user)
            const externalUsers: number  = service.getExternalSessions()

            expect(externalUsers).toEqual(100)
        })

        it('should store a user as logged in when logging in into external session', () => {
            // FacebookSessionManager is also a Stub here.
            facebookSessionManager.login = jest.fn().mockReturnValue(true)

            service.login('John', 'password')
            const loggedUsers = service.getLoggedUsers()

            expect(loggedUsers.length).toEqual(1)
        })

        it('should return success message when users are logged in into external session', () => {
            // We define the method implementation with core logic necessary for our scenario,
            // Transforming FacebookSessionManager into a Fake.
            const username = 'John'
            const password = 'password'
            facebookSessionManager.login = jest.fn().mockImplementation((
              _username: string,
              _password: string
            ) => {
                return _username === username && _password === password;
            })

            const successMessage = service.login(username, password)

            expect(successMessage).toEqual('Login correct')
        })

        it('should return error message when users are not logged in into external session', () => {
            // FacebookSessionManager is also a Fake here.
            const username = 'John'
            const password = 'password'
            facebookSessionManager.login = jest.fn().mockImplementation((
              _username: string,
              _password: string
            ) => {
                return _username === username && _password === password;
            })

            const successMessage = service.login(username, 'wrongPassword')

            expect(successMessage).toEqual('Login incorrect')
        })
    })

    describe('When logging out a user', () => {
        it('should return log out message when passed a logged in user', () => {
            // FacebookSessionManager is being used as a Spy.
            // We're checking whether the expected method was called, and how many times.
            const user = UserMother.john()
            facebookSessionManager.logout = jest.fn().mockReturnValue(true)
            service = UserLoginServiceMother
              .withLoggedUser(user, facebookSessionManager)

            const message = service.logout(user)

            expect(facebookSessionManager.logout).toHaveBeenCalledTimes(1);
            expect(message).toEqual('User logged out')
        })

        it('should return a user not found message when passed a new user', () => {
            // FacebookSessionManager is a Stub here.
            const user = UserMother.john()
            facebookSessionManager.logout = jest.fn().mockReturnValue(false)

            const message = service.logout(user)

            expect(message).toEqual('User not found')
        })

        it('should return a message when external session is not available', () => {
            // FacebookSessionManager is a Fake, since we control the method implementation.
            const user = UserMother.john()
            facebookSessionManager.logout = jest.fn().mockImplementation(() => {
                throw new ServiceNotAvailableError()
            })
            service = UserLoginServiceMother
              .withLoggedUser(user, facebookSessionManager)

            const message = service.logout(user)

            expect(message).toEqual('Service not available')
        })

        it('should return a message when a logged in user cannot be logged out of external session', () => {
            // FacebookSessionManager is also a Fake here.
            const user = UserMother.john()
            facebookSessionManager.logout = jest.fn().mockImplementation(() => {
                throw new UserNotLoggedInError()
            })
            service = UserLoginServiceMother
              .withLoggedUser(user, facebookSessionManager)

            const message = service.logout(user)

            expect(message).toEqual('User not logged in')
        })
    })
})
