const { createVanillaExtractPlugin } = require("@vanilla-extract/next-plugin");

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  // Phone testing handled by dev script (binds to 0.0.0.0 + prints QR)
  // allowedDevOrigins only affects HMR WebSocket – page loads work fine without it
  images: {
    unoptimized: true,
  },
  output: "export",
  turbopack: {
    root: __dirname,
  },

  // Optional: Change links `/me` -> `/me/` and emit `/me.html` -> `/me/index.html`
  // trailingSlash: true,

  // Optional: Prevent automatic `/me` -> `/me/`, instead preserve `href`
  // skipTrailingSlashRedirect: true,

  // Optional: Change the output directory `out` -> `dist`
  // distDir: 'dist',
};

const withVanillaExtract = createVanillaExtractPlugin({
  unstable_turbopack: {
    mode: "auto",
  },
});

module.exports = withVanillaExtract(nextConfig);
