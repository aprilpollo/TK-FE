const GOOGLE_NONCE_KEY = "google_oauth_nonce";

/**
 * TokenManager - Utility for managing OAuth tokens and nonces
 */
const TokenManager = {
  /**
   * Set Google OAuth nonce in sessionStorage
   */
  setGoogleNonce(nonce: string): void {
    if (typeof window !== "undefined") {
      sessionStorage.setItem(GOOGLE_NONCE_KEY, nonce);
    }
  },

  /**
   * Get Google OAuth nonce from sessionStorage
   */
  getGoogleNonce(): string | null {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem(GOOGLE_NONCE_KEY);
    }
    return null;
  },

  /**
   * Clear Google OAuth nonce from sessionStorage
   */
  clearGoogleNonce(): void {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem(GOOGLE_NONCE_KEY);
    }
  },
};

export default TokenManager;
