'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter
} from '@/components/ui/card';
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

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  link,
  category,
  image
}) => {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleAnalyzeClick = async () => {
    setExpanded(true);
    setLoading(true);

    try {
      console.log(name);
      const response = await fetch('http://localhost:3001/api/sentiment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ productName: name })
      });
      console.log(response.data);
      setAnalysisResult(response.data);
    } catch (error) {
      console.error('Error fetching sentiment analysis:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="rounded-lg bg-gray-800 text-white shadow-md transition-shadow duration-200 hover:shadow-lg">
      <CardHeader className="p-0">
        <Image
          src={image}
          alt={name}
          width={300}
          height={200}
          className="rounded-t-lg"
        />
      </CardHeader>
      <CardContent className="p-4">
        <h2 className="text-lg font-semibold">{name}</h2>
        <p className="text-sm text-gray-400">{category}</p>
        <button
          onClick={handleAnalyzeClick}
          className="hover:bg-primary-dark mt-4 rounded-lg bg-primary px-4 py-2 text-white"
        >
          Analyze
        </button>
      </CardContent>
      {expanded && (
        <CardContent className="mt-4 rounded-lg bg-gray-700 p-4">
          {loading ? (
            <p>Loading analysis...</p>
          ) : (
            analysisResult && (
              <div>
                <p>
                  <strong>Sentiment:</strong>{' '}
                  {analysisResult.sentiment.description}
                </p>
                <p>
                  <strong>Popular Region:</strong>{' '}
                  {analysisResult.sentiment.popular_region}
                </p>
                <ResponsiveContainer width="100%" height={100}>
                  <LineChart
                    data={[
                      { rating: parseFloat(analysisResult.product.rating) }
                    ]}
                  >
                    <XAxis dataKey="rating" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="rating" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )
          )}
        </CardContent>
      )}
      <CardFooter className="p-4">
        <Link href={link} passHref>
          View Product
        </Link>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
