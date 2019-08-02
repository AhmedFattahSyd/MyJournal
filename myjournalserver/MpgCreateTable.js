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
var _this = this;
exports.__esModule = true;
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// MPG Data initialisation lambda function
//////////////////////////////////////////////////////////////////////////////////////////////////////////
var MpgData = require("../myjournalapp/src/MpgDataDef");
var aws_sdk_1 = require("../myjournalapp/node_modules/aws-sdk");
var lambdaFuntionName = 'mpg-data-server-06';
var lambda = new aws_sdk_1.Lambda({ region: 'ap-southeast-2', apiVersion: '2015-03-31' });
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// lambda entry point
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.handler = function (event) { return __awaiter(_this, void 0, void 0, function () {
    var userName, tableName, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log('MpgDataInit: event:', event);
                userName = event.userName;
                console.log('MpgDataInit: userName:', userName);
                tableName = MpgData.tablePrefix + userName;
                return [4 /*yield*/, createTable(tableName)];
            case 1:
                _a.sent();
                return [2 /*return*/, (event)];
            case 2:
                error_1 = _a.sent();
                return [2 /*return*/, error_1];
            case 3: return [2 /*return*/];
        }
    });
}); };
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// create table
//////////////////////////////////////////////////////////////////////////////////////////////////////////
function createTable(tableName) {
    return __awaiter(this, void 0, void 0, function () {
        var JSONData, stringData, pullParams, response, statusCode, mpgDataResponse, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    console.log('MpgDataInit: createTbale tableName:', tableName);
                    JSONData = {
                        actiontype: MpgData.MpgDataActionTypes.CreateTable,
                        tableName: tableName
                    };
                    stringData = JSON.stringify(JSONData);
                    pullParams = {
                        FunctionName: lambdaFuntionName,
                        InvocationType: 'RequestResponse',
                        Payload: stringData,
                        LogType: 'None'
                    };
                    return [4 /*yield*/, lambda.invoke(pullParams).promise()];
                case 1:
                    response = _a.sent();
                    console.log("createTable: lambda response", response);
                    statusCode = response.StatusCode;
                    if (statusCode == 200) {
                        mpgDataResponse = JSON.parse(response.Payload);
                        if (mpgDataResponse.returnCode == MpgData.MpgDataServerReturnCode.Success) {
                            console.log("MpgClientData: createTable: table was created");
                        }
                        else {
                            // error from dynamoDB
                            // this.logger.debug("MpgClientData: createItemrecord: eroror from DynamoDB:",mpgDataResponse.msg)
                            console.log("createTable: eroror from DynamoDB:" + mpgDataResponse.msg);
                        }
                    }
                    else {
                        // error from lambda
                        console.log("createTable: error from lambda function:", response);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.log("createTable: error ", error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
