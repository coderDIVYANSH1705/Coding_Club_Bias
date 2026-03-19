import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://codingclub.birlainstitute.co.in/'; // Update this to your actual production domain

  return {
    rules: {
      userAgent: '*', // Applies to all search engine bots (Google, Bing, etc.)
      allow: '/',     // Allows them to crawl the entire site
      disallow: ['/api/', '/_next/'], // Prevents them from crawling backend routes or build files
    },
    sitemap: `${baseUrl}/sitemap.xml`, // Points bots to the sitemap you just created
  };
}