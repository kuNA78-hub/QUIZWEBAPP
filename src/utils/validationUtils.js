/**
 * VALIDATION UTILITIES - Form validation helpers
 */

export const validateEmail = (email) => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return regex.test(email);
};

export const validatePassword = (password) => {
    return password && password.length >= 6;
};

export const validateUsername = (username) => {
    return username && username.length >= 3 && username.length <= 30;
};

export const getValidationErrors = (formData) => {
    const errors = {};
    
    if (formData.username && !validateUsername(formData.username)) {
        errors.username = 'Username must be 3-30 characters';
    }
    
    if (formData.email && !validateEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
    }
    
    if (formData.password && !validatePassword(formData.password)) {
        errors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.confirmPassword && formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
};