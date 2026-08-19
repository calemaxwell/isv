/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The workspace mount does not permit unlink during Next's export cleanup,
  // so CI/verification builds redirect output with NEXT_DIST_DIR.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  /**
   * Storybook is built into public/storybook by the vercel-build script and
   * served from the same domain. Next serves public/ at the root but will
   * not resolve a directory to its index, so /storybook needs sending to the
   * file explicitly.
   */
  async redirects() {
    return [
      {
        source: "/storybook",
        destination: "/storybook/index.html",
        permanent: false,
      },
    ];
  },
  images: {
    // ISV's own imagery, served from The Parents Website. No stock, so no
    // licensing caveat needed before the pitch.
    remotePatterns: [
      { protocol: "https", hostname: "theparentswebsite.com.au" },
    ],
  },
};
export default nextConfig;
