import mineflayer from "mineflayer";
import { pathfinder, Movements, goals } from "mineflayer-pathfinder";
import { Vec3 } from "vec3";

let bot;

function createBot() {
  bot = mineflayer.createBot({
    host: process.env.MC_HOST || "XIE_Crew69.aternos.me", // replace with your server IP
    port: parseInt(process.env.MC_PORT) || 53195, // Aternos default port
    username: process.env.MC_USERNAME || "XI_E_SERVICE", // Bot username
    version: "1.21.4"
  });

  bot.loadPlugin(pathfinder);

  bot.once("spawn", () => {
    console.log("✅ Bot has spawned and is now AFK.");
    bot.chat("Welcome XI-E Crew"); // Send welcome message
    startAfkTasks();
  });

  bot.on("end", () => {
    console.log("❌ Bot disconnected. Reconnecting in 10s...");
    setTimeout(createBot, 10000); // Auto reconnect after 10s
  });

  bot.on("error", (err) => {
    console.log("⚠️ Bot error:", err.message);
  });
}

function startAfkTasks() {
  const mcData = require("minecraft-data")(bot.version);
  const defaultMove = new Movements(bot, mcData);
  bot.pathfinder.setMovements(defaultMove);

  // Jump every 5 seconds
  setInterval(() => {
    bot.setControlState("jump", true);
    setTimeout(() => bot.setControlState("jump", false), 500);
  }, 5000);

  // Walk 3 blocks ahead then stop
  setInterval(() => {
    const pos = bot.entity.position.offset(3, 0, 0); // Move forward in +X direction
    bot.pathfinder.setGoal(new goals.GoalBlock(pos.x, pos.y, pos.z));
  }, 8000);

  // Look around randomly
  setInterval(() => {
    const yaw = Math.random() * Math.PI * 2;
    const pitch = (Math.random() - 0.5) * Math.PI / 2;
    bot.look(yaw, pitch, true);
  }, 10000);

  // Chat every 14 minutes
  setInterval(() => {
    console.log("⏰ 14 minutes passed, sending keep-alive chat.");
    bot.chat("Still alive! XI-E Crew ✨");
  }, 14 * 60 * 1000);
}

// Start the bot
createBot();
