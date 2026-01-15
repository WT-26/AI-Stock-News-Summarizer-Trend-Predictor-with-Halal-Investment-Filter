/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    "http://localhost",
    "http://localhost:3000",
    "http://192.168.56.1",
    "http://192.168.56.1:3000",
    "http://192.168.56.0", // optional (safe to include)
  ],
};

export default nextConfig;
