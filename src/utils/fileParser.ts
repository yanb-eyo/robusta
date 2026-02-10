// noinspection ExceptionCaughtLocallyJS

import Papa from 'papaparse';
import * as BSON from 'bson';

export interface ParsedData {
  rows: Record<string, unknown>[];
  columns: string[];
  metadata: {
    rowCount: number;
    columnCount: number;
    sampleSize: number;
  };
  preview: string;
}

export const parseFile = async (file: File): Promise<ParsedData> => {
  const content = await file.text();
  const ext = file.name.toLowerCase().split('.').pop();

  let rows: Record<string, unknown>[] = [];

  switch (ext) {
    case 'csv':
      rows = parseCSV(content);
      break;
    case 'json':
      rows = parseJSON(content);
      break;
    case 'jsonl':
      rows = parseJSONL(content);
      break;
    case 'bson':
      rows = parseBSON(new Uint8Array(await file.arrayBuffer()));
      break;
    default:
      throw new Error(`Unsupported file format: ${ext}`);
  }

  if (rows.length === 0) {
    throw new Error('File contains no data');
  }

  // Get columns from first row
  const columns = Array.from(
    new Set(rows.flatMap((row) => Object.keys(row)))
  );

  // Create preview
  const preview = createPreview(rows, columns);

  return {
    rows,
    columns,
    metadata: {
      rowCount: rows.length,
      columnCount: columns.length,
      sampleSize: Math.min(5, rows.length),
    },
    preview,
  };
};

const parseCSV = (content: string): Record<string, unknown>[] => {
  const result = Papa.parse(content, {
    header: true,
    skipEmptyLines: true,
    dynamicTyping: true,
  });

  if (result.errors.length > 0) {
    throw new Error(`CSV parsing error: ${result.errors[0].message}`);
  }

  return result.data as Record<string, unknown>[];
};

const parseJSON = (content: string): Record<string, unknown>[] => {
  try {
    const data = JSON.parse(content);

    // Handle both array of objects and single object
    if (Array.isArray(data)) {
      return data.filter((item) => typeof item === 'object' && item !== null);
    } else if (typeof data === 'object' && data !== null) {
      return [data];
    } else {
      throw new Error('JSON must be an array of objects or a single object');
    }
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON: ${error.message}`);
    }
    throw error;
  }
};

const parseJSONL = (content: string): Record<string, unknown>[] => {
  const lines = content.split('\n').filter((line) => line.trim());
  const rows: Record<string, unknown>[] = [];

  for (const line of lines) {
    try {
      const obj = JSON.parse(line);
      if (typeof obj === 'object' && obj !== null) {
        rows.push(obj);
      }
    } catch (error) {
      console.warn(`Skipping invalid JSONL line: ${line}`);
    }
  }

  if (rows.length === 0) {
    throw new Error('No valid JSON objects found in JSONL file');
  }

  return rows;
};

const parseBSON = (data: Uint8Array): Record<string, unknown>[] => {
  try {
    // Try to parse as a single BSON document first
    const doc = BSON.deserialize(Buffer.from(data));
    if (Array.isArray(doc)) {
      return doc.filter((item) => typeof item === 'object' && item !== null);
    }
    return [doc];
  } catch {
    // If single document fails, try as array of BSON documents
    const rows: Record<string, unknown>[] = [];
    let offset = 0;

    while (offset < data.length) {
      try {
        // Read size from first 4 bytes
        const sizeBytes = data.slice(offset, offset + 4);
        const size = new DataView(sizeBytes.buffer).getInt32(0, true);

        if (size <= 0 || offset + size > data.length) {
          break;
        }

        const doc = BSON.deserialize(
          Buffer.from(data.slice(offset, offset + size))
        );
        if (typeof doc === 'object' && doc !== null) {
          rows.push(doc);
        }

        offset += size;
      } catch {
        break;
      }
    }

    if (rows.length === 0) {
      throw new Error('Could not parse BSON data');
    }

    return rows;
  }
};

const createPreview = (
  rows: Record<string, unknown>[],
  columns: string[]
): string => {
  const sampleRows = rows.slice(0, 5);
  const lines: string[] = [];

  // Header
  lines.push('| ' + columns.join(' | ') + ' |');
  lines.push('|' + columns.map(() => '---|').join('') + '');

  // Data rows
  for (const row of sampleRows) {
    const values = columns.map((col) => {
      const value = row[col];
      if (value === null || value === undefined) {
        return '-';
      }
      return String(value).substring(0, 30);
    });
    lines.push('| ' + values.join(' | ') + ' |');
  }

  if (rows.length > 5) {
    lines.push(`\n... and ${rows.length - 5} more rows`);
  }

  return lines.join('\n');
};
