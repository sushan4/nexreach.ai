'use client';
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Influencer {
  Name: string;
  Region: string;
  Reach: string;
  Category: string;
  Description: string;
}

interface PageProps {
  region: string;
}

export default function InfluencersPage() {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const region = 'Mumbai';
        // Encode the region parameter to handle special characters
        const response = await fetch(
          `http://localhost:3001/influencers/${region}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch data');
        }

        const data = await response.json();
        setInfluencers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Dependency on region prop

  //   if (!region) {
  //     return (
  //       <div className="flex min-h-screen items-center justify-center">
  //         <p className="text-lg">Please specify a region</p>
  //       </div>
  //     );
  //   }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-lg">Loading influencers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-24">
      <Card>
        <CardHeader>
          <CardTitle>
            Mumbai Based Influencers recommended for your product
          </CardTitle>
        </CardHeader>
        <CardContent>
          {influencers.length === 0 ? (
            <p className="py-4 text-center">No influencers found for Mumbai</p>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Reach</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="max-w-[300px]">Description</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {influencers.map((influencer, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {influencer.Name}
                      </TableCell>
                      <TableCell>{influencer.Region}</TableCell>
                      <TableCell>{influencer.Reach}</TableCell>
                      <TableCell>{influencer.Category}</TableCell>
                      <TableCell
                        className="max-w-[300px] truncate"
                        title={influencer.Description}
                      >
                        {influencer.Description}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
