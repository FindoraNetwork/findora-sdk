import fs from 'fs';
import path from 'path';
import solc from 'solc';

const inboxPath = path.resolve(__dirname, './', 'Inbox.sol');
const source = fs.readFileSync(inboxPath, 'utf8');

const result = solc.compile(source, 1).contracts[':Inbox'];

export const contractInterface = result.interface;
export const contractBytecode = result.bytecode;
