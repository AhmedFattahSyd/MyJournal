//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mpg Data Proxy module   
//////////////////////////////////////////////////////////////////////////////////////////////////////////
import MpgLogger from './MpgLogger'
import * as MpgData from './MpgDataDef'
import {MpgRemoteData} from './MpgRemoteData'
import {MpgLocalData} from './MpgLocalData'
///////////////////////////////////////////////////////////////////////////////////////////////
// local definitions
///////////////////////////////////////////////////////////////////////////////////////////////
export enum MpgDataMode {
    Local = "LOCAL",
    Remote = "REMOTE"
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mpg Data Proxy
//////////////////////////////////////////////////////////////////////////////////////////////////////////
export class MpgDataProxy {
    private mpgLogger: MpgLogger
    private mpgClientData: MpgRemoteData | MpgLocalData
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // constructor
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor (logger: MpgLogger, dataMode: MpgDataMode = MpgDataMode.Remote){
        this.mpgLogger = logger
        if(dataMode == MpgDataMode.Local){
            this.mpgClientData = new MpgLocalData(this.mpgLogger)
        }else{
            this.mpgClientData = new MpgRemoteData(this.mpgLogger)
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get data record
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    public getDataRecords = (): MpgData.MpgItemRecord[] => {
        return this.mpgClientData.getItemRecords()
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create item record
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    public createDataRecord = async (dataRecord: MpgData.MpgItemRecord)=>{
        await this.mpgClientData.createItemRecord(dataRecord)
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // set table name
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    public setTableName = (userName: string) => {
        this.mpgClientData.setTableName(userName)
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // load data from the server
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    public loadData = async() => {
        await this.mpgClientData.loadData()
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // delete data record
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    public deleteDataRecord = async (id: string) => {
        await this.mpgClientData.deleteItemRecord(id)
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update data record
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    public updateDataRecord = async (updatedDataRecord: MpgData.MpgItemRecord) => {
        await this.mpgClientData.updateItemRecord(updatedDataRecord)
    }
}