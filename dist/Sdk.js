"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Sdk = /** @class */ (function () {
    function Sdk() {
    }
    Sdk.init = function (sdkEnv) {
        Sdk.environment = __assign(__assign({}, Sdk.environment), sdkEnv);
    };
    Sdk.environment = {
        hostUrl: 'dev-staging.dev.findora.org',
        protocol: 'https',
        queryPort: '8667',
        ledgerPort: '8668',
        submissionPort: '8669',
    };
    return Sdk;
}());
exports.default = Sdk;
//# sourceMappingURL=Sdk.js.map