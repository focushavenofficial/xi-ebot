export default {
    apps: [{
      name: 'afk-bot',
      script: './bot.js',  // replace with your entry point
      watch: true,
      autorestart: true,
      max_restarts: 10,
      restart_delay: 5000,
      env: {
        NODE_ENV: 'production',
      },
    }]
  };
  