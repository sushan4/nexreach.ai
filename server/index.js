require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const { OpenAI } = require('openai');
const { TwitterApi } = require('twitter-api-v2');
const natural = require('natural');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50 // limit each IP to 50 requests per windowMs
});
app.use(limiter);

// Initialize services
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_SECRET,
});

// Initialize NLP tools
const tokenizer = new natural.WordTokenizer();
const analyzer = new natural.SentimentAnalyzer("English", natural.PorterStemmer, "afinn");

// Cache setup
const analysisCache = new Map();
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

// Helper Functions
async function fetchTweets(productName) {
  try {
    const query = `"${productName}" (review OR experience OR bought OR using) -is:retweet lang:en -is:reply`;
    const tweets = await twitterClient.v2.search({
      query,
      max_results: 50,
      'tweet.fields': 'created_at,public_metrics',
    });
    return tweets.data.data || [];
  } catch (error) {
    console.error('Error fetching tweets:', error);
    throw error;
  }
}

async function analyzeWithAI(tweets, productName) {
  const batchSize = 5;
  const results = [];

  for (let i = 0; i < tweets.length; i += batchSize) {
    const batch = tweets.slice(i, Math.min(i + batchSize, tweets.length));
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: [{
          role: "system",
          content: "You are a sentiment analysis expert focused on product reviews. Provide structured analysis in JSON format."
        }, {
          role: "user",
          content: `Analyze these tweets about ${productName}. For each tweet, provide sentiment, confidence score (0-1), key features, and satisfaction level (0-10).`
        }],
        response_format: { type: "json_object" }
      });

      const analysis = JSON.parse(response.choices[0].message.content);
      results.push(...analysis.results);
    } catch (error) {
      console.error('AI analysis error:', error);
      // Fallback to basic sentiment analysis
      batch.forEach(tweet => {
        results.push({
          sentiment: analyzer.getSentiment(tokenizer.tokenize(tweet)) > 0 ? 'positive' : 'negative',
          confidence: 0.7,
          features: [],
          satisfaction: 5
        });
      });
    }
  }
  return results;
}

function aggregateAnalysis(aiResults) {
  const features = {};
  let totalSatisfaction = 0;
  let sentimentCounts = { positive: 0, negative: 0, neutral: 0 };

  aiResults.forEach(result => {
    sentimentCounts[result.sentiment]++;
    totalSatisfaction += result.satisfaction;
    result.features?.forEach(feature => {
      features[feature] = (features[feature] || 0) + 1;
    });
  });

  return {
    averageSatisfaction: totalSatisfaction / aiResults.length,
    sentimentDistribution: {
      positive: (sentimentCounts.positive / aiResults.length) * 100,
      neutral: (sentimentCounts.neutral / aiResults.length) * 100,
      negative: (sentimentCounts.negative / aiResults.length) * 100
    },
    topFeatures: Object.entries(features)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([feature, count]) => ({ feature, count })),
    rating: Math.round((totalSatisfaction / aiResults.length) * 0.5)
  };
}

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.post('/api/analyze-sentiment', async (req, res) => {
  try {
    const { productName } = req.body;
    const startTime = process.hrtime();

    if (!productName) {
      return res.status(400).json({ error: 'Product name is required' });
    }

    // Check cache
    const cacheKey = productName.toLowerCase();
    const cachedResult = analysisCache.get(cacheKey);
    if (cachedResult && (Date.now() - cachedResult.timestamp) < CACHE_DURATION) {
      const [seconds, nanoseconds] = process.hrtime(startTime);
      return res.json({
        ...cachedResult.data,
        fromCache: true,
        responseTime: seconds + nanoseconds / 1e9
      });
    }

    const tweets = await fetchTweets(productName);
    
    if (tweets.length === 0) {
      return res.status(404).json({
        error: 'No recent tweets found for this product'
      });
    }

    const aiAnalysis = await analyzeWithAI(tweets.map(t => t.text), productName);
    const aggregatedResults = aggregateAnalysis(aiAnalysis);

    const result = {
      productName,
      ...aggregatedResults,
      sampleSize: tweets.length,
      detailedAnalysis: {
        topPositive: aiAnalysis
          .filter(r => r.sentiment === 'positive')
          .sort((a, b) => b.confidence - a.confidence)
          .slice(0, 3),
        topComplaints: aiAnalysis
          .filter(r => r.sentiment === 'negative')
          .sort((a, b) => b.confidence - a.confidence)
          .slice(0, 3)
      },
      lastUpdated: new Date().toISOString()
    };

    analysisCache.set(cacheKey, {
      timestamp: Date.now(),
      data: result
    });

    const [seconds, nanoseconds] = process.hrtime(startTime);
    res.json({
      ...result,
      fromCache: false,
      responseTime: seconds + nanoseconds / 1e9
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'Failed to analyze sentiment',
      details: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log(`Sentiment analysis endpoint: http://localhost:${PORT}/api/analyze-sentiment`);
});