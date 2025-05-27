import mineflayer from 'mineflayer'
import app from "./server.js";
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { v4 as uuidv4 } from 'uuid';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function restartApp() {
  console.log('Restarting bot...');
  spawn('node', [__filename], {
    stdio: 'inherit',
    cwd: __dirname,
  });
  process.exit();
}

const bot = mineflayer.createBot({
  host: 'LonVilleSMP.aternos.me', // e.g., 'play.example.com'
  port: 30660,             // default Minecraft port
  username: `AFK_Bot`,   // can be an email if using a real account
   version: '1.20.4'
        // password: 'your_password', // only if using a real Mojang/Microsoft account
});

bot.on('spawn', () => {
  console.log('Bot has spawned and is now AFK.');
  const controls = ['forward', 'back', 'left', 'right', 'jump'];
  // Just jump every 30 seconds to prevent being kicked
  setInterval(() => {
    const randomControl = controls[Math.floor(Math.random() * controls.length)];
    const randomDuration = Math.floor(Math.random() * (8000 - 2000 + 1)) + 2000;
    bot.setControlState(randomControl, true);
    setTimeout(() => bot.setControlState(randomControl, false), randomDuration);
  }, 12000);
});

bot.on('end', (reason) => {
  console.log('Bot was disconnected. Reason:', reason);
  setTimeout(() => {
    restartApp();
  }, 5000);
});

bot.on('kicked', (reason) => {
  console.log('Kicked from server:', reason);
});

bot.on('error', err => {
  console.log('Error:', err);
  restartApp()
});


const PORT = 8000;

(async () => {
  try {
    const server = await app();
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (e) {
    console.error("Connection error:", e);
    restartApp()
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
        restartApp()
      }
    })
    .catch(err => console.error('Fetch error:', err));
}, 14 * 60 * 1000);
