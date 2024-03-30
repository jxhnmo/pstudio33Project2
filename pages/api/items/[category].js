import { fetchItems } from '../order';

export default async function handler(req, res) {
  const { category } = req.query;
  try {
    const items = await fetchItems(category);
    res.status(200).json(items);
  } catch (error) {
    console.error(`Failed to fetch items for category ${category}`, error);
    res.status(500).json({ message: `Failed to fetch items for category ${category}` });
  }
}
