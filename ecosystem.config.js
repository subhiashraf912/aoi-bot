module.exports = {
  apps: [
    {
      name: "AoiBot",
      script: "dist/index.js",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
