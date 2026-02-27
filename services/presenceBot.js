import { Client, GatewayIntentBits, Partials } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

export let botReady = false;

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences
  ],
  partials: [Partials.User, Partials.GuildMember]
});

/* ---------------------------
    SAFE LOGIN WITH RETRY
---------------------------- */
async function startBot() {
  try {
    await client.login(process.env.BOT_TOKEN);
  } catch (error) {
    console.error("❌ Bot login failed. Retrying in 5s:", error.message);
    setTimeout(startBot, 5000);
  }
}

startBot();

/* ---------------------------
      BOT READY EVENT
---------------------------- */
client.once("ready", () => {
  botReady = true;
  console.log(`⚡ Bot logged in as ${client.user.tag}`);
});

/* ---------------------------
   AUTO-RECONNECT HANDLERS
---------------------------- */
client.on("error", (err) => {
  console.log("❌ Discord client error:", err.message);
});

client.on("shardDisconnect", () => {
  botReady = false;
  console.log("⚠ Bot disconnected. Reconnecting...");
  startBot();
});

/* ---------------------------
    FETCH MEMBERS BY ROLE
---------------------------- */
export const fetchMembersByRole = async (roleId) => {
  if (!botReady) throw new Error("Bot not ready");

  const guild = await client.guilds.fetch(process.env.SERVER_ID);

  // Not forcing fetch reduces rate-limit risk
  await guild.members.fetch({ force: false });

  const role = guild.roles.cache.get(roleId);
  if (!role) return [];

  return role.members.map(member => {
    const avatar = member.user.avatar
      ? `https://cdn.discordapp.com/avatars/${member.id}/${member.user.avatar}.png`
      : `https://cdn.discordapp.com/embed/avatars/${Number(member.id) % 5}.png`;

    return {
      id: member.id,
      username: member.user.username,
      avatar,
      status: member.presence?.status || "offline",
      custom_status: member.presence?.activities?.[0]?.state || null,
      activity: member.presence?.activities?.[0]?.name || null,
    };
  });
};
