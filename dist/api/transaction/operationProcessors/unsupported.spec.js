"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@testing-library/jest-dom/extend-expect");
const unsupported_1 = require("./unsupported");
describe('unsupported (processor) (unit test)', () => {
    describe('processUnsupported', () => {
        it('returns properly processed data', () => __awaiter(void 0, void 0, void 0, function* () {
            const type = 'unsupported';
            const payload = {
                foo: 'bar',
            };
            const result = yield (0, unsupported_1.processUnsupported)(payload);
            expect(result).toHaveProperty('result');
            expect(result).toHaveProperty('type');
            expect(result).toHaveProperty('originalOperation');
            expect(result).toHaveProperty('from');
            expect(result).toHaveProperty('to');
            expect(result.result).toEqual(false);
            expect(result.type).toEqual(type);
            expect(result.originalOperation).toBe(payload);
            expect(Object.keys(result)).toHaveLength(5);
        }));
    });
});
//# sourceMappingURL=unsupported.spec.js.map