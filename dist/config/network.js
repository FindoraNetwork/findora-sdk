"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROTOCOL = exports.QUERY_PORT = exports.LEDGER_PORT = exports.SUBMISSION_PORT = exports.HOST = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
var PROJECT_ENV = process.env.PROJECT_ENV;
exports.HOST = PROJECT_ENV || 'dev-staging.dev.findora.org';
exports.SUBMISSION_PORT = '8669';
exports.LEDGER_PORT = '8668';
exports.QUERY_PORT = '8667';
exports.PROTOCOL = 'https';
//# sourceMappingURL=network.js.map