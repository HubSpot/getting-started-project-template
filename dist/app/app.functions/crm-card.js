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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var _this = this;
// For external API calls
var axios = require('axios');
exports.main = function (context, sendResponse) { return __awaiter(_this, void 0, void 0, function () {
    var firstname, introMessage, data, quoteSections, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                firstname = context.propertiesToSend.firstname;
                introMessage = {
                    type: "text",
                    format: "markdown",
                    text: "_An example of a CRM card extension that displays data from Hubspot, uses ZenQuotes public API to display daily quote, and demonstrates custom actions using serverless functions._"
                };
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, axios.get("https://zenquotes.io/api/random")];
            case 2:
                data = (_a.sent()).data;
                quoteSections = [
                    {
                        type: "tile",
                        body: [
                            {
                                type: "text",
                                format: "markdown",
                                text: "**Hello ".concat(firstname, ", here's your quote for the day**!")
                            },
                            {
                                type: "text",
                                format: "markdown",
                                text: "**Quote**: ".concat(data[0].q)
                            },
                            {
                                type: "text",
                                format: "markdown",
                                text: "**Author**: ".concat(data[0].a)
                            }
                        ]
                    },
                    {
                        type: "button",
                        text: "Get new quote",
                        onClick: {
                            type: "SERVERLESS_ACTION_HOOK",
                            serverlessFunction: "crm-card"
                        }
                    }
                ];
                sendResponse({ sections: __spreadArray([introMessage], quoteSections, true) });
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                // "message" will create an error feedback banner when it catches an error
                sendResponse({
                    message: {
                        type: 'ERROR',
                        body: "Error: ".concat(error_1.message)
                    },
                    sections: [introMessage]
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
