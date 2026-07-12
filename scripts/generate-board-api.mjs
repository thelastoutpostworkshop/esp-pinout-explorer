import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createServer } from 'vite';

const root = resolve(import.meta.dirname, '..');
const outputDirectory = resolve(root, 'public/api/v1');
const boardOutputFile = resolve(outputDirectory, 'boards.json');
const moduleOutputFile = resolve(outputDirectory, 'modules.json');
const generatedAt = process.env.SOURCE_DATE_EPOCH
  ? new Date(Number(process.env.SOURCE_DATE_EPOCH) * 1000).toISOString()
  : new Date().toISOString();

const vite = await createServer({ root, logLevel: 'error', server: { middlewareMode: true } });
try {
  const { createBoardDataset } = await vite.ssrLoadModule('/src/services/export-mcp-board-dataset.ts');
  const { createModuleDataset } = await vite.ssrLoadModule('/src/services/export-mcp-module-dataset.ts');
  await mkdir(outputDirectory, { recursive: true });
  await writeFile(boardOutputFile, `${JSON.stringify(createBoardDataset(generatedAt), null, 2)}\n`, 'utf8');
  await writeFile(moduleOutputFile, `${JSON.stringify(createModuleDataset(generatedAt), null, 2)}\n`, 'utf8');
  console.log('Generated public/api/v1/boards.json and modules.json');
} finally {
  await vite.close();
}
