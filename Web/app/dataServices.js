"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
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
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
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
var rawDeflateWorker = new Worker("/libs/RawDeflate.js");
var WorkerService = (function () {
    function WorkerService() {
    }
    WorkerService.start = function () {
        rawDeflateWorker.onmessage = function (ev) {
            var p = WorkerService.payloads[ev.data.key];
            delete WorkerService.payloads[ev.data.key];
            if (p)
                p(ev.data.payload);
        };
    };
    WorkerService.deflate = function (data) {
        return new Promise(function (resolve, reject) {
            var key = (Math.random() * 1000000).toFixed(0);
            WorkerService.payloads[key] = resolve;
            rawDeflateWorker.postMessage({ key: key, payload: data });
        });
    };
    WorkerService.payloads = {};
    return WorkerService;
}());
exports.WorkerService = WorkerService;
WorkerService.start();
var DataService = (function () {
    function DataService() {
    }
    DataService.getGameMetrics = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, json, m, ex_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, fetch(this.voteServer + 'api/game/metrics', {
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                }
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error(response.statusText);
                        return [4 /*yield*/, response.json()];
                    case 2:
                        json = _a.sent();
                        return [4 /*yield*/, WorkerService.deflate(json.data)];
                    case 3:
                        m = _a.sent();
                        if (!m.metrics)
                            return [2 /*return*/, null];
                        m.metrics.nextGenerationDate = new Date(m.metrics.nextGeneration);
                        return [2 /*return*/, m.metrics];
                    case 4:
                        ex_1 = _a.sent();
                        console.error('Fetch Error :-S', ex_1);
                        return [2 /*return*/, null];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DataService.vote = function (vote) {
        return __awaiter(this, void 0, void 0, function () {
            var response, json, ex_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 3, , 4]);
                        return [4 /*yield*/, fetch(this.voteServer + 'api/game/vote', {
                                method: "POST",
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(vote)
                            })];
                    case 1:
                        response = _a.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        json = _a.sent();
                        if (json.meta.errors) {
                            console.error(json.meta.errors);
                            return [2 /*return*/, null];
                        }
                        return [2 /*return*/, json.data];
                    case 3:
                        ex_2 = _a.sent();
                        console.error(ex_2);
                        return [2 /*return*/, ex_2];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    DataService.getGameState = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, json, m, ex_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, fetch(this.voteServer + 'api/game/state', {
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                }
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error(response.statusText);
                        return [4 /*yield*/, response.json()];
                    case 2:
                        json = _a.sent();
                        return [4 /*yield*/, WorkerService.deflate(json.data)];
                    case 3:
                        m = _a.sent();
                        return [2 /*return*/, m.state];
                    case 4:
                        ex_3 = _a.sent();
                        console.error('Fetch Error :-S', ex_3);
                        return [2 /*return*/, ex_3];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    DataService.getGenerationResult = function (generation) {
        return __awaiter(this, void 0, void 0, function () {
            var response, json, m, ex_4;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, fetch(this.voteServer + 'api/game/result?generation=' + generation, {
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/json',
                                }
                            })];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error(response.statusText);
                        return [4 /*yield*/, response.json()];
                    case 2:
                        json = _a.sent();
                        return [4 /*yield*/, WorkerService.deflate(json.data)];
                    case 3:
                        m = _a.sent();
                        return [2 /*return*/, m.metrics];
                    case 4:
                        ex_4 = _a.sent();
                        console.error('Fetch Error :-S', ex_4);
                        return [2 /*return*/, ex_4];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    // private static voteServer: string = 'https://vote.socialwargames.com/';
    DataService.voteServer = 'http://localhost:3568/';
    DataService.compressor = new Compressor();
    return DataService;
}());
exports.DataService = DataService;
