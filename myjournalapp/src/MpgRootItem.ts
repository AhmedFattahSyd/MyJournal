//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mpg Data (Element)
// provides basic functions for items, topics, types, etc
//////////////////////////////////////////////////////////////////////////////////////////////////////////
import { MpgDataClasses } from './MpgDataClasses'
import { v4 as uuid } from 'uuid'
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// MpgRoot class
//////////////////////////////////////////////////////////////////////////////////////////////////////////
export default class MpgRootItem {
    private id: string;
    private class: MpgDataClasses
    private name: string 
    protected priority: number
    // MpgData can be item category or tag
    // private children: MpgRootItem[]
    // move tags down the heirarchy to item???
    // private tags: MpgRootItem[]
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // constructor
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    protected constructor (type: MpgDataClasses, name: string,importance: number = 0, id: string = '') {
        if(id.trim() === ''){
            this.id = uuid()
        }else{
            this.id = id
        }
        this.class = type
        this.name = name
        this.priority = 0
        // this.children = []
        this.priority = importance
        // this.tags = tags
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // getId
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getId = (): string =>{
        return this.id
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get class
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getClass = (): MpgDataClasses =>{
        return this.class
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get name
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getName = (): string =>{
        return this.name
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // set name
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    setName = (name: string) =>{
        this.name = name
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // get priority
    ///////////////////////////////////////////////////////////////////////////////////////////////
    getPriority = (): number => {
        return this.priority
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // set priority
    ///////////////////////////////////////////////////////////////////////////////////////////////
    setPriority = (priority: number) => {
        this.priority = priority
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // get children
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // getChildfren = () : MpgRootItem[] => {
    //     return this.children
    // }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // get tags
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // getTags = () : MpgRootItem[] => {
    //     return this.tags
    // }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // add tag
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // addTag = (tag: MpgRootItem) => {
    //     this.tags.push(tag)
    // }
}