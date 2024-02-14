export const createUserValidationSchema = {
    username: {
        isLength: {
            options: {
                min: 5,
                max: 32
            },
            errorMessage: "Username must contain between 5 and 32 characters"
        },
        notEmpty: {
            errorMessage: "Username cannot be empty"
        },
        isString: {
            errorMessage: "Username cannot be empty"
        },
    },
    displayName: {
        notEmpty: {
            errorMessage: "displayName cannot be empty"
        }
    }
}

export const checkQueryParamsSchema = {
    filter: {
        isString: {
            errorMessage: "Must be a string"
        },
        notEmpty: {
            errorMessage: "Should not be empty"
        },
        isLength: {
            options: {
                min: 3,
                max: 10
            },
            errorMessage: "Must container between 3 and 10 characters"
        }
    }
}