import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    allowedDevOrigins: ["*.ngrok-free.app"],
    images: {
        remotePatterns: [new URL("https://*.ufs.sh/f/*"), new URL("https://utfs.io/f/*")],
    },
};

export default nextConfig;
