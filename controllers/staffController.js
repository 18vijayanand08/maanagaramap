import { fetchMembersByRole, botReady } from "../services/presenceBot.js";

export const getMembersByRole = async (req, res) => {
  if (!botReady) {
    return res.status(503).json({
      success: false,
      message: "Bot is starting, try again in 2 seconds"
    });
  }

  try {
    const { roleId } = req.params;
    const members = await fetchMembersByRole(roleId);

    return res.json({ success: true, members });
  } catch (error) {
    console.log("Role fetch error:", error);
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
