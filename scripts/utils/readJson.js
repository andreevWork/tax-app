import fs from 'fs';

export function readJson(filePath, defaultValue = {}) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return defaultValue;
  }
}
