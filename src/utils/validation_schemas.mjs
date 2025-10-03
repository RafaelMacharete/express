export const createUserValidationSchema = {
    username: {
        isLength: {
            options: {
                min: 3,
                max: 15
            },
            errorMessage: 
                "Username must be at least 3 to 15 characters"
        },
        notEmpty: {
            errorMessage: "Username cannot be empty"
        },
        isString: {
            errorMessage: "Username must be a string"
        },
    },
    displayName:{
        notEmpty: true
    }
}