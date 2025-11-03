import fs from 'fs';

const summaryPath = process.env.GITHUB_STEP_SUMMARY;
let summary = `## 🧾 CI Summary\n\n`;

function readJson(path, defaultValue) {
  try {
    return JSON.parse(fs.readFileSync(path, 'utf-8'));
  } catch {
    return defaultValue;
  }
}

const branch = readJson('ci-artifacts/branch-status.json', {});
const lint = readJson('ci-artifacts/lint-status.json', {});
const format = readJson('ci-artifacts/format-status.json', {});
const build = readJson('ci-artifacts/build-status.json', {});
const test = readJson('ci-artifacts/test-status.json', {});

const emoji = (ok) => (ok ? '✅' : '❌');

summary += `**Branch:** \`${branch.branch || '(unknown)'}\`\n`;
summary += `${branch.valid ? '✅ Valid branch name' : '⚠️ Invalid branch name'}\n\n`;

summary += `### 🔍 Results\n`;
summary += `- Lint: ${emoji(lint.ok)}\n`;
summary += `- Format: ${emoji(format.ok)}\n`;
summary += `- Build: ${emoji(build.ok)}\n`;
summary += `- Tests: ${emoji(test.ok)}\n`;

if (summaryPath) {
  fs.writeFileSync(summaryPath, summary);
} else {
  console.log(summary);
}
