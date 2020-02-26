const dashdash = require('dashdash');
const fs = require('fs');
const path = require('path');
const log = require('./src/service/log');
const SyncOptions = require('./src/models/SyncOptions');
const Sync = require('./src/service/Sync');

const options = [
  {
    names: ['inputFile'],
    type: 'string',
    help: 'Path to a local JSON file containing label information.'
  },
  {
    names: ['inputRepo', 'i'],
    type: 'string',
    help:
      'The owner/repo for the GitHub repo that contains the labels you would like to copy from.'
  },

  {
    names: ['github'],
    type: 'string',
    default: 'https://github.com',
    help:
      'Url for gitHub.  For example https://github.umn.edu or https://github.com.  Note this defaults to https://github.com.'
  },
  {
    names: ['token'],
    type: 'string',
    help: 'GitHub personal access token.'
  },
  {
    names: ['config', 'c'],
    type: 'string',
    help: 'Path to configuration file.',
    default: 'config.json'
  },
  {
    names: ['outputRepos', 'o'],
    type: 'arrayOfString',
    help:
      ' Owner/repo for the GitHub repos that will be synced.  Note: multiple outputRepo can be passed.'
  },
  {
    names: ['outputRepoFile', 'r'],
    type: 'string',
    help:
      'Path to file that contains an array of owner/repo for the GitHub repos that will be synced.'
  },
  {
    names: ['outputOrg'],
    type: 'string',
    help:
      'Organization where every repo will be synced.  NOTE: This currently is not in use.'
  },
  {
    names: ['sync', 's'],
    type: 'bool',
    help:
      'Add if you want labels not listed in the input file/repo that are not in use in the output repos to be removed. ',
    default: false
  },
  {
    names: ['syncForce', 'f'],
    type: 'bool',
    help:
      'Add if you want labels not listed in the input file/repo to be removed from the output repos.',
    default: false
  },
  {
    names: ['help', 'h'],
    type: 'bool',
    help: 'Print this help and exit.'
  },
  {
    names: ['version', 'v'],
    type: 'bool',
    help: 'Print the version of the application and exit.'
  }
];

/* SET USER OPTIONS */
const parser = dashdash.createParser({ options });
let opts = {};
try {
  opts = parser.parse(process.argv);
} catch (e) {
  log.log(`Command line parsing error: %s => ${e.message}`, 'error');
  process.exit(1);
}

/* SHOW HELP */
if (opts.help) {
  const help = parser.help({ includeEnv: true }).trimRight();
  log.log('Usage: node sync.js [OPTIONS]');
  log.log(`Options:\n${help}`);
  process.exit(0);
}

/* SHOW VERSION */
if (opts.version) {
  const packageFile = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8')
  );
  log.log(`Version: ${packageFile.version}`);
  process.exit(0);
}

/* CALL LABEL SYNC */
const syncOptions = new SyncOptions(opts, options);
const sync = new Sync(syncOptions);
sync.run();
