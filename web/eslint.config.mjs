import nextConfig from "eslint-config-next";

const config = [...nextConfig];

config.push({
  rules: {
    "@next/next/no-img-element": "off",
  },
});

export default config;
