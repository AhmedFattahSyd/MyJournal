import { MpgDataClasses } from "./MpgDataClasses";

///////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mpg Data Definition Module
// defines data structure in database (DynamoDB)
//////////////////////////////////////////////////////////////////////////////////////////////////////////
export const tablePrefix = "MpgDataTable3"
export enum MpgRecordType {
  MpgItem = "MPG_ITEM"
}
export const DataFormatVersion = '2'
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mpg Item record
// item record is the superset of item classes
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// todo: rename topic, category, etc to TopicId, etc
// todo: investigate why we have etra property in database 'reltype'
export interface MpgItemRecord {
  dataFormatVersion: string,
  id: string,
  class: string,
  name: string,
  category: string,
  description: string,
  importance: number,
  createdAt: string,
  updatedAt: string,
  item1Id: string,
  item2Id: string,
}

export type MpgRecordBody = MpgItemRecord
export interface MpgRecord {
  recordType: MpgRecordType;
  body: MpgRecordBody;
}
export enum MpgDataActionTypes {
  CreateItem = "CREATE_ITEM",
  ListItems = "LIST_ITEMS",
  DeleteItem = "DELETE_ITEM",
  UpdateItem = "UPDATE_ITEM",
  CreateTable = "CREATE_TABLE",
  DescribeTable = "DESCRIBE_TABLE"
}
export interface ICreateItemAction {
  tableName: string;
  actiontype: MpgDataActionTypes;
  item: MpgItemRecord;
}
export interface IUpdateItemAction {
  tableName: string;
  actiontype: MpgDataActionTypes;
  item: MpgItemRecord;
}
export interface IDeleteItemAction {
  tableName: string;
  actiontype: MpgDataActionTypes;
  id: string;
}
export interface IListItemsAction {
  tableName: string;
  actiontype: MpgDataActionTypes;
}
export interface ICreateTableAction {
  tableName: string;
  actiontype: MpgDataActionTypes;
}
export interface IDescribeTableAction {
  tableName: string;
  actiontype: MpgDataActionTypes;
}
export type MpgDataRequest =
  | ICreateItemAction
  | IListItemsAction
  | IDeleteItemAction
  | IUpdateItemAction
  | ICreateTableAction
  | IDescribeTableAction;
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// MpgDataServerResponse
//////////////////////////////////////////////////////////////////////////////////////////////////////////
export interface IMpgDataServerResponse {
  returnCode: MpgDataServerReturnCode;
  data: string;
  msg: string;
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// MpgDataServerReturnCode
//////////////////////////////////////////////////////////////////////////////////////////////////////////
export enum MpgDataServerReturnCode {
  Success = "SUCCESS",
  TableWasNotFound = "TABLE_WAS_NOT_FOUND",
  TableWasFound = "TABLE_WAS_FOUND",
  DdbError = "DYNAMO_DB_ERROR",
  UnknowError = "UNKNOWN_ERROR"
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// lamda function response
//////////////////////////////////////////////////////////////////////////////////////////////////////////
export interface ILambdaResponse {
  StatusCode: string;
  Payload: string;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// export format
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export interface MpgExportedGrapg {
  MpgExportedTags: MpgExportedTag[]
  MpgExportedEntries: MpgExportedEntry[]
  MpgExportedViews: MpgExportedView[]
}
export interface MpgExportedRootItem {
  name: string
  class: MpgDataClasses
  priority: number
}
export interface MpgExportedCategory {
  rootItem: MpgExportedRootItem
}
export interface MpgExportedTag{
  parentTags: MpgExportedTag[]
}
export interface MpgExportedEntry{
  tags: MpgExportedTag[]
}
export interface MpgExportedView{
  tags: MpgExportedTag[]
}
