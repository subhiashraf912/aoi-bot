module.exports = {
  apps: [
    {
      name: "Yelan",
      script: "dist/index.js",
      env: {
        NODE_ENV: "production",
        BOT_TOKEN:
          "MTA2ODkxNzkxMjIzNDEwMjgyNQ.GzubOi.z4mNvSz-Tc3JcMBhzRbhzBDrNrfSe5jsSzSHRs",
        LOG_LEVEL: "info",
        APP_ID: "1068917912234102825",
        GUILD_ID: "790786331580170241",
        MONGO_DB:
          "mongodb+srv://aze:-AzeSama2003-@cluster0.lynw9tq.mongodb.net/?retryWrites=true&w=majority",
      },
    },
    {
      name: "ShogunBot",
      script: "dist/index.js",
      env: {
        NODE_ENV: "production",
        BOT_TOKEN:
          "ODY1ODMyMTM0NTc3MDk0NzA2.GvkIaV.hIzuCtK0tggQJ8wwPMqitYjPfv6Hw_mYQKtFKU",
        LOG_LEVEL: "info",
        APP_ID: "1068917912234102825",
        GUILD_ID: "790786331580170241",
        MONGO_DB:
          "mongodb+srv://aze:-AzeSama2003-@cluster0.y5su7o3.mongodb.net/?retryWrites=true&w=majority",
      },
    },
  ],
};
