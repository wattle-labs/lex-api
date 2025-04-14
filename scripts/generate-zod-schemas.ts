import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { generate } from 'ts-to-zod';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const interfacesDir = path.resolve(__dirname, '../src/models/interfaces');
const outputDir = path.resolve(__dirname, '../src/validators/schemas');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// files to skip
const skipFiles = ['document.interface.ts'];

const interfaceFiles = fs
  .readdirSync(interfacesDir)
  .filter(file => file.endsWith('.ts') && !skipFiles.includes(file));

console.info('Generating Zod schemas...');
for (const file of interfaceFiles) {
  const inputPath = path.join(interfacesDir, file);
  const outputFileName = file.replace(/\.ts$/, '.schema.ts');
  const outputPath = path.join(outputDir, outputFileName);

  try {
    const sourceText = fs.readFileSync(inputPath, 'utf-8');

    const { getZodSchemasFile } = generate({
      sourceText,
      nameFilter: () => true,
      keepComments: true,
    });

    const zodSchemas = getZodSchemasFile('');
    fs.writeFileSync(outputPath, zodSchemas);

    console.info(`Successfully processed ${file} -> ${outputFileName}`);
  } catch (error) {
    console.error(`Error processing ${file}:`, error);
  }
}

try {
  console.info('Formatting generated files with Prettier...');
  execSync(`npx prettier --write "${outputDir}/**/*.ts"`, {
    stdio: 'inherit',
    cwd: path.resolve(__dirname, '..'),
  });
  console.info('Formatting complete!');
} catch (error) {
  console.error('Error formatting files:', error);
}

console.info('Zod schema generation complete!');
