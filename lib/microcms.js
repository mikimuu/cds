import { createClient } from 'microcms-js-sdk';

export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
});

export async function getNewBlogPosts(limit = 100) {
  try {
    const response = await client.get({
      endpoint: 'blog',
      queries: { limit },
    });
    return response.contents || [];
  } catch (error) {
    console.error('Error fetching from microCMS:', error);
    return [];
  }
} 