/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "znefanspvasmutcrbjmu.supabase.co",
      },
    ],
  },
}

export default nextConfig
