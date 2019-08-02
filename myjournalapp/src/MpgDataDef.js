"use strict";
exports.__esModule = true;
///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mpg Data Definition Module
// defines data structure in database (DynamoDB)
//////////////////////////////////////////////////////////////////////////////////////////////////////////
exports.tablePrefix = "MpgDataTable3";
var MpgRecordType;
(function (MpgRecordType) {
    MpgRecordType["MpgItem"] = "MPG_ITEM";
})(MpgRecordType = exports.MpgRecordType || (exports.MpgRecordType = {}));
exports.DataFormatVersion = '2';
var MpgDataActionTypes;
(function (MpgDataActionTypes) {
    MpgDataActionTypes["CreateItem"] = "CREATE_ITEM";
    MpgDataActionTypes["ListItems"] = "LIST_ITEMS";
    MpgDataActionTypes["DeleteItem"] = "DELETE_ITEM";
    MpgDataActionTypes["UpdateItem"] = "UPDATE_ITEM";
    MpgDataActionTypes["CreateTable"] = "CREATE_TABLE";
    MpgDataActionTypes["DescribeTable"] = "DESCRIBE_TABLE";
})(MpgDataActionTypes = exports.MpgDataActionTypes || (exports.MpgDataActionTypes = {}));
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// MpgDataServerReturnCode
//////////////////////////////////////////////////////////////////////////////////////////////////////////
var MpgDataServerReturnCode;
(function (MpgDataServerReturnCode) {
    MpgDataServerReturnCode["Success"] = "SUCCESS";
    MpgDataServerReturnCode["TableWasNotFound"] = "TABLE_WAS_NOT_FOUND";
    MpgDataServerReturnCode["TableWasFound"] = "TABLE_WAS_FOUND";
    MpgDataServerReturnCode["DdbError"] = "DYNAMO_DB_ERROR";
    MpgDataServerReturnCode["UnknowError"] = "UNKNOWN_ERROR";
})(MpgDataServerReturnCode = exports.MpgDataServerReturnCode || (exports.MpgDataServerReturnCode = {}));
