import type { NextConfig } from "next";
import { version } from "./package.json";

const nextConfig: NextConfig = {
  env: {
    VERSION: version,
    ENV: process.env.NODE_ENV ?? "development",
    BUILD_TIME: new Date().toLocaleString("en-AU", {
      timeZone: "Australia/Melbourne",
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  },
};

export default nextConfig;
