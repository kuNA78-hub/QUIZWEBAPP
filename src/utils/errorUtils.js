/**
 * ERROR UTILITIES - Handle error messages consistently
 */

export const getErrorMessage = (error) => {
    if (error.response) {
        return error.response.data?.message || 'Server error occurred';
    }
    if (error.request) {
        return 'Network error. Please check your connection.';
    }
    return error.message || 'An unexpected error occurred';
};

export const isUnauthorizedError = (error) => {
    return error.response?.status === 401;
};

export const isValidationError = (error) => {
    return error.response?.status === 400;
};