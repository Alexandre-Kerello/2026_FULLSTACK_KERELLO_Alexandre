function decodeJwtPayload(token) {
  try {
    const payloadPart = token.split(".")[1];
    if (!payloadPart) return null;

    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(base64);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export function getValidSessionFromToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    return { isValid: false, token: null, userId: null };
  }

  const payload = decodeJwtPayload(token);
  if (!payload || !payload.id || !payload.exp) {
    return { isValid: false, token: null, userId: null };
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  if (payload.exp <= nowInSeconds) {
    localStorage.removeItem("token");
    return { isValid: false, token: null, userId: null };
  }

  return {
    isValid: true,
    token,
    userId: payload.id,
  };
}
