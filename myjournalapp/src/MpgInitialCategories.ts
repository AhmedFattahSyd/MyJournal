///////////////////////////////////////////////////////////////////////////////////////////////
// define initial categories
///////////////////////////////////////////////////////////////////////////////////////////////
export enum MpgCategoryNames {
    Entry = 'Entry',
    Tag = 'Tag',
    View = 'View'
 }
 export const MpgInitialCategories = [
     {name:  MpgCategoryNames.View, importance: 30},
     {name:  MpgCategoryNames.Entry, importance: 20},
     {name:  MpgCategoryNames.Tag, importance: 10},
 ]