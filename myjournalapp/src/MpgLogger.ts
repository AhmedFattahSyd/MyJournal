//////////////////////////////////////////////////////////////////////////////////////////////////////////
// MpgLogger module
//////////////////////////////////////////////////////////////////////////////////////////////////////////
import { MpgError } from './MpgError';
export enum MpgLoggingMode {
    dev = 'Development',
    debug = 'Debug',
    prod = 'Production'
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// MpgLog class
//////////////////////////////////////////////////////////////////////////////////////////////////////////
export default class MpgLogger {
    private mode: MpgLoggingMode
    private handleUnexpectedError: Function
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // constructor
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor (handleFatalAppError: Function) {
        this.handleUnexpectedError = handleFatalAppError
        this. mode = MpgLoggingMode.dev
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // set logging mode
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    setLoggingMode = (mode: MpgLoggingMode)=>{
        this.mode = mode
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // log
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    log = (...objects: any) => {
        if(this.mode != MpgLoggingMode.prod){
            console.log("MpgLogger: time:",new Date(),": debug content:",objects)
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // error
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    error = (err: MpgError) => {
        console.log("MpgLog: error: code:",", message:",err.message,", stack trace:",err.stack);
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // debug
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    debug = (...objects: any) => {
        if(this.mode == MpgLoggingMode.debug){
            console.log("MpgLogger: time:",new Date(),": debug content:",objects)
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // fatal error
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    unexpectedError = (msg: string, err: any = '')=>{
        this.debug(msg, err)
        let errorMsg = ''
        if(err != undefined){
            errorMsg = msg+err.toString()
        }
        this.handleUnexpectedError(errorMsg,msg)
    }
} 