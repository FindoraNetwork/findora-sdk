/* eslint-disable @typescript-eslint/naming-convention */
console.log(`global proces  :) "${global.process}"`);
const isNodeEnv = typeof process !== 'undefined' && process.release.name === 'node';

let PROJECT_ENV;

if (isNodeEnv) {
  PROJECT_ENV = process.env;
}
export const HOST = PROJECT_ENV || 'dev-staging.dev.findora.org';
export const SUBMISSION_PORT = '8669';
export const LEDGER_PORT = '8668';
export const QUERY_PORT = '8667';
export const PROTOCOL = 'https';
