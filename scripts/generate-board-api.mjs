import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createServer } from 'vite';

const root = resolve(import.meta.dirname, '..');
const outputDirectory = resolve(root, 'public/api/v1');
const boardIndexOutputFile = resolve(outputDirectory, 'boards', 'index.json');
const moduleOutputFile = resolve(outputDirectory, 'modules.json');
const moduleDatasetWarningBytes = 1 * 1024 * 1024;
const generatedAt = process.env.SOURCE_DATE_EPOCH
  ? new Date(Number(process.env.SOURCE_DATE_EPOCH) * 1000).toISOString()
  : new Date().toISOString();

const vite = await createServer({ root, logLevel: 'error', server: { middlewareMode: true } });
try {
  const { createBoardDataset, createBoardIndexDataset } = await vite.ssrLoadModule('/src/services/export-mcp-board-dataset.ts');
  const { createModuleDataset } = await vite.ssrLoadModule('/src/services/export-mcp-module-dataset.ts');
  await mkdir(outputDirectory, { recursive: true });
  const boardDataset = createBoardDataset(generatedAt);
  const moduleDataset = createModuleDataset(generatedAt);
  const moduleDatasetJson = `${JSON.stringify(moduleDataset, null, 2)}\n`;
  const moduleDatasetBytes = Buffer.byteLength(moduleDatasetJson, 'utf8');
  await mkdir(resolve(outputDirectory, 'boards'), { recursive: true });
  await writeFile(boardIndexOutputFile, `${JSON.stringify(createBoardIndexDataset(generatedAt), null, 2)}\n`, 'utf8');
  await Promise.all(boardDataset.boards.map((board) => writeFile(resolve(outputDirectory, 'boards', `${board.id}.json`), `${JSON.stringify({ schema_version: 1, generated_at: generatedAt, board }, null, 2)}\n`, 'utf8')));
  await writeFile(moduleOutputFile, moduleDatasetJson, 'utf8');
  console.log(`Generated public/api/v1/boards/index.json, board detail files, and modules.json (${moduleDatasetBytes.toLocaleString()} bytes; ${moduleDataset.modules.length} module profiles)`);
  if (moduleDatasetBytes >= moduleDatasetWarningBytes) {
    console.warn('modules.json is at least 1 MiB. Split the module API before it approaches the Worker 2 MiB remote-response limit.');
  }
} finally {
  await vite.close();
}
