import {RegisterInput} from "../types/RegisterInput";

export const validateRegisterInput = (registerInput: RegisterInput) => {
    if (!registerInput.email.includes('@')) {
        return {
            message: 'Invalid email address',
            errors: [
                {
                    field: 'email',
                    message: 'Email must include @ symbol'
                }
            ]
        }
    }

    if (registerInput.username.length <= 2) {
        return {
            message: 'Invalid username',
            errors: [
                {
                    field: 'username',
                    message: 'Length username must be greater than 2'
                }
            ]
        }
    }
    if (registerInput.username.includes('@')) {
        return {
            message: 'Invalid username',
            errors: [
                {
                    field: 'username',
                    message: 'Username must include @ symbol'
                }
            ]
        }
    }

    if (registerInput.password.length <= 2) {
        return {
            message: 'Invalid password address',
            errors: [
                {
                    field: 'email',
                    message: 'Length password must be greater than 2'
                }
            ]
        }
    }

    return null;
}