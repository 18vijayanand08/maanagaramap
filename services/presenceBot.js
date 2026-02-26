import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

export let botReady = false;

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ]
});

// Login bot
client.login(process.env.BOT_TOKEN).catch(err => {
  console.error("Bot login failed:", err);
});

// When bot is ready
client.on("ready", () => {
  botReady = true;
  console.log(`⚡ Bot logged in as ${client.user.tag}`);
});

/* ---------------------------
    FETCH MEMBERS BY ROLE
---------------------------- */
export const fetchMembersByRole = async (roleId) => {
  if (!botReady) {
    throw new Error("Bot not ready");
  }

  const guild = await client.guilds.fetch(process.env.SERVER_ID);
  await guild.members.fetch(); // Important: fetch all members

  const role = guild.roles.cache.get(roleId);
  if (!role) return [];

  return role.members.map(member => ({
    id: member.id,
    username: member.user.username,
    avatar: `https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.png`,
    status: member.presence?.status || "offline",
    custom_status: member.presence?.activities?.[0]?.state || null,
    activity: member.presence?.activities?.[0]?.name || null,
  }));
};
