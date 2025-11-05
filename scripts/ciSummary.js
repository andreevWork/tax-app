import fs from 'fs';
import path from 'path';

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

  if (!fs.existsSync(filePath)) {
    summary += `### ${check.name}\n⚪ Not executed\n\n`;
    continue;
  }

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
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
  } catch (err) {
    summary += `### ⚠️ ${check.name}\nFailed to parse status file.\n\n`;
  }
}

if (summaryPath) {
  fs.writeFileSync(summaryPath, summary);
}

console.log(summary);
