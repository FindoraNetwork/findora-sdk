"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var random_1 = require("_src/random");
describe('getBytes', function () {
    it('returns correct length of the array', function () {
        var length = 4;
        var data = random_1.Random.getBytes(length);
        expect(data.length).toEqual(length);
    });
});
//# sourceMappingURL=random.spec.js.map