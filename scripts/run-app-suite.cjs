const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);

const options = args.reduce((acc, arg) => {
  if (!arg.startsWith('--')) return acc;

  const [rawKey, rawValue] = arg.slice(2).split('=');
  acc[rawKey] = rawValue ?? 'true';
  return acc;
}, {});

const app = options.app;
const suite = options.suite || 'all';
const project = options.project;

if (!app) {
  console.error('Missing required argument: --app=<app-name>');
  process.exit(1);
}

const suiteConfigPath = path.resolve(__dirname, '..', 'config', 'test-suites.json');
const suiteConfig = JSON.parse(fs.readFileSync(suiteConfigPath, 'utf8'));
const appConfig = suiteConfig[app];

if (!appConfig) {
  console.error(`Unknown app suite configuration: ${app}`);
  process.exit(1);
}

const resolvedSuite = appConfig.suites[suite] ? suite : appConfig.defaultSuite;
const testPath = appConfig.suites[resolvedSuite]?.path;

if (!testPath) {
  console.error(`No suite path configured for ${app}/${resolvedSuite}`);
  process.exit(1);
}

const env = {
  ...process.env,
  APP: app,
  TEST_SUITE: resolvedSuite,
  PLAYWRIGHT_HTML_REPORT: path.join('playwright-report', app, resolvedSuite),
  PLAYWRIGHT_JSON_OUTPUT_FILE: path.join('test-results', 'json', `${app}-${resolvedSuite}.json`),
  PLAYWRIGHT_JUNIT_OUTPUT_FILE: path.join('test-results', 'junit', `${app}-${resolvedSuite}.xml`),
};

const playwrightArgs = ['test', testPath];

if (project) {
  playwrightArgs.push(`--project=${project}`);
}

const extraArgs = args.filter(
  (arg) =>
    !arg.startsWith('--app=') && !arg.startsWith('--suite=') && !arg.startsWith('--project='),
);
playwrightArgs.push(...extraArgs);

console.log(`\n>>> Running ${app}/${resolvedSuite}`);
console.log(`    Test path: ${testPath}`);
console.log(`    HTML report: ${env.PLAYWRIGHT_HTML_REPORT}`);
console.log(`    JSON report: ${env.PLAYWRIGHT_JSON_OUTPUT_FILE}`);
console.log(`    JUnit report: ${env.PLAYWRIGHT_JUNIT_OUTPUT_FILE}`);

const playwrightCli = require.resolve('@playwright/test/cli');
const result = spawnSync(process.execPath, [playwrightCli, ...playwrightArgs], {
  stdio: 'inherit',
  env,
  shell: false,
});

if (result.error) {
  console.error(result.error);
}

process.exit(result.status ?? 1);
