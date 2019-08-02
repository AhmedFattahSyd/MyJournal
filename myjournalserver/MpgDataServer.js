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
// MPG Data Server module as a lambda function      
// Server for MyJournal
//////////////////////////////////////////////////////////////////////////////////////////////////////////
var MpgData = require("../myjournalapp/src/MpgDataDef");
var aws_sdk_1 = require("../myjournalapp/node_modules/aws-sdk");
var database = new aws_sdk_1.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// list items
//////////////////////////////////////////////////////////////////////////////////////////////////////////
function listItems(tableName) {
    return __awaiter(this, void 0, void 0, function () {
        var dataServerresponse, params, ddbResponse, error_1, ddbError;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dataServerresponse = {
                        returnCode: MpgData.MpgDataServerReturnCode.UnknowError,
                        data: '',
                        msg: 'Just entered function createItem'
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    console.log('MpgDataServer: listItems');
                    params = {
                        TableName: tableName
                    };
                    return [4 /*yield*/, database.scan(params).promise()
                        // if no error was raised that means that the operation was successful
                    ];
                case 2:
                    ddbResponse = _a.sent();
                    // if no error was raised that means that the operation was successful
                    dataServerresponse = {
                        returnCode: MpgData.MpgDataServerReturnCode.Success,
                        data: JSON.stringify(ddbResponse.Items),
                        msg: 'Items were retrieved'
                    };
                    console.log('MpgDataServer: listItems: result:', ddbResponse);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    ddbError = error_1;
                    dataServerresponse = {
                        returnCode: MpgData.MpgDataServerReturnCode.DdbError,
                        data: '',
                        msg: "DynamoDB error message: " + ddbError.message
                    };
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, dataServerresponse];
            }
        });
    });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// create item
//////////////////////////////////////////////////////////////////////////////////////////////////////////
function createItem(tableName, item) {
    return __awaiter(this, void 0, void 0, function () {
        var dataServerresponse, timestamp, params, ddbResoponse, error_2, ddbError;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dataServerresponse = {
                        returnCode: MpgData.MpgDataServerReturnCode.UnknowError,
                        data: '',
                        msg: 'Just entered function createItem'
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    console.log('MpgDataServer: createItem: item:', item);
                    timestamp = new Date().getTime();
                    params = {
                        TableName: tableName,
                        Item: {
                            dataFormatVersion: item.dataFormatVersion,
                            id: item.id,
                            "class": item["class"],
                            name: item.name,
                            category: item.category,
                            description: item.description,
                            importance: item.importance,
                            createdAt: timestamp,
                            updatedAt: timestamp,
                            item1Id: item.item1Id,
                            item2Id: item.item2Id
                        }
                    };
                    return [4 /*yield*/, database.put(params).promise()
                        // if no error was raised that means that the operation was successful
                    ];
                case 2:
                    ddbResoponse = _a.sent();
                    // if no error was raised that means that the operation was successful
                    dataServerresponse = {
                        returnCode: MpgData.MpgDataServerReturnCode.Success,
                        data: JSON.stringify(ddbResoponse),
                        msg: 'Item was created'
                    };
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    ddbError = error_2;
                    dataServerresponse = {
                        returnCode: MpgData.MpgDataServerReturnCode.DdbError,
                        data: '',
                        msg: "DynamoDB error. Code:" + ddbError.code.toString() + ", message: " + ddbError.message
                    };
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, dataServerresponse];
            }
        });
    });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// delete item
//////////////////////////////////////////////////////////////////////////////////////////////////////////
function deleteItem(tableName, id) {
    return __awaiter(this, void 0, void 0, function () {
        var dataServerresponse, params, ddbResponse, error_3, ddbError;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dataServerresponse = {
                        returnCode: MpgData.MpgDataServerReturnCode.UnknowError,
                        data: '',
                        msg: 'Just entered function createItem'
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    console.log('MpgDataServer: deleteItem: id:', id);
                    params = {
                        TableName: tableName,
                        Key: { id: id }
                    };
                    return [4 /*yield*/, database["delete"](params).promise()
                        // if no error was raised that means that the operation was successful
                    ];
                case 2:
                    ddbResponse = _a.sent();
                    // if no error was raised that means that the operation was successful
                    dataServerresponse = {
                        returnCode: MpgData.MpgDataServerReturnCode.Success,
                        data: JSON.stringify(ddbResponse),
                        msg: 'Item was deleted'
                    };
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    ddbError = error_3;
                    dataServerresponse = {
                        returnCode: MpgData.MpgDataServerReturnCode.DdbError,
                        data: '',
                        msg: "DynamoDB error message: " + ddbError.message
                    };
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, dataServerresponse];
            }
        });
    });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// update item
