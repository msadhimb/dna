/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  env: {
    NEXT_PUBLIC_MANTU_DATE: "2026-12-12T09:00:00",
    NEXT_PUBLIC_UNDUH_DATE: "2026-12-26T11:00:00",
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
