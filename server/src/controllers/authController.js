import bcrypt from 'bcryptjs';
import { User, GamificationProfile, Avatar, VirtualWorld, Inventory, VerificationToken, PasswordResetToken } from '../models/index.js';
import { AuthService } from '../services/authService.js';
import { EmailService } from '../services/emailService.js';
import { validateRegister, validateLogin, USER_ROLES } from '@lifeverse/shared';

export class AuthController {
  /**
   * User Registration
   */
  static async register(req, res, next) {
    try {
      const { username, email, password, timezone } = req.body;

      const validation = validateRegister(req.body);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: validation.errors,
        });
      }

      // Check existing email or username
      const existingUser = await User.findOne({
        $or: [{ email: email.toLowerCase() }, { username }],
      });

      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: existingUser.email === email.toLowerCase()
            ? 'Email already registered'
            : 'Username already taken',
        });
      }

      const passwordHash = await User.hashPassword(password);

      const user = await User.create({
        username,
        email: email.toLowerCase(),
        passwordHash,
        role: USER_ROLES.USER,
        status: 'active',
        timezone: timezone || 'UTC',
      });

      // Initialize player ecosystem
      await Promise.all([
        GamificationProfile.create({
          userId: user._id,
          totalXp: 0,
          level: 1,
          rank: 'Beginner',
          coins: 50,
        }),
        Avatar.create({
          userId: user._id,
        }),
        VirtualWorld.create({
          userId: user._id,
          theme: 'futuristic_city',
          buildings: [
            {
              buildingId: 'starter_hut',
              buildingType: 'learning_library',
              name: 'Starter Library',
              gridX: 4,
              gridY: 4,
              rotation: 0,
              level: 1,
              assetRef: 'learning_library_lv1',
            },
          ],
        }),
        Inventory.create({
          userId: user._id,
          items: [
            { itemId: 'outfit_novice_adventurer', itemType: 'avatar_item', source: 'starter' },
            { itemId: 'shoes_leather_boots', itemType: 'avatar_item', source: 'starter' },
          ],
        }),
      ]);

      // Issue verification token (email fallback)
      const verifyToken = await AuthService.createVerificationToken(user._id);
      EmailService.sendVerificationEmail(user.email, verifyToken).catch((err) => {
        console.warn('[Email] Verification email failed:', err.message);
      });

      // Create session
      const accessToken = AuthService.generateAccessToken(user);
      const session = await AuthService.createRefreshSession(user, {
        userAgent: req.headers['user-agent'] || '',
        ipAddress: req.ip,
        platform: req.headers['x-platform'] || 'web',
      });

      // Set cookie for web refresh
      res.cookie('refreshToken', session.rawRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(201).json({
        success: true,
        message: 'Account created successfully',
        data: {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            onboardingCompleted: user.onboardingCompleted,
            timezone: user.timezone,
          },
          accessToken,
          refreshToken: session.rawRefreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * User Login
   */
  static async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const validation = validateLogin(req.body);
      if (!validation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required',
          errors: validation.errors,
        });
      }

      const user = await User.findOne({ email: email.toLowerCase() }).select('+passwordHash');
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
        });
      }

      if (user.status === 'suspended') {
        return res.status(403).json({
          success: false,
          message: 'Account suspended. Contact support.',
        });
      }

      user.lastLoginAt = new Date();
      await user.save();

      const accessToken = AuthService.generateAccessToken(user);
      const session = await AuthService.createRefreshSession(user, {
        userAgent: req.headers['user-agent'] || '',
        ipAddress: req.ip,
        platform: req.headers['x-platform'] || 'web',
      });

      res.cookie('refreshToken', session.rawRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        success: true,
        message: 'Logged in successfully',
        data: {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            onboardingCompleted: user.onboardingCompleted,
            timezone: user.timezone,
          },
          accessToken,
          refreshToken: session.rawRefreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Administrator Login (Separate Endpoint)
   */
  static async adminLogin(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({
        email: email.toLowerCase(),
        role: USER_ROLES.ADMIN,
      }).select('+passwordHash');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid administrator credentials',
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid administrator credentials',
        });
      }

      const accessToken = AuthService.generateAccessToken(user);
      const session = await AuthService.createRefreshSession(user, {
        userAgent: req.headers['user-agent'] || '',
        ipAddress: req.ip,
        platform: 'web',
      });

      res.cookie('refreshToken', session.rawRefreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        success: true,
        message: 'Admin authentication successful',
        data: {
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
          accessToken,
          refreshToken: session.rawRefreshToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Rotating Refresh Token Endpoint
   */
  static async refreshToken(req, res, next) {
    try {
      const token = req.body.refreshToken || req.cookies?.refreshToken;
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token required',
        });
      }

      const result = await AuthService.rotateRefreshToken(token, {
        userAgent: req.headers['user-agent'] || '',
        ipAddress: req.ip,
        platform: req.headers['x-platform'] || 'web',
      });

      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        success: true,
        message: 'Token refreshed',
        data: {
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
          user: {
            id: result.user._id,
            username: result.user.username,
            email: result.user.email,
            role: result.user.role,
            onboardingCompleted: result.user.onboardingCompleted,
          },
        },
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: error.message || 'Token refresh failed',
      });
    }
  }

  /**
   * Logout
   */
  static async logout(req, res, next) {
    try {
      const token = req.body.refreshToken || req.cookies?.refreshToken;
      if (token) {
        const tokenHash = AuthService.hashToken(token);
        await RefreshSession.updateOne({ tokenHash }, { revokedAt: new Date() });
      }

      res.clearCookie('refreshToken');
      return res.json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Logout from all devices
   */
  static async logoutAll(req, res, next) {
    try {
      await AuthService.revokeAllUserSessions(req.user.userId);
      res.clearCookie('refreshToken');
      return res.json({
        success: true,
        message: 'Logged out from all devices',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Current Authenticated User (Me)
   */
  static async getMe(req, res, next) {
    try {
      const user = await User.findById(req.user.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const profile = await GamificationProfile.findOne({ userId: user._id });

      return res.json({
        success: true,
        data: {
          user,
          gamification: profile,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Forgot Password
   */
  static async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email: email?.toLowerCase() });
      if (user) {
        const resetToken = await AuthService.createPasswordResetToken(user._id);
        EmailService.sendPasswordResetEmail(user.email, resetToken).catch((err) => {
          console.warn('[Email] Reset email delivery error:', err.message);
        });
      }

      // Always return 200 for security (prevent email enumeration)
      return res.json({
        success: true,
        message: 'If the email exists, a password reset link has been sent.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reset Password
   */
  static async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword || newPassword.length < 8) {
        return res.status(400).json({
          success: false,
          message: 'Valid token and new password (min 8 chars) required',
        });
      }

      const resetRecord = await PasswordResetToken.findOne({
        token,
        expiresAt: { $gt: new Date() },
      });

      if (!resetRecord) {
        return res.status(400).json({
          success: false,
          message: 'Password reset token is invalid or has expired',
        });
      }

      const user = await User.findById(resetRecord.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      user.passwordHash = await User.hashPassword(newPassword);
      await user.save();

      // Revoke token and all active sessions
      await PasswordResetToken.deleteOne({ _id: resetRecord._id });
      await AuthService.revokeAllUserSessions(user._id);

      return res.json({
        success: true,
        message: 'Password reset successfully. Please log in with your new password.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Verify Email
   */
  static async verifyEmail(req, res, next) {
    try {
      const { token } = req.body;
      if (!token) {
        return res.status(400).json({ success: false, message: 'Verification token required' });
      }

      const record = await VerificationToken.findOne({
        token,
        expiresAt: { $gt: new Date() },
      });

      if (!record) {
        return res.status(400).json({
          success: false,
          message: 'Verification token is invalid or has expired',
        });
      }

      await User.findByIdAndUpdate(record.userId, { isEmailVerified: true });
      await VerificationToken.deleteOne({ _id: record._id });

      return res.json({
        success: true,
        message: 'Email verified successfully!',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
