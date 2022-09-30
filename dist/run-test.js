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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var api_1 = require("./api");
var ledgerWrapper_1 = require("./services/ledger/ledgerWrapper");
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var ledger, assetTypeString;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, ledgerWrapper_1.getLedger)()];
                case 1:
                    ledger = _a.sent();
                    assetTypeString = ledger.asset_type_from_jsvalue([
                        112, 14, 143, 78, 152, 149, 249, 82, 105, 240, 119, 5, 5, 73, 83, 83, 93, 159, 147, 30, 62, 17, 49, 119,
                        21, 220, 171, 170, 35, 235, 103, 199,
                    ]);
                    console.log(assetTypeString);
                    return [2 /*return*/];
            }
        });
    });
}
// main();
// w6ujhS_ngE3ZWy2c9RBwvjdHWbLpWEEFbNLY_YAgiOQ=
// const hashAddress = Evm.fraAddressToHashAddress('w6ujhS_ngE3ZWy2c9RBwvjdHWbLpWEEFbNLY_YAgiOQ=');
// let hashAddress = `0x${Buffer.from('w6ujhS_ngE3ZWy2c9RBwvjdHWbLpWEEFbNLY_YAgiOQ=', 'base64').toString(
//   'hex',
// )}`;
// w6ujhS_ngE3ZWy2c9RBwvjdHWbLpWEEFbNLY_YAgiOQ=
// 0xc3aba3852fe7804dd95b2d9cf51070be374759b2e95841056cd2d8fd802088e4  公钥地址
// 0xdd518d4285b1b4016186E61358b5Df139A2470c0 =》 cA6PTpiV-VJp8HcFBUlTU12fkx4-ETF3FdyrqiPrZ8c=
// console.log(hashAddress);
api_1.Evm.hashAddressTofraAddress('0xdd518d4285b1b4016186E61358b5Df139A2470c0').then(function (result) {
    console.log('fra nft', result);
});
api_1.Evm.hashAddressTofraAddressByNFT('0xdd518d4285b1b4016186E61358b5Df139A2470c0', '0').then(function (result) {
    console.log('fra nft', result);
});
//# sourceMappingURL=run-test.js.map