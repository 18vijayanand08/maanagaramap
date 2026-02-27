import { Client, GatewayIntentBits, Partials } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

// DEBUG: Print environment variables
console.log("==================================================");
console.log("BOT START DEBUG LOGS");
console.log("BOT_TOKEN:", process.env.BOT_TOKEN ? "LOADED" : "MISSING");
console.log("SERVER_ID:", process.env.SERVER_ID || "MISSING");
console.log("==================================================");

export let botReady = false;

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ],
  partials: [Partials.User, Partials.GuildMember]
});

// DEBUG: Track all errors
client.on("error", (err) => console.error("CLIENT ERROR:", err));
client.on("shardError", (err) => console.error("SHARD ERROR:", err));
client.on("warn", (msg) => console.warn("CLIENT WARN:", msg));

/* ---------------------------
    SAFE LOGIN WITH DEBUG
---------------------------- */
async function startBot() {
  console.log("🔄 Trying to login bot with token length:", process.env.BOT_TOKEN?.length);

  try {
    await client.login(process.env.BOT_TOKEN);
    console.log("➡ Login request sent to Discord...");
  } catch (err) {
    console.error("❌ Login failed:", err);
    setTimeout(startBot, 5000);
  }
}

startBot();

/* ---------------------------
   READY EVENT
---------------------------- */
client.on("ready", () => {
  console.log("🎉 READY EVENT FIRED — BOT IS ONLINE");
  botReady = true;
});

/* ---------------------------
   FETCH MEMBERS BY ROLE
---------------------------- */
export const fetchMembersByRole = async (roleId) => {
  if (!botReady) {
    console.log("❌ fetchMembersByRole blocked — bot not ready");
    throw new Error("Bot not ready");
  }

  const guild = await client.guilds.fetch(process.env.SERVER_ID);

  await guild.members.fetch();

  const role = guild.roles.cache.get(roleId);
  if (!role) return [];

  return role.members.map(member => ({
    id: member.id,
    username: member.user.username,
    avatar: member.user.avatar
      ? `https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.png`
      : `https://cdn.discordapp.com/embed/avatars/${Number(member.id) % 5}.png`,
    status: member.presence?.status || "offline",
    custom_status: member.presence?.activities?.[0]?.state || null,
    activity: member.presence?.activities?.[0]?.name || null,
  }));
};
