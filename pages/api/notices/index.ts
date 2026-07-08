import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  switch (req.method) {
    case 'GET':
      return getNotices(req, res);
    case 'POST':
      return createNotice(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getNotices(req: NextApiRequest, res: NextApiResponse) {
  try {
    const notices = await prisma.notice.findMany({
      orderBy: [
        { priority: 'desc' }, // Urgent before Normal (Wait, enum Urgent is 'Urgent', Normal is 'Normal', U > N so desc is Urgent first)
        { publishDate: 'desc' },
      ],
    });
    return res.status(200).json(notices);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function createNotice(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { title, body, category, priority, publishDate, image } = req.body;

    if (!title || title.trim() === '') return res.status(400).json({ message: 'Title is required' });
    if (!body || body.trim() === '') return res.status(400).json({ message: 'Body is required' });
    if (!category || !['Exam', 'Event', 'General'].includes(category)) return res.status(400).json({ message: 'Invalid category' });
    if (!priority || !['Normal', 'Urgent'].includes(priority)) return res.status(400).json({ message: 'Invalid priority' });
    if (!publishDate || isNaN(Date.parse(publishDate))) return res.status(400).json({ message: 'Invalid publish date' });

    const newNotice = await prisma.notice.create({
      data: {
        title,
        body,
        category,
        priority,
        publishDate: new Date(publishDate),
        image: image || null,
      },
    });

    return res.status(201).json(newNotice);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
