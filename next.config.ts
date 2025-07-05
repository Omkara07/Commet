import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "uploadthing.com",
      "utfs.io" // Add this line for UploadThing file URLs
    ],
    // Alternatively, use remotePatterns (recommended for newer Next.js versions):
    remotePatterns: [
      {
        protocol: "https",
        hostname: "uploadthing.com"
      },
      {
        protocol: "https",
        hostname: "utfs.io"
      }
    ]
  }
};

export default nextConfig;
