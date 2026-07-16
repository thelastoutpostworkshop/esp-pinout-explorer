import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createServer } from 'vite';

const root = resolve(import.meta.dirname, '..');
const outputDirectory = resolve(root, 'public/api/v1');
const boardOutputFile = resolve(outputDirectory, 'boards.json');
const boardIndexOutputFile = resolve(outputDirectory, 'boards', 'index.json');
const moduleOutputFile = resolve(outputDirectory, 'modules.json');
const generatedAt = process.env.SOURCE_DATE_EPOCH
  ? new Date(Number(process.env.SOURCE_DATE_EPOCH) * 1000).toISOString()
  : new Date().toISOString();

const vite = await createServer({ root, logLevel: 'error', server: { middlewareMode: true } });
try {
  const { createBoardDataset, createBoardIndexDataset } = await vite.ssrLoadModule('/src/services/export-mcp-board-dataset.ts');
  const { createModuleDataset } = await vite.ssrLoadModule('/src/services/export-mcp-module-dataset.ts');
  await mkdir(outputDirectory, { recursive: true });
  const boardDataset = createBoardDataset(generatedAt);
  await writeFile(boardOutputFile, `${JSON.stringify(boardDataset, null, 2)}\n`, 'utf8');
  await mkdir(resolve(outputDirectory, 'boards'), { recursive: true });
  await writeFile(boardIndexOutputFile, `${JSON.stringify(createBoardIndexDataset(generatedAt), null, 2)}\n`, 'utf8');
  await Promise.all(boardDataset.boards.map((board) => writeFile(resolve(outputDirectory, 'boards', `${board.id}.json`), `${JSON.stringify({ schema_version: 1, generated_at: generatedAt, board }, null, 2)}\n`, 'utf8')));
  await writeFile(moduleOutputFile, `${JSON.stringify(createModuleDataset(generatedAt), null, 2)}\n`, 'utf8');
  console.log('Generated public/api/v1/boards.json and modules.json');
} finally {
  await vite.close();
}
