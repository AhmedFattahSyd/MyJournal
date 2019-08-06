///////////////////////////////////////////////////////////////////////////////////////////////
// define initial categories
///////////////////////////////////////////////////////////////////////////////////////////////
export enum MpgCategoryType {
    Entry = 'Entry',
    Tag = 'Tag',
    View = 'View'
 }
 export const MpgInitialCategories = [
     {name: MpgCategoryType.View, importance: 30},
     {name: MpgCategoryType.Entry, importance: 20},
     {name: MpgCategoryType.Tag, importance: 10},
 ]