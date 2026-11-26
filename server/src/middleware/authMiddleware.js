import jwt from 'jsonwebtoken';
import { ENV } from '../config/env.js';
import { User } from '../models/User.js';

export async function authenticate(req, res, next) {
  try {
    let token = null;

    // 1. Check Authorization Bearer header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.accessToken) {
      token = req.cookies.accessToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. No token provided.',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, ENV.JWT_ACCESS_SECRET);
    
    // Check if user still exists and is active
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Account not found or deleted.',
      });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({
        success: false,
        message: 'Account is suspended. Contact administrator.',
      });
    }

    req.user = {
      userId: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
      timezone: user.timezone || 'UTC',
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Access token has expired',
        code: 'TOKEN_EXPIRED',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Invalid access token',
    });
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: requires one of [${allowedRoles.join(', ')}] permissions`,
      });
    }

    next();
  };
}

export default { authenticate, requireRole };