//////////////////////////////////////////////////////////////////////////////////////////////////////////
function updateItem(tableName, newItem) {
    return __awaiter(this, void 0, void 0, function () {
        var dataServerresponse, timestamp, params, ddbResponse, error_4, ddbError;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dataServerresponse = {
                        returnCode: MpgData.MpgDataServerReturnCode.UnknowError,
                        data: '',
                        msg: 'Just entered function createItem'
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    console.log('MpgDataServer: updateItem: item:', newItem);
                    timestamp = new Date().getTime();
                    params = {
                        TableName: tableName,
                        Key: { id: newItem.id },
                        ExpressionAttributeNames: { "#name": "name" },
                        UpdateExpression: "set \
                version = :v,\
                #name = :n, \
                description = :d, \
                importance = :i, \
                item1Id = :e, \
                item2Id = :m, \
                updatedAt = :u",
                        ExpressionAttributeValues: {
                            ":v": newItem.dataFormatVersion,
                            ":n": newItem.name,
                            ":d": newItem.description,
                            ":i": newItem.importance,
                            ":e": newItem.item1Id,
                            ":m": newItem.item2Id,
                            ":u": timestamp
                        },
                        ReturnValues: "NONE"
                    };
                    console.log("updateItem: params:", params);
                    return [4 /*yield*/, database.update(params).promise()];
                case 2:
                    ddbResponse = _a.sent();
                    dataServerresponse = {
                        returnCode: MpgData.MpgDataServerReturnCode.Success,
                        data: JSON.stringify(ddbResponse),
                        msg: 'Item was updated'
                    };
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    ddbError = error_4;
                    dataServerresponse = {
                        returnCode: MpgData.MpgDataServerReturnCode.DdbError,
                        data: '',
                        msg: "DynamoDB error message: " + ddbError.message
                    };
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/, dataServerresponse];
            }
        });
    });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// create table
