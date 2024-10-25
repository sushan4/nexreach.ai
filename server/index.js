// server.js
const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Load products from CSV
const loadProducts = () => {
  return new Promise((resolve, reject) => {
    const products = [];
    fs.createReadStream('Mamaearth.csv')
      .pipe(csv())
      .on('data', (row) => products.push(row))
      .on('end', () => resolve(products))
      .on('error', (error) => reject(error));
  });
};

// Function to analyze sentiment using OpenAI
const analyzeSentiment = async (text) => {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: `Analyze the sentiment of this review on basis of India and provide a json output with numeric "positive score" between 1 to 10, and "sentiment description" which is a sentence based on review, and "popular region" which is set to Mumbai/Bangalore/Chennai/Delhi Randomly ${text}`
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenAI API error:', error);
    return null; // Handle error case appropriately
  }
};

// Endpoint for sentiment analysis
app.get('/api/sentiment/:productName', async (req, res) => {
  const { productName } = req.params;

  try {
    const products = await loadProducts();
    const product = products.find(
      (item) => item['Product Name'].toLowerCase() === productName.toLowerCase()
    );

    if (!product) {
      return res
        .status(404)
        .json({ message: 'No product found with this name.' });
    }

    const sentiment = await analyzeSentiment(product.Reviews);

    res.json({
      product: {
        name: product['Product Name'],
        link: product['Product Link'],
        rating: product.Rating,
        reviews: product.Reviews,
        mrp: product.MRP,
        packSize: product['Packing Size'],
        discount: product.Discount,
        keyIngredients: product['Key Ingredients'],
        category: product.Category
      },
      sentiment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
