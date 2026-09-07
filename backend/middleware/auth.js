import jwt from 'jsonwebtoken';
import prisma from '../config/prisma.js';

// Simple JWT Auth Middleware using Prisma
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'metrx_super_secure_jwt_secret_key_2025'
      );

      // Attach user object (without password)
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          inspectorBadgeId: true,
          assignedZone: true
        }
      });

      if (!user) {
        return res.status(401).json({ success: false, message: 'User belonging to token no longer exists' });
      }

      req.user = user;
      return next();
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  // If no Bearer token, allow test/guest requests with header or fallback
  if (req.headers['x-user-role']) {
    req.user = {
      role: req.headers['x-user-role'],
      name: req.headers['x-user-name'] || 'User',
      email: req.headers['x-user-email'] || 'test@metrx.com'
    };
    return next();
  }

  return res.status(401).json({ success: false, message: 'Not authorized, no token' });
};

// Simple Role Authorization Middleware
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user ? req.user.role : 'Guest'} is not authorized to access this route`
      });
    }
    next();
  };
};
