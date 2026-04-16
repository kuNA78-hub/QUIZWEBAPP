import jwt from 'jsonwebtoken';

// DIRECT HARDCODE - Use your actual secret from .env
const JWT_SECRET = 'lSRBZYqweDa1u8qOG8WU6BZdbZlaPzj569XqWBovXVh';
const JWT_EXPIRY = '7d';

console.log('🔐 JWT Helper initialized with secret:', JWT_SECRET ? 'YES' : 'NO');

export const generateToken = (userId, role) => {
    if (!JWT_SECRET) {
        console.error('❌ JWT_SECRET is missing!');
        throw new Error('JWT_SECRET is not configured');
    }
    return jwt.sign(
        { userId, role },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
    );
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

export const extractTokenFromHeader = (authHeader) => {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.split(' ')[1];
};