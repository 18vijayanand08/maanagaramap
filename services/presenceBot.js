// src/services/presenceBot.js
import { Client, GatewayIntentBits, Partials } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

export let botReady = false;

// ==========================
// CLIENT SETUP
// ==========================
export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ],
  partials: [Partials.User, Partials.GuildMember]
});

// ==========================
// BOT LOGIN
// ==========================
async function startBot() {
  try {
    console.log("🔄 Logging in bot...");
    await client.login(process.env.BOT_TOKEN);
    console.log("➡ Login request sent");
  } catch (err) {
    console.error("❌ Bot login failed:", err);
  }
}

startBot();

// ==========================
// READY EVENT
// ==========================
client.on("ready", () => {
  botReady = true;
  console.log(`⚡ Bot logged in as ${client.user.tag}`);
});

// ==========================
// FETCH MEMBERS BY ROLE (ONE FUNCTION ONLY)
// ==========================
export const fetchMembersByRole = async (roleId) => {
  if (!botReady) {
    console.log("⚠ Bot not ready");
    throw new Error("Bot not ready");
  }

  try {
    const guild = await client.guilds.fetch(process.env.SERVER_ID);

    // Fetch all members for presence
    await guild.members.fetch();

    const role = guild.roles.cache.get(roleId);
    if (!role) return [];

    return role.members.map((member) => ({
      id: member.id,
      username: member.user.username,
      avatar: member.user.avatar
        ? `https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.png`
        : `https://cdn.discordapp.com/embed/avatars/${Number(member.id) % 5}.png`,
      status: member.presence?.status || "offline",
      custom_status: member.presence?.activities?.[0]?.state || null,
      activity: member.presence?.activities?.[0]?.name || null
    }));
  } catch (err) {
    console.error("❌ Error fetching members:", err);
    return [];
  }
};
