//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mpg Category module
//////////////////////////////////////////////////////////////////////////////////////////////////////////
import MpgRootItem from './MpgRootItem';
import { MpgDataClasses } from './MpgDataClasses';
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mpg category (also refered to as type)
//////////////////////////////////////////////////////////////////////////////////////////////////////////
export default class MpgCategory extends MpgRootItem {
    // private children: MpgCategory[] = []
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // constructor
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor (name: string, importance: number, id: string = ''){
        super(MpgDataClasses.Category,name,importance, id)
    }
}