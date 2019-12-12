//////////////////////////////////////////////////////////////////////////////////////////////////////////
// MPG Data Server module as a lambda function      
// Server for MyJournal
//////////////////////////////////////////////////////////////////////////////////////////////////////////
import * as MpgData from '../myjournalapp/src/MpgDataDef'
import { DynamoDB, AWSError } from '../myjournalapp/node_modules/aws-sdk'
const database = new DynamoDB.DocumentClient({ apiVersion: '2012-08-10' })
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// list items
//////////////////////////////////////////////////////////////////////////////////////////////////////////
async function listItems(tableName: string) {
    let dataServerresponse: MpgData.IMpgDataServerResponse = {
        returnCode: MpgData.MpgDataServerReturnCode.UnknowError,
        data: '',
        msg: 'Just entered function createItem'
    }
    try {
        console.log('MpgDataServer: listItems');
        let params = {
            TableName: tableName
        }
        let ddbResponse = await database.scan(params).promise()
        // if no error was raised that means that the operation was successful
        dataServerresponse = {
            returnCode: MpgData.MpgDataServerReturnCode.Success,
            data: JSON.stringify(ddbResponse.Items),
            msg: 'Items were retrieved'
        }
        console.log('MpgDataServer: listItems: result:', ddbResponse);

    } catch (error) {
        const ddbError = error as AWSError
        dataServerresponse = {
            returnCode: MpgData.MpgDataServerReturnCode.DdbError,
            data: '',
            msg: "DynamoDB error message: " + ddbError.message
        }
    }
    return dataServerresponse
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// create item
//////////////////////////////////////////////////////////////////////////////////////////////////////////
async function createItem(tableName: string, item: MpgData.MpgItemRecord) {
    let dataServerresponse: MpgData.IMpgDataServerResponse = {
        returnCode: MpgData.MpgDataServerReturnCode.UnknowError,
        data: '',
        msg: 'Just entered function createItem'
    }
    try {
        console.log('MpgDataServer: createItem: item:', item)
        const timestamp = new Date().getTime();
        const params = {
            TableName: tableName,
            Item: {
                dataFormatVersion: item.dataFormatVersion,
                id: item.id,
                class: item.class,
                name: item.name,
                category: item.category,
                description: item.description,
                importance: item.importance,
                createdAt: timestamp,
                updatedAt: timestamp,
                item1Id: item.item1Id,
                item2Id: item.item2Id,
            }
        }
        const ddbResoponse = await database.put(params).promise()
        // if no error was raised that means that the operation was successful
        dataServerresponse = {
            returnCode: MpgData.MpgDataServerReturnCode.Success,
            data: JSON.stringify(ddbResoponse),
            msg: 'Item was created'
        }
    } catch (error) {
        const ddbError = error as AWSError
        dataServerresponse = {
            returnCode: MpgData.MpgDataServerReturnCode.DdbError,
            data: '',
            msg: "DynamoDB error. Code:" + ddbError.code.toString() + ", message: " + ddbError.message
        }
    }
    return dataServerresponse
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// delete item
//////////////////////////////////////////////////////////////////////////////////////////////////////////
async function deleteItem(tableName: string, id: string) {
    let dataServerresponse: MpgData.IMpgDataServerResponse = {
        returnCode: MpgData.MpgDataServerReturnCode.UnknowError,
        data: '',
        msg: 'Just entered function createItem'
    }
    try {
        console.log('MpgDataServer: deleteItem: id:', id)
        const params = {
            TableName: tableName,
            Key: { id: id }
        }
        const ddbResponse = await database.delete(params).promise()
        // if no error was raised that means that the operation was successful
        dataServerresponse = {
            returnCode: MpgData.MpgDataServerReturnCode.Success,
            data: JSON.stringify(ddbResponse),
            msg: 'Item was deleted'
        }
    } catch (error) {
        const ddbError = error as AWSError
        dataServerresponse = {
            returnCode: MpgData.MpgDataServerReturnCode.DdbError,
            data: '',
            msg: "DynamoDB error message: " + ddbError.message
        }
    }
    return dataServerresponse
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// update item
//////////////////////////////////////////////////////////////////////////////////////////////////////////
async function updateItem(tableName: string, newItem: MpgData.MpgItemRecord) {
    let dataServerresponse: MpgData.IMpgDataServerResponse = {
        returnCode: MpgData.MpgDataServerReturnCode.UnknowError,
        data: '',
        msg: 'Just entered function createItem'
    }
    // direction: item.direction,
    // polarity: item.polarity,
    // relType: item.relType,
    try {
        console.log('MpgDataServer: updateItem: item:', newItem)
        const timestamp = new Date().getTime();
        const params = {
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
                ":u": timestamp,
            },
            ReturnValues: "NONE"
        }
        console.log("updateItem: params:", params);
        const ddbResponse = await database.update(params).promise()
        dataServerresponse = {
            returnCode: MpgData.MpgDataServerReturnCode.Success,
            data: JSON.stringify(ddbResponse),
            msg: 'Item was updated'
        }
    } catch (error) {
        const ddbError = error as AWSError
        dataServerresponse = {
            returnCode: MpgData.MpgDataServerReturnCode.DdbError,
            data: '',
            msg: "DynamoDB error message: " + ddbError.message
        }
    }
    return dataServerresponse
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// create table
//////////////////////////////////////////////////////////////////////////////////////////////////////////
async function createTable(tableName: string) {
    let dataServerResponse: MpgData.IMpgDataServerResponse = {
        returnCode: MpgData.MpgDataServerReturnCode.UnknowError,
        data: '',
        msg: 'Just entered function createItem'
    }
    try {
        const ddbDatabase = new DynamoDB({ apiVersion: '2012-08-10' })
        console.log('MpgDataServer: createTable: tableName:', tableName)
        const params = {
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
        }
        console.log("createTable: params:", params);
        const ddbResponse = await ddbDatabase.createTable(params).promise()
        // if no error was raised, it means that the operation was successful
        dataServerResponse = {
            returnCode: MpgData.MpgDataServerReturnCode.Success,
            data: ddbResponse.toString(),
            msg: 'Table was created'
        }
        return dataServerResponse
    } catch (error) {
        const ddbError = error as AWSError
        dataServerResponse = {
            returnCode: MpgData.MpgDataServerReturnCode.DdbError,
            data: '',
            msg: "DynamoDB error message: " + ddbError.message
        }
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// describe table
//////////////////////////////////////////////////////////////////////////////////////////////////////////
async function describeTable(tableName: string) {
    let dataServerResponse: MpgData.IMpgDataServerResponse = {
        returnCode: MpgData.MpgDataServerReturnCode.UnknowError,
        data: '',
        msg: 'Just entered function createTable'
    }
    try {
        const ddbDatabase = new DynamoDB({ apiVersion: '2012-08-10' })
        console.log('MpgDataServer: describeTable: tableName:', tableName)
        const params = {
            TableName: tableName
        }
        console.log("describeTable: params:", params);
        const ddbResponse = await ddbDatabase.describeTable(params).promise()
        const foundTableName = ddbResponse.Table.TableName
        if (foundTableName == tableName) {
            dataServerResponse = {
                returnCode: MpgData.MpgDataServerReturnCode.TableWasFound,
                data: JSON.stringify(ddbResponse),
                msg: 'Table was found'
            }
        }
        console.log("describeTable. result:", ddbResponse);
        return dataServerResponse
    } catch (error) {
        console.log("describeTable: error:", error);
        dataServerResponse = {
            returnCode: MpgData.MpgDataServerReturnCode.TableWasNotFound,
            data: '',
            msg: error
        }
        return dataServerResponse
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// execute request
//////////////////////////////////////////////////////////////////////////////////////////////////////////
async function executeRequest(request: MpgData.MpgDataRequest) {
    try {
        console.log('MpgDataServer: executeRequest: request:', request);
        switch (request.actiontype) {
            case MpgData.MpgDataActionTypes.ListItems:
                let listItemsRequest = request as MpgData.IListItemsAction
                return await listItems(listItemsRequest.tableName)
            case MpgData.MpgDataActionTypes.CreateItem:
                let createItemRequest = request as MpgData.ICreateItemAction
                return await createItem(createItemRequest.tableName, createItemRequest.item)
            case MpgData.MpgDataActionTypes.DeleteItem:
                let deleteItemRequest = request as MpgData.IDeleteItemAction
                return await deleteItem(deleteItemRequest.tableName, deleteItemRequest.id)
            case MpgData.MpgDataActionTypes.UpdateItem:
                const updateItemRequest = request as MpgData.IUpdateItemAction
                return await updateItem(updateItemRequest.tableName, updateItemRequest.item)
            case MpgData.MpgDataActionTypes.CreateTable:
                const createTableRequest = request as MpgData.ICreateTableAction
                return await createTable(createTableRequest.tableName)
            case MpgData.MpgDataActionTypes.DescribeTable:
                const describeTableRequest = request as MpgData.IDescribeTableAction
                return await describeTable(describeTableRequest.tableName)
            default:
                console.log('MpgDataServer: execute request: invalid request type:', request.actiontype);
                throw new Error('MpgDataServer: execute request: invalid request type:' + request.actiontype)
        }
    } catch (error) {
        return error
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// lambda entry point
//////////////////////////////////////////////////////////////////////////////////////////////////////////
//exports.handler = async (requestData: any) => {
export const handler = async (requestData: any) => {
    try {
        console.log('MpgDataServer: request:', requestData);
        let request = requestData as MpgData.MpgDataRequest
        return await executeRequest(request)
    } catch (error) {
        return error
    }
}