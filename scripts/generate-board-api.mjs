import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createServer } from 'vite';

const root = resolve(import.meta.dirname, '..');
const outputDirectory = resolve(root, 'public/api/v1');
const outputFile = resolve(outputDirectory, 'boards.json');
const generatedAt = process.env.SOURCE_DATE_EPOCH
  ? new Date(Number(process.env.SOURCE_DATE_EPOCH) * 1000).toISOString()
  : new Date().toISOString();

const vite = await createServer({ root, logLevel: 'error', server: { middlewareMode: true } });
try {
  const { createBoardDataset } = await vite.ssrLoadModule('/src/services/export-mcp-board-dataset.ts');
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(outputFile, `${JSON.stringify(createBoardDataset(generatedAt), null, 2)}\n`, 'utf8');
  console.log('Generated public/api/v1/boards.json');
} finally {
  await vite.close();
}
