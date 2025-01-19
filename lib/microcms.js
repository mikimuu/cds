import { createClient } from 'microcms-js-sdk';

export const client = createClient({
  serviceDomain: process.env.NEXT_PUBLIC_MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.NEXT_PUBLIC_MICROCMS_API_KEY,
});

export async function getNewBlogPosts() {
  try {
    const response = await client.get({
      endpoint: 'cds',
      queries: { limit: 100 }
    });
    return response.contents || [];
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getBlogPost(id) {
  try {
    const post = await client.get({
      endpoint: 'cds',
      contentId: id,
    });
    return post;
  } catch (error) {
    console.error(`Error fetching blog post ${id}:`, error);
    return null;
  }
} 