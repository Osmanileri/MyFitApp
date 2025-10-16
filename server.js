// Load environment variables from .env if present
try {
  require('dotenv').config();
} catch (e) {
  // dotenv is optional; ignore if not installed
}

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
app.use(cors());

// Environment variables
const CLIENT_ID = process.env.FATSECRET_CLIENT_ID;
const CLIENT_SECRET = process.env.FATSECRET_CLIENT_SECRET;
const FATSECRET_BASE_URL = process.env.FATSECRET_BASE_URL || 'https://platform.fatsecret.com/rest/server.api';
const FATSECRET_TOKEN_URL = process.env.FATSECRET_TOKEN_URL || 'https://oauth.fatsecret.com/connect/token';

// In-memory token cache
let cachedToken = null;
let tokenExpiry = 0;

function toBase64(str) {
  return Buffer.from(str, 'utf8').toString('base64');
}

async function getAccessToken() {
  if (cachedToken && Date.now() < tokenExpiry - 5 * 60 * 1000) {
    return cachedToken;
  }
  if (!CLIENT_ID || !CLIENT_SECRET) {
    throw new Error('FATSECRET_CLIENT_ID/SECRET not set on server');
  }
  const credentials = `${CLIENT_ID}:${CLIENT_SECRET}`;
  const auth = `Basic ${toBase64(credentials)}`;
  const resp = await axios.post(
    FATSECRET_TOKEN_URL,
    'grant_type=client_credentials&scope=basic',
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: auth,
      },
    }
  );
  cachedToken = resp.data.access_token;
  tokenExpiry = Date.now() + (resp.data.expires_in || 3600) * 1000;
  return cachedToken;
}

// Proxy: foods.search
app.get('/fatsecret/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Query is required' });
  try {
    const token = await getAccessToken();
    const params = new URLSearchParams({
      method: 'foods.search',
      search_expression: query,
      format: 'json',
    });
    const { data } = await axios.get(`${FATSECRET_BASE_URL}?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const foods = Array.isArray(data.foods?.food) ? data.foods.food : (data.foods?.food ? [data.foods.food] : []);
    const normalized = foods.map((food) => ({
      id: food.food_id,
      name: food.food_name,
      calories: parseInt((food.food_description || '').match(/Calories: (\d+)/)?.[1] || '0'),
      protein: parseFloat((food.food_description || '').match(/Protein: ([\d.]+)g/)?.[1] || '0'),
      carbs: parseFloat((food.food_description || '').match(/Carbs: ([\d.]+)g/)?.[1] || '0'),
      fat: parseFloat((food.food_description || '').match(/Fat: ([\d.]+)g/)?.[1] || '0'),
      fiber: parseFloat((food.food_description || '').match(/Fiber: ([\d.]+)g/)?.[1] || '0'),
      portion: (food.food_description || '').split(' - ')[0] || '100g',
      source: 'fatsecret',
    }));
    res.json({ results: normalized });
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data;
    res.status(status).json({ error: 'fatsecret_search_failed', details: err.message, upstream: data });
  }
});

// Proxy: food.get
app.get('/fatsecret/food/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const token = await getAccessToken();
    const params = new URLSearchParams({ method: 'food.get', food_id: id, format: 'json' });
    const { data } = await axios.get(`${FATSECRET_BASE_URL}?${params.toString()}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    let serving = null;
    if (data?.food?.servings?.serving) {
      serving = Array.isArray(data.food.servings.serving)
        ? data.food.servings.serving[0]
        : data.food.servings.serving;
    }
    const payload = serving
      ? {
          id,
          name: data.food.food_name,
          calories: parseInt(serving.calories || '0'),
          protein: parseFloat(serving.protein || '0'),
          carbs: parseFloat(serving.carbohydrate || '0'),
          fat: parseFloat(serving.fat || '0'),
          fiber: parseFloat(serving.fiber || '0'),
          portion: serving.serving_description || '100g',
          source: 'fatsecret',
        }
      : null;
    res.json({ result: payload });
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data;
    res.status(status).json({ error: 'fatsecret_food_failed', details: err.message, upstream: data });
  }
});

// Diagnostics: test token retrieval
app.get('/fatsecret/token', async (req, res) => {
  try {
    const token = await getAccessToken();
    res.json({
      ok: true,
      tokenPreview: token ? token.substring(0, 12) + '...' : null,
      expiresAt: tokenExpiry,
      clientIdSet: Boolean(CLIENT_ID),
      clientSecretSet: Boolean(CLIENT_SECRET)
    });
  } catch (err) {
    const status = err.response?.status || 500;
    const data = err.response?.data;
    res.status(status).json({ ok: false, error: err.message, upstream: data, clientIdSet: Boolean(CLIENT_ID), clientSecretSet: Boolean(CLIENT_SECRET) });
  }
});

app.listen(3001, () => console.log('Backend running on http://localhost:3001'));