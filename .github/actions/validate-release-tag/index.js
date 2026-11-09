const fs = require('node:fs');

const tag = process.env.INPUT_TAG ?? '';
const match = /^v(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.exec(tag);

if (!match) {
  process.stderr.write('::error::Release tags must use vMAJOR.MINOR.PATCH, for example v1.2.3.\n');
  process.exitCode = 1;
} else if (!process.env.GITHUB_OUTPUT) {
  process.stderr.write('::error::GITHUB_OUTPUT is not available; run this action inside GitHub Actions.\n');
  process.exitCode = 1;
} else {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `version=${match[1]}.${match[2]}.${match[3]}\n`);
}
