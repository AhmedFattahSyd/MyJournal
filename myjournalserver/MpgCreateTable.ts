//////////////////////////////////////////////////////////////////////////////////////////////////////////
// MPG Data initialisation lambda function
//////////////////////////////////////////////////////////////////////////////////////////////////////////
import * as MpgData from '../myjournalapp/src/MpgDataDef'
import { Lambda } from '../myjournalapp/node_modules/aws-sdk'
const lambdaFuntionName = 'mpg-data-server-06'
const lambda = new Lambda({ region: 'ap-southeast-2', apiVersion: '2015-03-31' })
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// lambda entry point
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export const handler = async (event: any) => {
    try {
        console.log('MpgDataInit: event:', event)
        const userName = event.userName
        console.log('MpgDataInit: userName:', userName)
        const tableName = MpgData.tablePrefix + userName
        await createTable(tableName)
        return (event)
    } catch (error) {
        return error
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// create table
//////////////////////////////////////////////////////////////////////////////////////////////////////////
async function createTable(tableName: string) {
    try {
        console.log('MpgDataInit: createTbale tableName:', tableName)
        const JSONData: MpgData.ICreateTableAction = {
            actiontype: MpgData.MpgDataActionTypes.CreateTable,
            tableName: tableName
        }
        const stringData = JSON.stringify(JSONData)
        const pullParams = {
            FunctionName: lambdaFuntionName,
            InvocationType: 'RequestResponse',
            Payload: stringData,
            LogType: 'None'
        }
        const response = await lambda.invoke(pullParams).promise()
        console.log("createTable: lambda response", response)
        const statusCode = response.StatusCode
        if (statusCode == 200) {
            // success from lambda
            // check dynamodb errors
            const mpgDataResponse = JSON.parse(response.Payload as string) as MpgData.IMpgDataServerResponse
            if (mpgDataResponse.returnCode == MpgData.MpgDataServerReturnCode.Success) {
                console.log("MpgClientData: createTable: table was created")
            } else {
                // error from dynamoDB
                // this.logger.debug("MpgClientData: createItemrecord: eroror from DynamoDB:",mpgDataResponse.msg)
                console.log("createTable: eroror from DynamoDB:" + mpgDataResponse.msg)
            }
        } else {
            // error from lambda
            console.log("createTable: error from lambda function:", response)
        }
    } catch (error) {
        console.log("createTable: error ", error)
    }
}