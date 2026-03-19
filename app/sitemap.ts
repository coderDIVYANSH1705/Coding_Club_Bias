import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // Replace this with your actual production domain once deployed
  const baseUrl = 'https://codingclub.birlainstitute.co.in/';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0, // 1.0 is the highest priority, perfect for the landing page
    },
    // If you add more pages later (like an events or projects page), add them here:
    // {
    //   url: `${baseUrl}/events`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.8,
    // },
  ];
}