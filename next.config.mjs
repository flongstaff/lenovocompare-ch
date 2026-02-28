import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: false,
});

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  poweredByHeader: false,
  ...(isGitHubPages && {
    basePath: "/lenovocompare-ch",
    assetPrefix: "/lenovocompare-ch",
  }),
  images: {
    unoptimized: true,
  },
};

export default withBundleAnalyzer(nextConfig);
