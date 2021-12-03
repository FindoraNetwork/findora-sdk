import fs from 'fs';
import path from 'path';
import solc from 'solc';

const contractName = 'Existing';

const contractPath = path.resolve(__dirname, './', `${contractName}.sol`);
const source = fs.readFileSync(contractPath, 'utf8');

const result = solc.compile(source, 1).contracts[`:${contractName}`];

export const contractInterface = result.interface;
export const contractBytecode = result.bytecode;
