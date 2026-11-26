import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { User, RefreshSession, VerificationToken, PasswordResetToken } from '../models/index.js';
import { ENV } from '../config/env.js';

export class AuthService {
  /**
   * Hash a raw token using SHA-256 for secure storage.
   */
  static hashToken(rawToken) {
    return crypto.createHash('sha256').update(rawToken).digest('hex');
  }

  /**
   * Generate short-lived JWT access token
   */
  static generateAccessToken(user) {
    return jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        username: user.username,
        role: user.role,
      },
      ENV.JWT_ACCESS_SECRET,
      { expiresIn: ENV.JWT_ACCESS_EXPIRY }
    );
  }

  /**
   * Generate cryptographically secure rotating refresh token and store hash in DB
   */
  static async createRefreshSession(user, deviceInfo = {}, replacesTokenHash = null) {
    const rawRefreshToken = crypto.randomBytes(40).toString('hex');
    const tokenHash = this.hashToken(rawRefreshToken);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await RefreshSession.create({
      userId: user._id,
      tokenHash,
      deviceInfo,
      expiresAt,
      replacesTokenHash,
    });

    return { rawRefreshToken, tokenHash, expiresAt };
  }

  /**
   * Rotate refresh token: verify existing, revoke it, detect reuse, issue new pair.
   */
  static async rotateRefreshToken(rawRefreshToken, deviceInfo = {}) {
    const tokenHash = this.hashToken(rawRefreshToken);

    const session = await RefreshSession.findOne({ tokenHash });

    if (!session) {
      throw new Error('Invalid refresh token');
    }

    // Reuse detection: If token was already revoked, someone is replaying it!
    if (session.revokedAt) {
      console.warn(`[Security Alert] Refresh token reuse detected for user ${session.userId}. Revoking all sessions.`);
      await RefreshSession.updateMany(
        { userId: session.userId },
        { revokedAt: new Date() }
      );
      throw new Error('Refresh token reuse detected. All sessions revoked.');
    }

    if (new Date() > session.expiresAt) {
      throw new Error('Refresh token has expired');
    }

    const user = await User.findById(session.userId);
    if (!user || user.status === 'suspended') {
      throw new Error('User account is invalid or suspended');
    }

    // Revoke the old session
    session.revokedAt = new Date();
    await session.save();

    // Create a new session with link
    const newSession = await this.createRefreshSession(user, deviceInfo, tokenHash);
    const newAccessToken = this.generateAccessToken(user);

    return {
      accessToken: newAccessToken,
      refreshToken: newSession.rawRefreshToken,
      user,
    };
  }

  /**
   * Revoke all refresh sessions for a user (e.g. on password change or logout from all devices)
   */
  static async revokeAllUserSessions(userId) {
    return RefreshSession.updateMany(
      { userId, revokedAt: null },
      { revokedAt: new Date() }
    );
  }

  /**
   * Create an email verification token
   */
  static async createVerificationToken(userId) {
    await VerificationToken.deleteMany({ userId });
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    await VerificationToken.create({ userId, token, expiresAt });
    return token;
  }

  /**
   * Create a password reset token
   */
  static async createPasswordResetToken(userId) {
    await PasswordResetToken.deleteMany({ userId });
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await PasswordResetToken.create({ userId, token, expiresAt });
    return token;
  }
}

export default AuthService;
