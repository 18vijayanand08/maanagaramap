import { fetchMembersByRole } from "../services/presenceBot.js";

export const getMembersByRole = async (req, res) => {
  try {
    const roleId = req.params.roleId;
    const members = await fetchMembersByRole(roleId);

    return res.json({
      success: true,
      members,
    });
  } catch (err) {
    console.error("Role fetch error:", err);
    return res.status(500).json({ success: false, error: "Failed to fetch members" });
  }
};