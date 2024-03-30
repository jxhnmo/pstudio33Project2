import { fetchCategories } from '../menu'; // Adjust the import path as needed

export default async function handler(req, res) {
    try {
        const categories = await fetchCategories();
        res.status(200).json({ success: true, data: categories });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: 'Failed to connect to the database' });
    }
}
