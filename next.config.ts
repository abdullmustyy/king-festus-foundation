import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    allowedDevOrigins: ["*.ngrok-free.app"],
    images: {
        remotePatterns: [new URL("https://hcyular991.ufs.sh/f/*")],
    },
};

export default nextConfig;
