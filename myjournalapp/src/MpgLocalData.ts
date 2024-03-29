//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mpg local data module   
//////////////////////////////////////////////////////////////////////////////////////////////////////////
import MpgLogger from './MpgLogger'
import * as MpgData from './MpgDataDef'
import { MpgError } from './MpgError';
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mpg local data class
//////////////////////////////////////////////////////////////////////////////////////////////////////////
export class MpgLocalData {
    mpgLogger: MpgLogger
    private userDataTableName = ''
    private itemRecords: MpgData.MpgItemRecord[] = []
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // constructor
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor (logger: MpgLogger){
        this.mpgLogger = logger
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get item record
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    public getItemRecords = (): MpgData.MpgItemRecord[] => {
        return this.itemRecords
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // set table name
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    public setTableName = (userName: string) => {
        this.userDataTableName = MpgData.tablePrefix+userName
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create item record
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    public createItemRecord = async (itemRecord: MpgData.MpgItemRecord)=>{
        try{
            this.mpgLogger.debug("MpgLocalData: createItemRecord: item record:",itemRecord)
        }catch (error) {
            throw new MpgError("MpgLocalData: createItemrecord: error invoking fetch :"+error.toString())
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // load data from the server
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    public loadData = async() => {
        try{
            this.mpgLogger.debug("MpgLocalData: loadData")
        }catch (error) {
            throw new MpgError("MpgLocalData: loadData: error invoking fetch :"+error.toString())
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // delete item record
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    public deleteItemRecord = async (id: string) => {
        try{
            this.mpgLogger.debug("MpgLocalData: deleteItemRecord: id",id)
        }catch (error) {
            throw new MpgError("MpgLocalData: deleteItemRecord: error invoking fetch :"+error.toString())
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update item record
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    public updateItemRecord = async (updatedItemRecord: MpgData.MpgItemRecord) => {
        try{
            this.mpgLogger.debug("MpgLocalData: updateItemRecord: updatedItemRecord",updatedItemRecord)
        }catch (error) {
            throw new MpgError("MpgLocalData: updateItemRecord: error invoking fetch :"+error.toString())
        }
    }
}