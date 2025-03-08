import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve the path to package.json
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const packagePath = path.resolve(__dirname, '../package.json');

// Check for the `--update-version` flag
const shouldUpdateVersion = process.argv.includes('--update-version');

if (shouldUpdateVersion) {
    // Read and parse package.json
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

    // Split version (e.g., "0.0.0" -> ["0", "0", "0"])
    const versionParts = packageJson.version.split('.').map(Number);

    // Increment the patch version (e.g., "0.0.0" -> "0.0.1")
    versionParts[2] += 1;

    // Update version and add build time
    packageJson.version = versionParts.join('.');
    packageJson.buildTime = new Date().toISOString();

    // Write back to package.json
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2), 'utf8');

    console.log(`Updated version to ${packageJson.version}, build time: ${packageJson.buildTime}`);
} else {
    console.log('Skipped version update for local build.');
}
