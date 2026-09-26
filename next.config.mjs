/** @type {import('next').NextConfig} */

const repoName =
  process.env.GITHUB_REPOSITORY?.split('/')[1] ||
  process.env.NEXT_PUBLIC_REPO_NAME ||
  'galeria-visual-limpia';

const isUserOrOrgPage = repoName.endsWith('.github.io');

const basePath =
  process.env.NODE_ENV === 'production'
    ? (isUserOrOrgPage ? '' : `/${repoName}`)
    : '';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
};

export default nextConfig;