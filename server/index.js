// server.js
const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const cors = require('cors');
const openai = require('openai');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: 'http://localhost:3000'
  })
);

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
            // content: `Analyze the sentiment of this review and provide a json output with numeric value which shows a score based on previous sentiment analysis label it "sentiment score" between 1 to 10 in json, and "sentiment description" which is a sentence summerizing review, and "popular region" which you can randomly pick from this cities Mumbai,Bangalore, Chennai, Delhi. Randomly ${text}`
            content: `Analyze the sentiment of the following review, assign a sentiment score between 1 (negative) to 10 (positive), and provide a summarized sentiment description. Randomly assign a popular region from the following cities: Mumbai, Bangalore, Chennai, or Delhi. Please format the response as JSON:\n\nReview: \"${text}\"\n\nExpected Output Format:\n{\n  \"sentiment score\": [numeric score between 1 and 10],\n  \"sentiment description\": \"[summarized sentiment in one sentence]\",\n  \"popular region\": \"[one of the cities: Mumbai, Bangalore, Chennai, Delhi]\"\n}\n`
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
  console.log(req.params.productName);
  const productName = decodeURIComponent(req.params.productName);

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

// Load influencers from CSV file
const loadInfluencers = () => {
  return new Promise((resolve, reject) => {
    const influencers = [];
    fs.createReadStream('influencers.csv') // replace with the path to your CSV file
      .pipe(csv())
      .on('data', (row) => influencers.push(row))
      .on('end', () => resolve(influencers))
      .on('error', (error) => reject(error));
  });
};

// Define route to get influencers by region
app.get('/influencers', async (req, res) => {
  const region = req.query.region;
  if (!region) {
    return res.status(400).json({ error: 'Region is required' });
  }

  try {
    // Load the influencers data
    const influencers = await loadInfluencers();

    // Filter influencers by region
    const filteredInfluencers = influencers.filter((influencer) =>
      influencer.Region.toLowerCase().includes(region.toLowerCase())
    );

    // Generate descriptions for each influencer using OpenAI API
    const influencerDescriptions = await Promise.all(
      filteredInfluencers.map(async (influencer) => {
        const prompt = `Suggest why ${influencer.Name}, a popular ${influencer.Category} influencer with ${influencer.Reach} reach in ${influencer.Region}, would be good for a skincare project.`;

        try {
          const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
              model: 'gpt-3.5-turbo',
              messages: [
                {
                  role: 'user',
                  content: prompt
                }
              ],
              max_tokens: 50,
              temperature: 0.7
            },
            {
              headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
              }
            }
          );

          const description = response.data.choices[0].message.content.trim();

          return {
            Name: influencer.Name,
            Region: influencer.Region,
            Reach: influencer.Reach,
            Category: influencer.Category,
            Description: description
          };
        } catch (error) {
          console.error('OpenAI API error:', error);
          return {
            Name: influencer.Name,
            Region: influencer.Region,
            Reach: influencer.Reach,
            Category: influencer.Category,
            Description: 'Description unavailable due to API error.',
            Error: error.response?.data?.error?.message || error.message
          };
        }
      })
    );

    res.json(influencerDescriptions);
  } catch (error) {
    console.error('Error loading influencers:', error);
    res.status(500).json({ error: 'Failed to load influencers' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
