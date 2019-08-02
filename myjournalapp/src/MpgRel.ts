/////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mpg Rel module  
//////////////////////////////////////////////////////////////////////////////////////////////////////////
import MpgRootItem from './MpgRootItem';
import { MpgDataClasses, MpgRelNames } from './MpgDataClasses';
import MpgItem from './MpgItem';
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mpg Rel class
//////////////////////////////////////////////////////////////////////////////////////////////////////////
export default class MpgRel extends MpgRootItem {
    private item1: MpgItem
    private item2: MpgItem
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // constructor
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(name: MpgRelNames, item1: MpgItem, item2: MpgItem, id: string = '') {
        super(MpgDataClasses.Rel, name, 0,id)
        this.item1 = item1
        this.item2 = item2
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get item 1
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getItem1 = (): MpgItem => {
        return this.item1
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get item 2
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getItem2 = (): MpgItem => {
        return this.item2
    }
}