//////////////////////////////////////////////////////////////////////////////////////////////////////////
function createTable(tableName) {
    return __awaiter(this, void 0, void 0, function () {
        var dataServerResponse, ddbDatabase, params, ddbResponse, error_5, ddbError;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dataServerResponse = {
                        returnCode: MpgData.MpgDataServerReturnCode.UnknowError,
                        data: '',
                        msg: 'Just entered function createItem'
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    ddbDatabase = new aws_sdk_1.DynamoDB({ apiVersion: '2012-08-10' });
                    console.log('MpgDataServer: createTable: tableName:', tableName);
                    params = {
                        AttributeDefinitions: [{
                                AttributeName: "id",
                                AttributeType: "S"
                            }],
                        KeySchema: [{
                                AttributeName: "id",
                                KeyType: "HASH"
                            }],
                        ProvisionedThroughput: {
                            ReadCapacityUnits: 1,
                            WriteCapacityUnits: 1
                        },
                        TableName: tableName
                    };
                    console.log("createTable: params:", params);
                    return [4 /*yield*/, ddbDatabase.createTable(params).promise()
                        // if no error was raised, it means that the operation was successful
                    ];
                case 2:
                    ddbResponse = _a.sent();
                    // if no error was raised, it means that the operation was successful
                    dataServerResponse = {
                        returnCode: MpgData.MpgDataServerReturnCode.Success,
                        data: ddbResponse.toString(),
                        msg: 'Table was created'
                    };
                    return [2 /*return*/, dataServerResponse];
                case 3:
                    error_5 = _a.sent();
                    ddbError = error_5;
                    dataServerResponse = {
                        returnCode: MpgData.MpgDataServerReturnCode.DdbError,
                        data: '',
                        msg: "DynamoDB error message: " + ddbError.message
                    };
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// describe table
//////////////////////////////////////////////////////////////////////////////////////////////////////////
function describeTable(tableName) {
    return __awaiter(this, void 0, void 0, function () {
        var dataServerResponse, ddbDatabase, params, ddbResponse, foundTableName, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    dataServerResponse = {
                        returnCode: MpgData.MpgDataServerReturnCode.UnknowError,
                        data: '',
                        msg: 'Just entered function createTable'
                    };
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    ddbDatabase = new aws_sdk_1.DynamoDB({ apiVersion: '2012-08-10' });
                    console.log('MpgDataServer: describeTable: tableName:', tableName);
                    params = {
                        TableName: tableName
                    };
                    console.log("describeTable: params:", params);
                    return [4 /*yield*/, ddbDatabase.describeTable(params).promise()];
                case 2:
                    ddbResponse = _a.sent();
                    foundTableName = ddbResponse.Table.TableName;
                    if (foundTableName == tableName) {
                        dataServerResponse = {
                            returnCode: MpgData.MpgDataServerReturnCode.TableWasFound,
                            data: JSON.stringify(ddbResponse),
                            msg: 'Table was found'
                        };
                    }
                    console.log("describeTable. result:", ddbResponse);
                    return [2 /*return*/, dataServerResponse];
                case 3:
                    error_6 = _a.sent();
                    console.log("describeTable: error:", error_6);
                    dataServerResponse = {
                        returnCode: MpgData.MpgDataServerReturnCode.TableWasNotFound,
                        data: '',
                        msg: error_6
                    };
                    return [2 /*return*/, dataServerResponse];
                case 4: return [2 /*return*/];
            }
        });
    });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// execute request
//////////////////////////////////////////////////////////////////////////////////////////////////////////
function executeRequest(request) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, listItemsRequest, createItemRequest, deleteItemRequest, updateItemRequest, createTableRequest, describeTableRequest, error_7;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 15, , 16]);
                    console.log('MpgDataServer: executeRequest: request:', request);
                    _a = request.actiontype;
                    switch (_a) {
                        case MpgData.MpgDataActionTypes.ListItems: return [3 /*break*/, 1];
                        case MpgData.MpgDataActionTypes.CreateItem: return [3 /*break*/, 3];
                        case MpgData.MpgDataActionTypes.DeleteItem: return [3 /*break*/, 5];
                        case MpgData.MpgDataActionTypes.UpdateItem: return [3 /*break*/, 7];
                        case MpgData.MpgDataActionTypes.CreateTable: return [3 /*break*/, 9];
                        case MpgData.MpgDataActionTypes.DescribeTable: return [3 /*break*/, 11];
                    }
                    return [3 /*break*/, 13];
                case 1:
                    listItemsRequest = request;
                    return [4 /*yield*/, listItems(listItemsRequest.tableName)];
                case 2: return [2 /*return*/, _b.sent()];
                case 3:
                    createItemRequest = request;
                    return [4 /*yield*/, createItem(createItemRequest.tableName, createItemRequest.item)];
                case 4: return [2 /*return*/, _b.sent()];
                case 5:
                    deleteItemRequest = request;
                    return [4 /*yield*/, deleteItem(deleteItemRequest.tableName, deleteItemRequest.id)];
                case 6: return [2 /*return*/, _b.sent()];
                case 7:
                    updateItemRequest = request;
                    return [4 /*yield*/, updateItem(updateItemRequest.tableName, updateItemRequest.item)];
                case 8: return [2 /*return*/, _b.sent()];
                case 9:
                    createTableRequest = request;
                    return [4 /*yield*/, createTable(createTableRequest.tableName)];
                case 10: return [2 /*return*/, _b.sent()];
                case 11:
                    describeTableRequest = request;
                    return [4 /*yield*/, describeTable(describeTableRequest.tableName)];
                case 12: return [2 /*return*/, _b.sent()];
                case 13:
                    console.log('MpgDataServer: execute request: invalid request type:', request.actiontype);
                    throw new Error('MpgDataServer: execute request: invalid request type:' + request.actiontype);
                case 14: return [3 /*break*/, 16];
                case 15:
                    error_7 = _b.sent();
                    return [2 /*return*/, error_7];
                case 16: return [2 /*return*/];
            }
        });
    });
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// lambda entry point
//////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.handler = function (requestData) { return __awaiter(_this, void 0, void 0, function () {
    var request, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                console.log('MpgDataServer: request:', requestData);
                request = requestData;
                return [4 /*yield*/, executeRequest(request)];
            case 1: return [2 /*return*/, _a.sent()];
            case 2:
                error_8 = _a.sent();
                return [2 /*return*/, error_8];
            case 3: return [2 /*return*/];
        }
    });
}); };
