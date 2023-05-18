/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	async redirects() {
		return [
			{
				source: '/',
				destination: 'https://www.anotioneer.com/',
				permanent: false,
			},
			{
				source: '/:path((?!api/).*)',
				destination: 'https://www.anotioneer.com/',
				permanent: false,
			},
		];
	},
};

module.exports = nextConfig;
