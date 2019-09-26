import { tablePrefix } from "./MpgDataDef";
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mpg Client data module
//////////////////////////////////////////////////////////////////////////////////////////////////////////
import MpgLogger from "./MpgLogger";
import * as MpgData from "./MpgDataDef";
import { Auth } from "aws-amplify";
import { Lambda } from "aws-sdk";
import { MpgError } from "./MpgError";
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mpg Client data class
//////////////////////////////////////////////////////////////////////////////////////////////////////////
export class MpgRemoteData {
  mpgLogger: MpgLogger;
  private userDataTableName = "";
  readonly lambdaFuntionName = "mpg-data-server-06";
  private itemRecords: MpgData.MpgItemRecord[] = [];
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // constructor
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  constructor(logger: MpgLogger) {
    this.mpgLogger = logger;
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // get item record
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  public getItemRecords = (): MpgData.MpgItemRecord[] => {
    return this.itemRecords;
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // create item record
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  public createItemRecord = async (itemRecord: MpgData.MpgItemRecord) => {
    try {
      // this.mpgLogger.debug("MpgClientData: createItemRecord: item record:",itemRecord)
      let cred = await Auth.currentCredentials();
      let lambda = new Lambda({
        region: "ap-southeast-2",
        apiVersion: "2015-03-31",
        credentials: Auth.essentialCredentials(cred)
      });
      let JSONData: MpgData.ICreateItemAction = {
        tableName: this.userDataTableName,
        actiontype: MpgData.MpgDataActionTypes.CreateItem,
        item: itemRecord
      };
      let stringData = JSON.stringify(JSONData);
      var pullParams = {
        FunctionName: this.lambdaFuntionName,
        InvocationType: "RequestResponse",
        Payload: stringData,
        LogType: "None"
      };
      const response = await lambda.invoke(pullParams).promise();
      // check status code
      const statusCode = response.StatusCode;
      if (statusCode === 200) {
        // success from lambda
        // check dynamodb errors
        const mpgDataResponse = JSON.parse(
          response.Payload as string
        ) as MpgData.IMpgDataServerResponse;
        if (
          mpgDataResponse.returnCode === MpgData.MpgDataServerReturnCode.Success
        ) {
          // this.mpgLogger.debug("MpgClientData: createItemRecord: item was careated successfully: mpgDataResponse:",
          // mpgDataResponse)
          // success from mpg data server\
          // do nothing
        } else {
          // error from dynamoDB
          // this.mpgLogger.debug("MpgClientData: createItemrecord: error from DynamoDB:",mpgDataResponse.msg)
          throw new MpgError(
            "MpgClientData: createItemrecord: error from DynamoDB:" +
              mpgDataResponse.msg
          );
        }
      } else {
        // error from lambda
        throw new MpgError(
          "MpgClientData: createItemrecord: error from lambda function:" +
            response.toString()
        );
      }
    } catch (error) {
      throw new MpgError(
        "MpgClientData: createItemrecord: error invoking lambda function:" +
          error.toString()
      );
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // set table name
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  public setTableName = (userName: string) => {
    this.userDataTableName = tablePrefix + userName;
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // load data from the server
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  public loadData = async () => {
    try {
      let cred = await Auth.currentCredentials();
      let lambda = new Lambda({
        region: "ap-southeast-2",
        apiVersion: "2015-03-31",
        credentials: Auth.essentialCredentials(cred)
      });
      let JSONData: MpgData.IListItemsAction = {
        tableName: this.userDataTableName,
        actiontype: MpgData.MpgDataActionTypes.ListItems
      };
      let stringData = JSON.stringify(JSONData);
      // this.logger.debug("MpgClientData: loadData, request data: ",stringData);
      var pullParams = {
        FunctionName: this.lambdaFuntionName,
        InvocationType: "RequestResponse",
        Payload: stringData,
        LogType: "None"
      };
      let lambdaesponse = await lambda.invoke(pullParams).promise();
      // check lambda status code
      const statusCode = lambdaesponse.StatusCode;
      if (statusCode === 200) {
        // success from lambda
        // check ddb response
        const mpgDataResponse = JSON.parse(
          lambdaesponse.Payload as string
        ) as MpgData.IMpgDataServerResponse;
        if (
          mpgDataResponse.returnCode === MpgData.MpgDataServerReturnCode.Success
        ) {
          // success from mpg data server
          // parse items
          const itemData = mpgDataResponse.data;
          // this.logger.debug('Success. data :',itemData)
          this.itemRecords = JSON.parse(
            itemData as string
          ) as MpgData.MpgItemRecord[];
          // this.logger.debug('MpgClientData: loadData: items',this.itemRecords)
        } else {
          // error from dynamoDB
          // this.logger.debug("MpgClientData: loadData: error from DynamoDB:",mpgDataResponse.msg)
          throw new MpgError(
            "MpgClientData: loadData: error from DynamoDB:" +
              mpgDataResponse.msg
          );
        }
      } else {
        // error from lambda
        throw new MpgError(
          "MpgClientData: loadData: error from lambda function:" +
            lambdaesponse.toString()
        );
      }
    } catch (error) {
      this.mpgLogger.unexpectedError(
        error,
        "MpgClientData: loadData: Error:  "
      );
    }
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // wait
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  private wait = (delay: number) => {
    return new Promise(resolve => setTimeout(resolve, delay));
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // delete item record
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  public deleteItemRecord = async (id: string) => {
    try {
      let cred = await Auth.currentCredentials();
      let lambda = new Lambda({
        region: "ap-southeast-2",
        apiVersion: "2015-03-31",
        credentials: Auth.essentialCredentials(cred)
      });
      let JSONData: MpgData.IDeleteItemAction = {
        tableName: this.userDataTableName,
        actiontype: MpgData.MpgDataActionTypes.DeleteItem,
        id: id
      };
      let stringData = JSON.stringify(JSONData);
      var pullParams = {
        FunctionName: this.lambdaFuntionName,
        InvocationType: "RequestResponse",
        Payload: stringData,
        LogType: "None"
      };
      const response = await lambda.invoke(pullParams).promise();
      const statusCode = response.StatusCode;
      if (statusCode === 200) {
        // success from lambda
        // check dynamodb errors
        const mpgDataResponse = JSON.parse(
          response.Payload as string
        ) as MpgData.IMpgDataServerResponse;
        if (
          mpgDataResponse.returnCode === MpgData.MpgDataServerReturnCode.Success
        ) {
          // success from mpg data server\
          // do nothing
        } else {
          // error from dynamoDB
          this.mpgLogger.debug(
            "MpgClientData: deleteItemrecord: error from DynamoDB:",
            mpgDataResponse.msg
          );
          throw new MpgError(
            "MpgClientData: deleteItemrecord: error from DynamoDB:" +
              mpgDataResponse.msg
          );
        }
      } else {
        // error from lambda
        throw new MpgError(
          "MpgClientData: deleteItemrecord: error from lambda function:" +
            response.toString()
        );
      }
    } catch (error) {
      this.mpgLogger.unexpectedError(
        error,
        "MpgGraph: deleteItemRecortd: Error:  "
      );
    }
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // update item record
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  public updateItemRecord = async (
    updatedItemRecord: MpgData.MpgItemRecord
  ) => {
    // this.mpgLogger.debug(`MpgRemoteData: update item: itemRecotd: ${updatedItemRecord}`)
    try {
      let cred = await Auth.currentCredentials();
      let lambda = new Lambda({
        region: "ap-southeast-2",
        apiVersion: "2015-03-31",
        credentials: Auth.essentialCredentials(cred)
      });
      let JSONData: MpgData.IUpdateItemAction = {
        tableName: this.userDataTableName,
        actiontype: MpgData.MpgDataActionTypes.UpdateItem,
        item: updatedItemRecord
      };
      let stringData = JSON.stringify(JSONData);
      var pullParams = {
        FunctionName: this.lambdaFuntionName,
        InvocationType: "RequestResponse",
        Payload: stringData,
        LogType: "None"
      };
      const response = await lambda.invoke(pullParams).promise();
      const statusCode = response.StatusCode;
      if (statusCode === 200) {
        // success from lambda
        // check dynamodb errors
        const mpgDataResponse = JSON.parse(
          response.Payload as string
        ) as MpgData.IMpgDataServerResponse;
        // this.mpgLogger.debug(`MpgRemoteData: update item: mpgDataResponse: ${mpgDataResponse}`)
        if (
          mpgDataResponse.returnCode === MpgData.MpgDataServerReturnCode.Success
        ) {
          // success from mpg data server\
          // do nothing
        } else {
          // error from dynamoDB
          this.mpgLogger.debug(
            "MpgClientData: updateItemrecord: error from DynamoDB:",
            mpgDataResponse.msg
          );
          throw new MpgError(
            "MpgClientData: updateItemrecord: error from DynamoDB:" +
              mpgDataResponse.msg
          );
        }
      } else {
        // error from lambda
        throw new MpgError(
          "MpgClientData: dupdateItemrecord: error from lambda function:" +
            response.toString()
        );
      }
    } catch (error) {
      this.mpgLogger.unexpectedError(
        error,
        "MpgClientData: updateItem: error:"
      );
    }
  };
}
