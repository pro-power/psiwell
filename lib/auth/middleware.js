// lib/auth/middleware.js
import jwt from "jsonwebtoken";

export function verifyAdminToken(authHeader) {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { isValid: false, error: 'No valid authorization header' };
  }

  const token = authHeader.substring(7); // Remove 'Bearer ' prefix
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    console.error('JWT_SECRET not configured');
    return { isValid: false, error: 'Server configuration error' };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'psi-wellness-dashboard',
      audience: 'admin'
    });

    // Check if token is for admin access
    if (!decoded.admin) {
      return { isValid: false, error: 'Invalid token type' };
    }

    // Check token age (additional security check)
    const tokenAge = Date.now() - decoded.timestamp;
    const maxAge = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

    if (tokenAge > maxAge) {
      return { isValid: false, error: 'Token expired' };
    }

    return { 
      isValid: true, 
      decoded,
      adminData: {
        ip: decoded.ip,
        sessionId: decoded.sessionId,
        loginTime: new Date(decoded.timestamp)
      }
    };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return { isValid: false, error: 'Token expired' };
    } else if (error.name === 'JsonWebTokenError') {
      return { isValid: false, error: 'Invalid token' };
    } else {
      console.error('JWT verification error:', error);
      return { isValid: false, error: 'Token verification failed' };
    }
  }
}

export function requireAdmin(handler) {
  return async (request) => {
    const authHeader = request.headers.get('Authorization');
    const verification = verifyAdminToken(authHeader);

    if (!verification.isValid) {
      return new Response(
        JSON.stringify({ error: verification.error }),
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Add admin data to request for use in handlers
    request.adminData = verification.adminData;
    
    return handler(request);
  };
}