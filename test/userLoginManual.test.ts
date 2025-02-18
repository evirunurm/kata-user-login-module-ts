import {UserLoginService} from "../src/userLoginService";
import { User } from '../src/user'
import { FacebookSessionManager } from '../src/facebookSessionManager'
import { UserLoginServiceMother } from './mothers/userLoginServiceMother'
import { UserMother } from './mothers/userMother'
import { ServiceNotAvailableError } from '../src/exceptions/ServiceNotAvailableError'
import { UserNotLoggedInError } from '../src/exceptions/UserNotLoggedInError'
import { FacebookSessionManagerDummy } from './doubles/facebookSessionManagerDummy'
import { FacebookSessionManagerStub } from './doubles/facebookSessionManagerStub'
import { FacebookSessionManagerFake } from './doubles/facebookSessionManagerFake'
import { FacebookSessionManagerSpy } from './doubles/facebookSessionManagerSpy'
import { FacebookSessionManagerMock } from './doubles/facebookSessionManagerMock'

// The comments in this file are meant to be a guide to
// help me understand the differences between the test-double types.

describe('User Service Login (Manual Doubles)', () => {
    let service: UserLoginService;
    let facebookSessionManager: FacebookSessionManager;

    beforeEach(() => {
        // By default, we'll be using a Dummy.
        // If any of its methods are called, it will throw an error.
        facebookSessionManager = new FacebookSessionManagerDummy()
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
            // We control the return value we need to test a specific scenario.
            // If we tried calling a non-planned method, it would throw an error.
            facebookSessionManager = new FacebookSessionManagerStub(100);
            service = new UserLoginService(facebookSessionManager)

            const user: User = UserMother.john()

            service.manualLogin(user)
            const externalUsers: number  = service.getExternalSessions()

            expect(externalUsers).toEqual(100)
        })

        it('should store a user as logged in when logging in into external session', () => {
            facebookSessionManager = new FacebookSessionManagerStub(0, true);
            service = new UserLoginService(facebookSessionManager)

            service.login('John', 'password')
            const loggedUsers = service.getLoggedUsers()

            expect(loggedUsers.length).toEqual(1)
        })

        it('should return success message when users are logged in into external session', () => {
            // We define the method implementation with core logic necessary for our scenario.
            const username = 'John'
            const password = 'password'
            facebookSessionManager = new FacebookSessionManagerFake()
            service = new UserLoginService(facebookSessionManager)

            const successMessage = service.login(username, password)

            expect(successMessage).toEqual('Login correct')
        })

        it('should return error message when users are not logged in into external session', () => {
            const username = 'John'
            facebookSessionManager = new FacebookSessionManagerFake()
            service = new UserLoginService(facebookSessionManager)

            const successMessage = service.login(username, 'wrongPassword')

            expect(successMessage).toEqual('Login incorrect')
        })
    })

    describe('When logging out a user', () => {
        it('should return log out message when passed a logged in user', () => {
            // We're checking whether the expected method was called.
            const user = UserMother.john()
            facebookSessionManager = new FacebookSessionManagerSpy(0, false, true)
            service = UserLoginServiceMother
              .withLoggedUser(user, facebookSessionManager)

            const message = service.logout(user)

            expect((facebookSessionManager as FacebookSessionManagerSpy).hasLogoutBeenCalled).toBeTruthy()
            expect(message).toEqual('User logged out')
        })

        it('should return a user not found message when passed a new user', () => {
            // FacebookSessionManager is a Stub here.
            const user = UserMother.john()
            facebookSessionManager = new FacebookSessionManagerStub(0, true)

            const message = service.logout(user)

            expect(message).toEqual('User not found')
        })

        it('should return a message when external session is not available', () => {
            const user = UserMother.john()
            const facebookSessionMock = new FacebookSessionManagerMock()
            facebookSessionMock.setLogoutImplementation(() => {
                throw new ServiceNotAvailableError()
            })
            service = UserLoginServiceMother
              .withLoggedUser(user, facebookSessionMock)

            const message = service.logout(user)

            expect(message).toEqual('Service not available')
        })

        it('should return a message when a logged in user cannot be logged out of external session', () => {
            const user = UserMother.john()

            const facebookSessionMock = new FacebookSessionManagerMock()
            facebookSessionMock.setLogoutImplementation(() => {
                throw new UserNotLoggedInError()
            })
            service = UserLoginServiceMother
              .withLoggedUser(user, facebookSessionMock)

            const message = service.logout(user)

            expect(message).toEqual('User not logged in')
        })
    })
})
