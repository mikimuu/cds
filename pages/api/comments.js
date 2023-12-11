import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_API_KEY });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, text } = req.body;

    try {
      await notion.pages.create({
        parent: { database_id: process.env.NOTION_DATABASE_ID },
        properties: {
          'Name': {
            title: [
              {
                text: {
                  content: name,
                },
              },
            ],
          },
          '日付': {
            date: {
              start: new Date().toISOString(),
            },
          },
          'テキスト': {
            rich_text: [
              {
                text: {
                  content: text,
                },
              },
            ],
          },
        },
      });
      res.status(200).json({ message: 'Comment added successfully' });
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ error: 'Error adding comment' });
    }
  } else {
    res.status(405).end();
  }
}
