const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());

app.get('/api/food-search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Query is required' });

  try {
    const response = await axios.get('https://world.openfoodfacts.org/cgi/search.pl', {
      params: {
        search_terms: query,
        search_simple: 1,
        action: 'process',
        json: 1,
        page_size: 10
      }
    });

    // Normalizasyon
    const results = (response.data.products || []).map(product => ({
      name: product.product_name || product.generic_name || 'Bilinmiyor',
      calories: product.nutriments?.['energy-kcal_100g'] || 0,
      protein: product.nutriments?.['proteins_100g'] || 0,
      carbs: product.nutriments?.['carbohydrates_100g'] || 0,
      fat: product.nutriments?.['fat_100g'] || 0,
      brand: product.brands || '',
      image: product.image_front_url || '',
      source: 'openfoodfacts'
    }));

    res.json({ results });
  } catch (error) {
    res.status(500).json({ error: 'API error', details: error.message });
  }
});

app.listen(3001, () => console.log('Backend running on http://localhost:3001')); 