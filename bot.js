import mineflayer from 'mineflayer'
import app from "./server.js";

const bot = mineflayer.createBot({
  host: 'LonVilleSMP.aternos.me', // e.g., 'play.example.com'
  port: 30660,             // default Minecraft port
  username: 'AFK_Bot'      // can be an email if using a real account
        // password: 'your_password', // only if using a real Mojang/Microsoft account
});

bot.on('spawn', () => {
  console.log('Bot has spawned and is now AFK.');
          // Just jump every 30 seconds to prevent being kicked
  setInterval(() => {
    bot.setControlState('jump', true);
    setTimeout(() => bot.setControlState('jump', false), 500);
  }, 30000);
});

bot.on('end', () => {
  console.log('Bot was disconnected. Reconnecting...');
  setTimeout(() => {
    process.exit(); // optional: restart with pm2 or another manager
  }, 5000);
});

bot.on('error', err => console.log('Error:', err));


const PORT = 8000;

(async () => {
  try {
    const server = await app();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (e) {
    console.error("Connection error:", e);
  }
})();

setInterval(() => {
  console.log('14 minutes passed, running task.');

  fetch("https://minecraft-afk-bot-for-lonville-1.onrender.com/api/v1/uptime-keeper", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ important: 'data' })
  })
    .then(async res => {
      const text = await res.text(); // Get raw response
      console.log('Raw response:', text);

      try {
        const data = JSON.parse(text);
        console.log('Task complete:', data.message);
      } catch (err) {
        console.warn('Could not parse JSON:', err);
      }
    })
    .catch(err => console.error('Fetch error:', err));
}, 14 * 60 * 1000);
