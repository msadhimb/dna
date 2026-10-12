/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  env: {
    MANTU_DATE: "2026-12-12T09:00:00",
    UNDUH_DATE: "2026-12-26T11:00:00",
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
