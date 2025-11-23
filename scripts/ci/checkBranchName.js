import fs from 'fs';

const branchName = process.env.GITHUB_HEAD_REF || process.env.GITHUB_REF_NAME;
const pattern = /^TAX-\d+\/[a-zA-Z0-9-]+$/;
const summaryPath = process.env.GITHUB_STEP_SUMMARY;

const result = {
  branch: branchName || '(unknown)',
  ok: true,
  message: '',
};

if (!branchName) {
  result.ok = false;
  result.message = '⚠️ Unable to determine branch name';
} else if (!pattern.test(branchName)) {
  result.ok = false;
  result.message = `⚠️ Invalid branch name: "${branchName}". Expected format: TAX-<number>/<description>`;
} else {
  result.message = `✅ Valid branch name: ${branchName}`;
}

console.log(result.message);

fs.mkdirSync('ci-artifacts', { recursive: true });
fs.writeFileSync(
  'ci-artifacts/branch-status.json',
  JSON.stringify(result, null, 2)
);

if (summaryPath) {
  const summary = `
### 🧾 Branch Name Validation
**Branch:** \`${result.branch}\`
**Status:** ${result.ok ? '✅ Valid' : '⚠️ Invalid'}
**Details:** ${result.ok ? 'Follows naming convention.' : 'Should match TAX-<number>/<description> (e.g. TAX-3/setup-vitest)'}
`;
  fs.appendFileSync(summaryPath, summary);
}

process.exit(0);
