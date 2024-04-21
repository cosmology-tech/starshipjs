#!/usr/bin/env node
import { StarshipClient } from '@starship-ci/client'; // Adjust the import path as necessary
import minimist from 'minimist';

import { Inquirerer, type Question } from './prompt';
import { displayUsage, displayVersion, loadConfig } from './utils';

const argv = minimist(process.argv.slice(2), {
  alias: {
    v: 'version'
  }
});

if (argv.version) {
  displayVersion();
  process.exit(0);
}

const prompter = new Inquirerer();

const questions: Question[] = [
  'helmName',
  'helmFile',
  'helmRepo',
  'helmRepoUrl',
  'helmChart',
  'helmVersion'
].map(name => ({ name }));

// Main function to run the application
async function main() {
  const command: string = argv._[0];

  // Display usage and exit early if no command or help command is provided
  if (!command || command === 'help') {
    displayUsage();
    prompter.close();
    return;
  }

  // Load configuration and prompt for missing parameters
  const config = loadConfig(argv);
  const args = await prompter.prompt({ ...config.context }, questions);
  
  const client = new StarshipClient(args);
  client.setConfig(config.starship);

  // Mocking the exec method for demonstration purposes
  // @ts-ignore
  client.exec = (cmd: string) => console.log(cmd);

  // Execute command based on input
  switch (command) {
    case 'deploy':
      client.deploy();
      break;
    case 'setup':
      client.setup();
      break;
    case 'startPortForward':
      client.startPortForward();
      break;
    case 'stopPortForward':
      client.stopPortForward();
      break;
    case 'teardown':
      client.teardown();
      break;
    case 'upgrade':
      client.upgrade();
      break;
    case 'undeploy':
      client.undeploy();
      break;
    case 'cleanKind':
      client.cleanKind();
      break;
    case 'deleteHelm':
      client.deleteHelm();
      break;
    case 'removeHelm':
      client.removeHelm();
      break;
    case 'setupKind':
      client.setupKind();
      break;
    case 'clean':
      client.clean();
      break;
    default:
      console.log(`Unknown command: ${command}`);
      displayUsage();
  }

  prompter.close();
}

// Improved error handling
main().catch(err => {
  console.error('An error occurred:', err);
  prompter.close();
  process.exit(1);
});