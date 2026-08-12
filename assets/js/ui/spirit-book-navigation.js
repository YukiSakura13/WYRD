export const SPIRIT_BOOK_NAVIGATION_LOCK_MS = 280;

export function acceptSpiritBookNavigation(uiState, now = Date.now()) {
  const lockedUntil = Number(uiState.spiritBookNavigationLockedUntil) || 0;

  if (now < lockedUntil) {
    return false;
  }

  uiState.spiritBookNavigationLockedUntil = now + SPIRIT_BOOK_NAVIGATION_LOCK_MS;
  return true;
}
