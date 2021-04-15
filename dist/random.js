"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Random = void 0;
var Random = /** @class */ (function () {
    function Random() {
    }
    Random.getBytes = function (count) {
        var out = new Uint8Array(count);
        return out;
    };
    return Random;
}());
exports.Random = Random;
//# sourceMappingURL=random.js.map