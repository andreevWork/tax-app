import fs from 'fs';
import path from 'path';
import { readJson } from './utils.js';

const summaryPath = process.env.GITHUB_STEP_SUMMARY;
const artifactsDir = 'ci-artifacts';

const checks = [
  { name: 'ESLint', file: 'lint-status.json' },
  { name: 'Prettier Format', file: 'format-status.json' },
  { name: 'Build', file: 'build-status.json' },
  { name: 'Branch Name', file: 'branch-status.json' },
];

let summary = `## 🧾 CI Summary\n\n`;

for (const check of checks) {
  const filePath = path.join(artifactsDir, check.file);
  const data = readJson(filePath, null);

  if (data === null) {
    summary += `### ${check.name}\n⚪ Not executed\n\n`;
    continue;
  }

  if (data.ok) {
    summary += `### ✅ ${check.name}\nAll checks passed successfully.\n\n`;
  } else {
    summary += `### ❌ ${check.name}\n`;
    summary += `Errors were found during ${check.name} check.\n\n`;
    
    if (data.error) {
      summary += `**Error Details:**\n\`\`\`\n${data.error}\n\`\`\`\n\n`;
    }
    
    if (data.message) {
      summary += `**Message:** ${data.message}\n\n`;
    }
  }
}

if (summaryPath) {
  fs.writeFileSync(summaryPath, summary);
}

console.log(summary);