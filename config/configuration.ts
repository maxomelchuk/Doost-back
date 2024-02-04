import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const YAML_CONFIG_FILENAME = 'config.yaml';

export default function config() {
  const config = yaml.load(
    readFileSync(join(__dirname, YAML_CONFIG_FILENAME), 'utf8'),
  ) as Record<string, any>;
  return config;
}

export function getMongoConnectURL() {
  const configuration = config();
  const env = configuration[process.env.ENV].db;
  return `mongodb://${env.host}:${env.port}/${env.database}`;
}
