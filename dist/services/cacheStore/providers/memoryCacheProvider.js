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
exports.memoryCacheProvider = void 0;
class MemoryCache {
}
MemoryCache.data = {};
const readCache = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    let cacheData = {};
    cacheData = MemoryCache.data[fileName];
    return cacheData;
});
const writeCache = (fileName, data) => __awaiter(void 0, void 0, void 0, function* () {
    MemoryCache.data[fileName] = Object.assign({}, data);
    return true;
});
exports.memoryCacheProvider = {
    read: readCache,
    write: writeCache,
};
//# sourceMappingURL=memoryCacheProvider.js.map