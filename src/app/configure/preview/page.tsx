/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from '@/db';
import { notFound } from 'next/navigation';
import DesignPreview from './DesignPreview';

// Define the configuration type (based on database schema)
interface Configuration {
  id: string;
  imageUrl?: string; // Optional, adjust based on schema
  width?: number;   // Optional, adjust based on schema
  height?: number;  // Optional, adjust based on schema
}

// Define props for DesignPreview
interface DesignPreviewProps {
  configuration: Configuration;
}

// Define the shape of resolved searchParams
interface SearchParams {
  id?: string;
  [key: string]: string | string[] | undefined;
}

// Define page props with searchParams as a Promise
interface PageProps {
  searchParams: Promise<SearchParams>;
}

const Page = async ({ searchParams }: PageProps) => {
  // Resolve the searchParams Promise
  const resolvedSearchParams = await searchParams;
  const { id } = resolvedSearchParams;

  // If id is missing, return 404
  if (!id) {
    return notFound();
  }

  const configuration = await db.configuration.findUnique({
    where: { id },
  });

  // If configuration is not found, return 404
  if (!configuration) {
    return notFound();
  }

  return <DesignPreview configuration={configuration} />
}

export default Page;