/////////////////////////////////////////////////////////////////////////////////////////////////////////
// My Personal Graph (MPG) User modeule
//////////////////////////////////////////////////////////////////////////////////////////////////////////
import Amplify, {Auth} from 'aws-amplify';
import {CognitoUser} from 'amazon-cognito-identity-js'
import { SignUpParams } from '@aws-amplify/auth/lib/types';
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// AWS Amplify configuration
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Amplify.configure(awsAmplifyConfig);
import aws_exports from './aws-exports';
import { AmazonAIPredictionsProvider } from '@aws-amplify/predictions';
Amplify.configure(aws_exports);
// Amplify.configure(awsconfig);
Amplify.addPluggable(new AmazonAIPredictionsProvider());
interface ISigninError {
    code: string,
    name: string,
    message: string
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// iterface userState
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export interface IUserState{
    signedIn: boolean
}
///////////////////////////////////////////////////////////////////////////////////////////////
// define interface for sigining result
///////////////////////////////////////////////////////////////////////////////////////////////
export interface ISigningResult {
    success: boolean,
    message: string
  }
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mpg User class
//////////////////////////////////////////////////////////////////////////////////////////////////////////
export class MpgUser {
    private userAuthenticated: boolean
    private userName: string
    // private cognitoUser: CognitoUser | undefined
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // constructor
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor () {
        this.userAuthenticated = false
        this.userName = 'User'
    }
    checkUserAuthenticationState = async ()=>{
        try{
            await Auth.currentAuthenticatedUser()
            // should check the response
            this.userAuthenticated = true
        }catch(error){
            console.log("MpgUser: isUserAuthenticated: erro",error);
            this.userAuthenticated = false
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // signin using async/wait
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    signin = async (userName: string, password: string): Promise<ISigningResult> => {
        let result: ISigningResult = {
                    success: false,
                    message: 'Unknown Error'
        }
        try {
            let user = await Auth.signIn(userName, password)
            let cognitoUser = user as CognitoUser
            this.userAuthenticated = true
            this.userName = cognitoUser.getUsername()
            result = {
                success: true,
                message: 'User has been signined successully'
            }
            return result
        }catch (err){
            this.userAuthenticated = false
            this.userName = 'User'
            result = {
                success: false,
                message: (err as ISigninError).message
            }
            return result
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // signup using async/wait
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    signup = async (userName: string, password: string, email: string): Promise<ISigningResult> => {
        let result: ISigningResult = {
                    success: false,
                    message: 'Unknown Error'
        }
        try {
            const signupParams: SignUpParams = {
                username: userName,
                password: password,
                attributes: {
                    email
                }
            }
            await Auth.signUp(signupParams)
            // should check the response (ISignupResult)
            result = {
                success: true,
                message: 'User has been signined up successully'
            }
            return result
        }catch (err){
            console.log(err)
            this.userAuthenticated = false
            this.userName = 'User'
            result = {
                success: false,
                message: (err as ISigninError).message
            }
            return result
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // confirm code
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    confirmSignup = async (userName: string, code: string): Promise<ISigningResult> => {
        let result: ISigningResult = {
                    success: false,
                    message: 'Unknown Error'
        }
        try {
            await Auth.confirmSignUp(userName,code)
            result = {
                success: true,
                message: 'User has been confirmed successully'
            }
            return result
        }catch (err){
            console.log(err)
            this.userAuthenticated = false
            this.userName = 'User'
            result = {
                success: false,
                message: (err as ISigninError).message
            }
            return result
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // signoff using async/wait
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    signout = async (): Promise<ISigningResult> => {
        let result: ISigningResult = {
            success: false,
            message: 'Unknown Error'
        }
        try {
            await Auth.signOut()
            this.userAuthenticated = false
            this.userName = 'User'
            result = {
                success: true,
                message: 'User has been sign out successully'
            }
            return result
        }catch (err){
            result = {
                success: false,
                message: err
            }
            return result
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get use name
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getUserName = (): string => {
        return this.userName
    }
    // //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // // is user authenticated
    // //////////////////////////////////////////////////////////////////////////////////////////////////////////
    isUserAuthenticated = (): boolean => {
        this.checkUserAuthenticationState()
        return this.userAuthenticated
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // userSignedIn
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    userSignedIn = (): boolean => {
        return this.userAuthenticated
    }
}