export const fetchMembersByRole = async (roleId) => {
  try {
    const guild = await client.guilds.fetch(process.env.SERVER_ID);
    const role = await guild.roles.fetch(roleId);

    if (!role) return [];

    return role.members.map((member) => ({
      id: member.id,
      username: member.user.username,
      avatar: `https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.png`,
    }));
  } catch (err) {
    console.error("Role fetch error:", err);
    return [];
  }
};