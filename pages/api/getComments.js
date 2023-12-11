import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const response = await notion.databases.query({ database_id: databaseId });
      res.status(200).json(response.results);
    } catch (error) {
      console.error('Error retrieving comments:', error);
      res.status(500).json({ error: 'Error retrieving comments' });
    }
  } else {
    res.status(405).end();
  }
}
