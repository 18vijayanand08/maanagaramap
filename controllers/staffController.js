import { fetchMembersByRole, botReady } from "../services/presenceBot.js";

// MEMORY CACHE FOR EACH ROLE
const roleCache = {}; 
const CACHE_TTL = 60 * 1000; // 1 minute EXACT

export const getMembersByRole = async (req, res) => {
  if (!botReady) {
    return res.status(503).json({
      success: false,
      message: "Bot is starting, try again in 2 seconds",
    });
  }

  const { roleId } = req.params;
  const now = Date.now();

  // -------------------------
  // USE CACHE (VALID FOR 1 MINUTE)
  // -------------------------
  if (
    roleCache[roleId] &&
    now - roleCache[roleId].timestamp < CACHE_TTL
  ) {
    return res.json({
      success: true,
      members: roleCache[roleId].data,
      cached: true,
    });
  }

  try {
    // -------------------------
    // FETCH FROM DISCORD API
    // -------------------------
    const members = await fetchMembersByRole(roleId);

    // -------------------------
    // SAVE INTO CACHE FOR 60s
    // -------------------------
    roleCache[roleId] = {
      timestamp: now,
      data: members,
    };

    return res.json({
      success: true,
      members,
      cached: false,
    });

  } catch (error) {
    console.log("Role fetch error:", error);

    // -------------------------
    // FALLBACK TO OLD CACHE IF EXISTS
    // -------------------------
    if (roleCache[roleId]) {
      return res.json({
        success: true,
        members: roleCache[roleId].data,
        cached: "fallback",
      });
    }

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
