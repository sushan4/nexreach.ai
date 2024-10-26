'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

type ProductCardProps = {
  name: string;
  link: string;
  category: string;
  image: string;
};

type ProductResponse = {
  name: string;
  link: string;
  rating: string;
  reviews: string;
  mrp: string;
  discount: string;
  keyIngredients: string;
  category: string;
};

type SentimentData = {
  'sentiment score': number;
  'sentiment description': string;
  'popular region': string;
};

type ApiResponse = {
  product: ProductResponse;
  sentiment: string | SentimentData;
};

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  link,
  category,
  image
}) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<{
    product: ProductResponse;
    sentiment: SentimentData;
  } | null>(null);

  const parseSentiment = (data: ApiResponse): SentimentData => {
    if (typeof data.sentiment === 'string') {
      try {
        return JSON.parse(data.sentiment);
      } catch (e) {
        throw new Error('Failed to parse sentiment data');
      }
    }
    return data.sentiment;
  };

  const handleAnalyzeClick = async () => {
    setExpanded(true);
    setLoading(true);
    setError(null);

    try {
      const encodedName = encodeURIComponent(name.trim());
      const response = await fetch(
        `http://localhost:3001/api/sentiment/${encodedName}`
      );
      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(
          data.sentiment?.toString() || 'Failed to fetch analysis'
        );
      }

      setAnalysisResult({
        product: data.product,
        sentiment: parseSentiment(data)
      });
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderAnalysis = () => {
    if (!analysisResult) return null;

    const { product, sentiment } = analysisResult;
    const ratingData = [
      {
        name: 'sentinal score',
        value: parseFloat(sentiment['sentiment score'].toString())
      }
    ];

    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-gray-700 p-4">
          <h3 className="mb-2 font-semibold">Analysis Results</h3>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Sentiment:</span>{' '}
              {sentiment['sentiment description']}
            </p>
            <p className="text-sm">
              <span className="font-medium">Popular Region:</span>{' '}
              {sentiment['popular region']}
            </p>
            <p className="text-sm">
              <span className="font-medium">Sentiment Score:</span>{' '}
              {sentiment['sentiment score']}/10
            </p>
          </div>
        </div>

        <div className="h-32 w-full">
          <ResponsiveContainer>
            <LineChart data={ratingData}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ fill: '#8884d8' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg bg-gray-700 p-4">
          <h3 className="mb-2 font-semibold">Product Details</h3>
          <div className="space-y-2 text-sm">
            <p>
              <span className="font-medium">MRP:</span> {product.mrp}
            </p>
            {product.discount !== 'NA' && (
              <p>
                <span className="font-medium">Discount:</span>{' '}
                {product.discount}
              </p>
            )}
            <p>
              <span className="font-medium">Key Ingredients:</span>{' '}
              {product.keyIngredients}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-[300px] rounded-lg bg-gray-800 text-white shadow-lg">
      <Image
        src={image}
        alt={name}
        width={300}
        height={200}
        className="h-[200px] w-full rounded-t-lg object-cover"
      />

      <div className="p-4">
        <h2 className="h-16 text-lg font-semibold">{name}</h2>
        <p className="text-sm text-gray-400">{category}</p>

        {expanded && (
          <div className="mt-4">
            {loading && <p className="text-center">Loading analysis...</p>}
            {error && (
              <div className="rounded-lg bg-red-900/50 p-4 text-red-200">
                <p>Error: {error}</p>
              </div>
            )}
            {!loading && !error && renderAnalysis()}
          </div>
        )}

        <div className="mt-7 flex flex-col gap-2">
          <button
            onClick={handleAnalyzeClick}
            disabled={loading}
            className="w-full rounded-lg bg-slate-600 px-4 py-2 text-white hover:bg-slate-700 disabled:opacity-50"
          >
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
          <Link
            href={link}
            className="text-center text-white hover:text-blue-300"
            target="_blank"
            rel="noopener noreferrer"
          >
            <hr className="my-4 h-px border-0 bg-gray-200 dark:bg-gray-700" />
            Get Top Influencer
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
