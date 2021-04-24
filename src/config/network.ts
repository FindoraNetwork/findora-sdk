/* eslint-disable @typescript-eslint/naming-convention */
const { PROJECT_ENV } = process.env;
export const HOST = PROJECT_ENV || 'dev-staging.dev.findora.org';
export const SUBMISSION_PORT = '8669';
export const LEDGER_PORT = '8668';
export const QUERY_PORT = '8667';
export const PROTOCOL = 'https';
