import { fetchCategories } from './order';

export default async function handler(req, res) {
  try {
    const categories = await fetchCategories();
    res.status(200).json(categories);
  } catch (error) {
    console.error('Failed to fetch categories', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
}
