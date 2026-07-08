import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const noticeId = parseInt(id as string, 10);

  if (isNaN(noticeId)) {
    return res.status(400).json({ message: 'Invalid notice ID' });
  }

  switch (req.method) {
    case 'GET':
      return getNotice(noticeId, res);
    case 'PUT':
    case 'PATCH':
      return updateNotice(noticeId, req, res);
    case 'DELETE':
      return deleteNotice(noticeId, res);
    default:
      res.setHeader('Allow', ['GET', 'PUT', 'PATCH', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

async function getNotice(id: number, res: NextApiResponse) {
  try {
    const notice = await prisma.notice.findUnique({
      where: { id },
    });
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    return res.status(200).json(notice);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function updateNotice(id: number, req: NextApiRequest, res: NextApiResponse) {
  try {
    const { title, body, category, priority, publishDate, image } = req.body;

    // Server Side Validation
    if (title !== undefined && title.trim() === '') return res.status(400).json({ message: 'Title cannot be empty' });
    if (body !== undefined && body.trim() === '') return res.status(400).json({ message: 'Body cannot be empty' });
    if (category && !['Exam', 'Event', 'General'].includes(category)) return res.status(400).json({ message: 'Invalid category' });
    if (priority && !['Normal', 'Urgent'].includes(priority)) return res.status(400).json({ message: 'Invalid priority' });
    if (publishDate && isNaN(Date.parse(publishDate))) return res.status(400).json({ message: 'Invalid publish date' });

    const updateData: any = {};
    if (title) updateData.title = title;
    if (body) updateData.body = body;
    if (category) updateData.category = category;
    if (priority) updateData.priority = priority;
    if (publishDate) updateData.publishDate = new Date(publishDate);
    if (image !== undefined) updateData.image = image;

    const updatedNotice = await prisma.notice.update({
      where: { id },
      data: updateData,
    });

    return res.status(200).json(updatedNotice);
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Notice not found' });
    }
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}

async function deleteNotice(id: number, res: NextApiResponse) {
  try {
    await prisma.notice.delete({
      where: { id },
    });
    return res.status(200).json({ message: 'Notice deleted successfully' });
  } catch (error: any) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Notice not found' });
    }
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
