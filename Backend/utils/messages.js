module.exports = {
    AUTHENTICATION_FAILED: {
        code: 401,
        message: 'Authentication failed. Please login with valid credentials.',
        success: false,
    },
    SUCCESSFUL_EMAIL_SENT: {
        code: 200,
        message: 'Email sent successfully.',
        success: true,
    },
    SUCCESSFUL_LOGIN: {
        code: 200,
        message: 'Successfully logged in',
        success: true,
    },
    INTERNAL_SERVER_ERROR: {
        code: 500,
        message: 'Something unexpected happened',
        success: false,
    },
    UNAUTHORIZED: {
        code: 401,
        message: 'You are not authorized to perform this action',
        success: false,
    },
    USER_ALREADY_EXIST: {
        code: 409,
        message: 'The user already exist',
        success: false,
    },
    SUCCESSFUL_DELETE: {
        code: 200,
        message: 'Successfully deleted',
        success: true,
    },
    SUCCESSFUL_CREATE: {
        code: 201,
        message: 'Successfully created',
        success: true,
    },
    SUCCESSFUL_UPDATE: {
        code: 200,
        message: 'Updated successfully',
        success: true,
    },
    ERROR_UPDATE: {
        code: 400,
        message: 'Cannot update the password',
        success: false,
    },
    SUCCESSFUL: {
        code: 200,
        success: true,
        message: 'Successfully completed',
    },
    NOT_FOUND: {
        code: 404,
        success: true,
        message: 'Requested API not found',
    },
    ALREADY_EXIST: {
        code: 200,
        success: true,
        message: 'Already exists',
    },
    FORBIDDEN: {
        code: 403,
        message: 'You are not authorized to complete this action',
        success: false,
    },
    BAD_REQUEST: {
        code: 400,
        message: 'Bad request. Please try again with valid parameters',
        success: false,
    },
    IN_COMPLETE_REQUEST: {
        code: 422,
        message: 'Required parameter missing',
        success: false,
    },
    NOT_ACTIVE: {
        code: 403,
        message: 'Your account is not active. Please click on the activation link emailed to you.',
        success: false,
    },
    INVALID_PICTURE_TYPE: {
        code: 400,
        message: 'Only images of type .jpeg, .jpg or .png are allowed',
        success: false,
    },
};
