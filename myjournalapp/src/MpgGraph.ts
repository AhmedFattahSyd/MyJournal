////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mpg Graph module
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import { MpgUser } from "./MpgUser";
import MpgLogger from "./MpgLogger";
import MpgCategory from "./MpgCategory";
import { MpgError } from "./MpgError";
import { MpgDataClasses, MpgRelNames } from "./MpgDataClasses";
import { MpgItemRecord as MpgDataRecord } from "./MpgDataDef";
import { MpgInitialCategories, MpgCategoryType } from "./MpgInitialCategories";
import { MpgDataProxy, MpgDataMode } from "./MpgDataProxy";
import MpgItem from "./MpgItem";
import MpgRel from "./MpgRel";
///////////////////////////////////////////////////////////////////////////////////////////////
// display mode mode
///////////////////////////////////////////////////////////////////////////////////////////////
export enum MpgDisplayMode {
  // View = "View",
  Create = "Create",
  Update = "Update",
  // we should check the removal of 'list' doesn't break anything
  // List = "List"
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MpgGraph class
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export default class MpgGraph {
  private mpgUser: MpgUser = new MpgUser();
  private mpgLogger: MpgLogger;
  private showMessage: Function;
  private dataRefreshedFun: Function;
  private allCategories: MpgCategory[] = [];
  private error: MpgError | undefined = undefined;
  private unexpectedError: boolean = false;
  private mpgDataProxy: MpgDataProxy;
  private userName = "New user";
  private dataHasJustBeenInitialised = false;
  private GraphFormatVersion = "2";
  private userDataTableExists = false;
  private allItems: MpgItem[] = [];
  private viewCreateUpdateMode: MpgDisplayMode = MpgDisplayMode.Create;
  private currentItemId = "";
  private filteredAllItems: MpgItem[] = [];
  private currentCategoryId: string = "";
  protected allEntries: MpgItem[] = [];
  protected allTags: MpgItem[] = [];
  private reCalcNetPriority = false
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // constructor
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  constructor(
    mpgLogger: MpgLogger,
    showMessageFunctiuon: Function,
    dataRefreshedFun: Function
  ) {
    this.mpgLogger = mpgLogger;
    this.showMessage = showMessageFunctiuon;
    this.dataRefreshedFun = dataRefreshedFun;
    this.mpgDataProxy = new MpgDataProxy(mpgLogger, MpgDataMode.Remote);
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // init
  // initialise lists of objects
  // check user's table and if empty populate with builtin objects
  ///////////////////////////////////////////////////////////////////////////////////////////////
  public init = async (userName: string) => {
    try {
      this.clearData();
      this.userName = userName;
      this.mpgDataProxy.setTableName(userName);
      await this.checkIfTableEmptyAndInit();
      this.currentCategoryId = this.allCategories[0].getId();
    } catch (err) {
      this.error = new MpgError("MpgGraph: init:" + (err as Error).message);
      this.unexpectedError = true;
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // clear data
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  clearData = () => {
    this.allItems = [];
    this.allCategories = [];
    this.allEntries = [];
    this.allTags = [];
    this.filteredAllItems = [];
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // getMpguser
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  public getMpguser = (): MpgUser => {
    return this.mpgUser;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // get view category id
  ///////////////////////////////////////////////////////////////////////////////////////////////
  public getViewCategoryId = (): string | undefined => {
    let viewCategoryId = undefined;
    for (let category of this.allCategories) {
      if (category.getName() == MpgCategoryType.View) {
        viewCategoryId = category.getId();
        break;
      }
    }
    return viewCategoryId;
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // invoke data refreshed function
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  invokeDataRefreshedFun = async () => {
    // this.mpgLogger.debug('MpgGraph: invokeDataRefreshedFun: allEntries',this.allEntries)
    if(this.reCalcNetPriority){
      this.calcNetPriority4AllItems()
    }
    await this.dataRefreshedFun(
      this.error,
      this.unexpectedError,
      this.getAllCategoriesSorted(),
      this.getFilteredAllItemsSorted(),
      this.currentCategoryId,
      this.currentItemId,
      this.viewCreateUpdateMode,
      this.allTags,
      this.allEntries,
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // create entry (without saving it)
  ///////////////////////////////////////////////////////////////////////////////////////////////
  createActionInstance = (
    name: string,
    importance: number = 0
  ): MpgItem | undefined => {
    let action: MpgItem | undefined = undefined;
    const actionCategoryId = this.getEntryCategoryId();
    if (actionCategoryId != undefined) {
      action = new MpgItem(actionCategoryId, name, importance);
      this.allItems.push(action);
      this.allEntries.push(action);
    }
    return action;
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // create entry
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  createEntry = async (entry: MpgItem) => {
    // this.mpgLogger.debug(`MpgGraph: createItem: item importance:${importance}`)
    try {
      await this.mpgDataProxy.createDataRecord(
        this.copyItemToDataRecord(entry)
      );
    } catch (err) {
      this.error = new MpgError("MpgGraph: saveGoal:" + (err as Error).message);
      this.unexpectedError = true;
    }
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // copyItemToItemRecord
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  copyItemToDataRecord = (item: MpgItem): MpgDataRecord => {
    const itemRecord: MpgDataRecord = {
      dataFormatVersion: this.GraphFormatVersion,
      id: item.getId(),
      class: MpgDataClasses.Item,
      name: item.getName(),
      category: item.getCategoryId(),
      description: "NULL",
      item1Id: "NULL",
      item2Id: "NULL",
      importance: item.getPriority(),
      createdAt: "NULL",
      updatedAt: "NULL"
    };
    return itemRecord;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // add tags to item
  ///////////////////////////////////////////////////////////////////////////////////////////////
  addTagsToItem = (item: MpgItem, tags: MpgItem[]) => {
    const allTags: MpgItem[] = item.getTags();
    tags.forEach(tag => {
      if (allTags.indexOf(tag) == -1) {
        allTags.push(tag);
      }
    });
    this.updateItemDetails(
      item.getId(),
      item.getCategoryId(),
      item.getName(),
      item.getPriority(),
      allTags
    );
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // update item details
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  updateItemDetails = async (
    itemId: string,
    categoryId: string,
    name: string,
    importance: number,
    newTags: MpgItem[] = [],
    newParents: MpgItem[] = [],
    newActions: MpgItem[] = []
  ) => {
    // this.mpgLogger.debug(`MpgGraph: update item: item name:`, name)
    try {
      const item = this.getItemById(itemId);
      if (item != undefined) {
        // this.mpgLogger.debug(`MpgGraph: update item: item's relations:`,item.getTagRels())
        if (this.isCategoryIdValid(categoryId)) {
          item.setCategoryId(categoryId);
          item.setName(name);
          item.setPriority(importance);
          await this.mpgDataProxy.updateDataRecord(
            this.copyItemToDataRecord(item)
          );
          // now update item tags
          this.updateItemTagRels(item, newTags);
          this.updateItemParentRels(item, newParents);
          this.setAllEntries();
          // this.setAllGoals()
          this.setAllTags();
          // this.mpgLogger.debug(`MpgGraph: update item: item updated: item`,item)
        } else {
          throw new MpgError(
            `MpgGraph: updateItem: category is undefined. id:${categoryId}`
          );
        }
      } else {
        throw new MpgError(
          `MpgGraph: updateItem: item is undefined. id:${itemId}`
        );
      }
    } catch (error) {
      this.mpgLogger.unexpectedError("MpgGraph: updateItem:", error);
    } finally {
      // this.setAllGoals()
      this.reCalcNetPriority = true
      this.invokeDataRefreshedFun();
    }
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // set all tags
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  setAllTags = () => {
    const tagCategoryId = this.getTagCategoryId();
    if (tagCategoryId != undefined) {
      this.allTags = [];
      for (let item of this.allItems) {
        if (item.getCategoryId() == tagCategoryId) {
          this.allTags.push(item);
        }
      }
    } else {
      this.error = new MpgError(
        `MpgGraph: setAllTags: unable to init tags. tagCategoryId is undefined`
      );
      this.unexpectedError = true;
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // get tag category id
  ///////////////////////////////////////////////////////////////////////////////////////////////
  public getTagCategoryId = (): string | undefined => {
    let tagCategoryId = undefined;
    for (let category of this.allCategories) {
      if (category.getName() == MpgCategoryType.Tag) {
        tagCategoryId = category.getId();
        break;
      }
    }
    return tagCategoryId;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // set all entries
  ///////////////////////////////////////////////////////////////////////////////////////////////
  setAllEntries = () => {
    this.allEntries = [];
    this.allItems.forEach(item => {
      const itemTypeId = item.getCategoryId();
      if (itemTypeId == this.getEntryCategoryId()) {
        this.allEntries.push(item);
      }
    });
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // update tag Rels
  ///////////////////////////////////////////////////////////////////////////////////////////////
  updateItemTagRels = (item: MpgItem, newTags: MpgItem[]) => {
    // add new tags: tags that exist in the newTags but not in the old tags
    const tagsToBeCreated = newTags.filter(
      tag => item.getTags().indexOf(tag) === -1
    );
    // this.mpgLogger.debug(`MpgGraph: updateItemTagRels: tagRelsToBeCreated:`, tagsToBeCreated)
    tagsToBeCreated.forEach(tagRel => {
      this.createItemTagRel(item, tagRel);
    });
    // delete tags that exists in the old tags but not in the newTags
    const tagsToBeDeleted = item
      .getTags()
      .filter(tag => newTags.indexOf(tag) === -1);
    // this.mpgLogger.debug(`MpgGraph: updateItemTagRels: tagRelsToBeDeleted:`, tagsToBeDeleted)
    tagsToBeDeleted.forEach(tag => {
      // this.mpgLogger.debug(`MpgGraph: updateItemTagRels: deleteing rel for tag:`, tag)
      // get the crosponding tagRel
      const tagRel = item.getTagRel4Tag(tag);
      if (tagRel != undefined) {
        // remove from item
        // this.mpgLogger.debug(`MpgGraph: updateItemTagRels: deleteing tagRel:`, tagRel)
        this.removeTagRelFromItem(item, tagRel);
        this.deleteTagRel(tagRel.getId());
      } else {
        throw new MpgError(
          `MpgGraph: updateItemtagRels. TagRel not found. id:${tag.getId()}`
        );
      }
    });
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // update parent Rels
  ///////////////////////////////////////////////////////////////////////////////////////////////
  updateItemParentRels = (item: MpgItem, newParents: MpgItem[]) => {
    // add new parents: parents that exist in the newParents but not in the old parents
    const parentsToBeCreated = newParents.filter(
      parent => item.getParents().indexOf(parent) === -1
    );
    // this.mpgLogger.debug(`MpgGraph: updateItemTagRels: tagRelsToBeCreated:`, tagsToBeCreated)
    parentsToBeCreated.forEach(parentRel => {
      this.createItemParentRel(item, parentRel);
    });
    // delete parents that exists in the old parents but not in the newParents
    const parentsToBeDeleted = item
      .getParents()
      .filter(parent => newParents.indexOf(parent) === -1);
    // this.mpgLogger.debug(`MpgGraph: updateItemTagRels: tagRelsToBeDeleted:`, tagsToBeDeleted)
    parentsToBeDeleted.forEach(parent => {
      // this.mpgLogger.debug(`MpgGraph: updateItemTagRels: deleteing rel for tag:`, tag)
      // get the crosponding parentRel
      const parentRel = item.getParentRel4Parent(parent);
      if (parentRel != undefined) {
        // remove from item
        // this.mpgLogger.debug(`MpgGraph: updateItemTagRels: deleteing tagRel:`, tagRel)
        this.removeParentRelFromItem(item, parentRel);
        this.deleteTagRel(parentRel.getId());
      } else {
        throw new MpgError(
          `MpgGraph: updateItemtagRels. TagRel not found. id:${parent.getId()}`
        );
      }
    });
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // get Ancestors of an item
  // returns an array all ancestors (not in any order)
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // getAncestors = (item: MpgItem, ancestors: MpgItem[] = []) : MpgItem[] => {
  //   const foundAncestors: MpgItem[] = ancestors
  //   item.getParents().forEach(parent => {
  //       if(foundAncestors.includes(parent)){
  //         this.mpgLogger.unexpectedError('MpgGraph: getAncestors: parent is already in set'+
  //           'Item:'+item.getName()+' parent:'+parent.getName())
  //       }else{
  //         foundAncestors.push(parent)
  //         this.getAncestors(parent, foundAncestors)
  //       }
  //   })
  //   return foundAncestors
  // }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // get descendants of an item
  // returns an array all descendants (not in any order)
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // getDescendants = (item: MpgItem, descendants: MpgItem[] = []) : MpgItem[] => {
  //   const foundDescendants: MpgItem[] = descendants
  //   item.getChildren().forEach(child => {
  //       if(foundDescendants.includes(child)){
  //         this.mpgLogger.unexpectedError('MpgGraph: getDescendants: child is already in set'+
  //           'Item:'+item.getName()+' child:'+child.getName())
  //       }else{
  //         foundDescendants.push(child)
  //         this.getDescendants(child, foundDescendants)
  //       }
  //   })
  //   return foundDescendants
  // }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // get item full title(s)
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getFullTitle = (tag: MpgItem, items2process: MpgItem[] = []): string[] => {
    let fullTitle: string[] = []
    let branches: MpgItem[][] = []
    // build the branches until you reach root item
    const parents = tag.getParents()
    if(parents.length == 0){
      fullTitle.push(tag.getName())
    }else{
      parents.forEach(parent=>{
        fullTitle.push('')
        items2process.push(parent)
      })
    }
    return fullTitle
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // calc item net priority for an entry
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  calcItemNetPriority = (item: MpgItem)=>{
    if(this.isCategoryIdTag(item.getCategoryId())){
      this.calcTagNetPriority(item)
    }else{
      // we will treat entry of view the same for the time being
      // later on we may treat them differently
      this.calcEntryNetPriority(item)
    }
    // net prioriy = item's priority + sum of tag's priority
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // calc tag net priority  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  calcTagNetPriority = (tag: MpgItem)=> {
    let netPriority = tag.getPriority()
    tag.getParents().forEach(parent=>{
      netPriority += parent.getNetPriority()
    })
    tag.setNetPriority(netPriority)
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // calc entry (or view) net priority
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  calcEntryNetPriority = (entry: MpgItem)=>{
    let netPriority = entry.getPriority()
    const tags = entry.getTags()
    tags.forEach(tag=>{
      netPriority += tag.getNetPriority()
    })
    entry.setNetPriority(netPriority)
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // remove tag rel from item
  ///////////////////////////////////////////////////////////////////////////////////////////////
  removeTagRelFromItem = (item: MpgItem, tagRel: MpgRel) => {
    const tagRelIndex = item.getTagRels().indexOf(tagRel);
    if (tagRelIndex != -1) {
      item.getTagRels().splice(tagRelIndex, 1);
    } else {
      throw new MpgError(
        `MpgGraph: removeTagRelFromItem. TagRel not found. id: ${tagRel.getId()}`
      );
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // remove parent rel from item
  ///////////////////////////////////////////////////////////////////////////////////////////////
  removeParentRelFromItem = (item: MpgItem, parentRel: MpgRel) => {
    const parentRelIndex = item.getParentRels().indexOf(parentRel);
    if (parentRelIndex != -1) {
      item.getParentRels().splice(parentRelIndex, 1);
    } else {
      throw new MpgError(
        `MpgGraph: removeParentRelFromItem. parentRel not found. id: ${parentRel.getId()}`
      );
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // get entries with all tags
  ///////////////////////////////////////////////////////////////////////////////////////////////
  getEntriesWithAllTag = (tags: MpgItem[]): MpgItem[] => {
    const foundItems: MpgItem[] = [];
    if (tags.length > 0) {
      this.allEntries.forEach(entry => {
        if (entry.hasAllTags(tags)) {
          // don't include current item
          if(entry.getId() !== this.currentItemId){
            foundItems.push(entry);
          }
        }
      });
    }
    return this.sortEntries(foundItems)
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // sort entries
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  sortEntries = (entries: MpgItem[]): MpgItem[] => {
    return entries.sort((item1, item2) => {
      return item2.getNetPriority() - item1.getNetPriority();
    });
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // get entries with all tags or their children
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getEntriesWithAllTagsOrChildren = (tags: MpgItem[]) : MpgItem[] => {
    const foundItems: MpgItem[] = [];
    // create sets that has tags and their children
    const tagsWithChildren: MpgItem[][] = []
    tagsWithChildren.push(tags)
    this.mpgLogger.debug('MpgGraph: getEntriesWithAllTagsOrChildren: tagsWithChildren after inserting origibal tags:',
      tagsWithChildren)
    let tagChildren: MpgItem[] = []
    let index = 0
    let altTagSet: MpgItem[] =[]
    for(let currentTag of tags){
      altTagSet = tags
      // get descendents
      tagChildren = this.getTagChildren(currentTag.getId())
      this.mpgLogger.debug('MpgGraph: getEntriesWithAllTagsOrChildren: tagsChildren:',
      tagChildren)
      for(let childTag of tagChildren){
        this.mpgLogger.debug('MpgGraph: getEntriesWithAllTagsOrChildren: altTagSet at start of loop:',
        altTagSet)
        // remove current tag
        index = altTagSet.findIndex(item => item.getId() === currentTag.getId())
        altTagSet.splice(index, 1)
        altTagSet.push(childTag)
        this.mpgLogger.debug('MpgGraph: getEntriesWithAllTagsOrChildren: altTagSet at end of loop:',
        altTagSet)
        tagsWithChildren.push(altTagSet)
      }
    }
    this.mpgLogger.debug('MpgGraph: getEntriesWithAllTagsOrChildren: tagsWithChildren:',
      tagsWithChildren)
    // let currentFoundItems: MpgItem[] = []
    // for(let tagSet of tagsWithChildren){
    //   currentFoundItems = this.getEntriesWithAllTag(tagSet)
    //   for(let foundItem of currentFoundItems){
    //     currentFoundItems.push(foundItem)
    //   }
    // }
    return foundItems
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // remove tags from item
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  removeTagsFromItem = async (id: string, tags: MpgItem[])=>{
    const item = this.getItemById(id)
    try{
      if(item != undefined){
        item.removeTags(tags)
      }else{
        throw new MpgError('MpgGraph: removeTagsFromItem: undefined item for id:'+id)
      }
    }catch (error){
      this.mpgLogger.unexpectedError('MpgGraph: removeTagsFromItem: error:',error)
    }finally{
      this.invokeDataRefreshedFun()
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // get tag names for item
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getTagNames = (item: MpgItem): string =>{
    let tagsNames = ''
    let tags: MpgItem[] = []
    if(this.isCategoryIdTag(item.getCategoryId())){
      tags = item.getParents()
    }else{
      tags = item.getTags()
    }
    tags.forEach(tag=>{
      tagsNames += tag.getName() + ', '
    })
    return tagsNames
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // get children of a tag
  // returns direct children only not all descendents
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getTagChildren = (currentTagId: string): MpgItem[] => {
    const foundChildren: MpgItem[] = []
    let parent: MpgItem
    // get the tag
    let currentTag = this.getTagById(currentTagId)
    if(currentTag !== undefined){
      // make sure it's a tag
      const categoryId = currentTag.getCategoryId()
      if(this.isCategoryIdTag(categoryId)){
        // scan all tags and check if they are child
        for(let tag of this.allTags){
          // this.mpgLogger.debug('MpgGraph: getTagChildren: examining tag',
          // tag.getName())
          const parentRels = tag.getParentRels()
          for(let parentRel of parentRels){
            parent = parentRel.getItem2()
            // this.mpgLogger.debug('MpgGraph: getTagChildren: parent',
            // parent.getName(), 'child is:', parentRel.getItem1().getName())
            if(parent.getId() === currentTagId){
              foundChildren.push(parentRel.getItem1())
            }
          }
        }
      }else{
        this.mpgLogger.unexpectedError('MpgGraph: getTagChildren: category is not tag id:'+categoryId)
      }
    }else{
      this.mpgLogger.unexpectedError('MpgGraph: getTagChildren: tag is undefined. id:'+currentTagId)
    }
    return foundChildren
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // is category id tag
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  isCategoryIdTag = (id: string): boolean => {
    let idIsTag = false
    let category = this.getCategoryById(id)
    if(category !== undefined){
      if(category.getName() == MpgCategoryType.Tag){
        idIsTag = true
      }
    }else{
      this.mpgLogger.unexpectedError('MpgGraph: isCategoryTag: catgeory is undefined. id:'+id)
    }
    return idIsTag
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // create new item
  // this item could be Tag, Entry or view
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  createItem = async (
    categoryId: string,
    name: string,
    priority: number,
    tags: MpgItem[] = [],
    parents: MpgItem[] = [],
    actions: MpgItem[] = []
  ) => {
    // this.mpgLogger.debug(`MpgGraph: createItem: itemname:`,name)
    try {
      if (this.isCategoryIdValid(categoryId)) {
        // create the new item with empty TagRels first and then populate them
        const item = new MpgItem(categoryId, name, priority);
        // this.mpgLogger.debug(`MpgGraph: createItem: item :`,item)
        await this.mpgDataProxy.createDataRecord(
          this.copyItemToDataRecord(item)
        );
        // save tags
        for (const tag of tags) {
          this.createItemTagRel(item, tag);
        }
        // save parents
        for (const parent of parents) {
          this.createItemParentRel(item, parent);
        }
        this.allItems.push(item);
        this.setAllTags();
        this.setAllEntries();
        this.setFilteredAllItems();
        // we will set this a the current item to cope with the crreation 'on the fly' situation
        this.currentItemId = item.getId();
        // this.mpgLogger.debug(`MpgGraph: createItem`,` current item id:`,this.currentItemId)
        this.viewCreateUpdateMode = MpgDisplayMode.Update
      } else {
        throw new MpgError("MpgGraph: createItem: category is undefined");
      }
    } catch (err) {
      this.error = new MpgError(
        "MpgGraph: createItem:" + (err as Error).message
      );
      this.unexpectedError = true;
    } finally {
      this.reCalcNetPriority = true
      this.invokeDataRefreshedFun();
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // is current category view
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  isCurrentCategoryView = (): boolean => {
    let isView = false;
    try {
      const currentCategory = this.getCategoryById(this.currentCategoryId);
      if (currentCategory !== undefined) {
        if (currentCategory.getName() === MpgCategoryType.View) {
          isView = true;
        }
      }
    } catch (err) {
      this.error = new MpgError(
        "MpgGraph: isCurrenTcategoryView:" + (err as Error).message
      );
      this.unexpectedError = true;
    }
    return isView;
  };
   ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // is current category tag
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  isCurrentCategoryTag = (): boolean => {
    let isTag = false;
    try {
      const currentCategory = this.getCategoryById(this.currentCategoryId);
      if (currentCategory !== undefined) {
        if (currentCategory.getName() === MpgCategoryType.Tag) {
          isTag = true;
        }
      }
    } catch (err) {
      this.error = new MpgError(
        "MpgGraph: isCurrenTcategoryTag:" + (err as Error).message
      );
      this.unexpectedError = true;
    }
    return isTag;
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // get current category name
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getCyrrentCateoryName = (): string => {
    let currentCateogyName = "Unknow category";
    try {
      const currentCategory = this.getCategoryById(this.currentCategoryId);
      if (currentCategory !== undefined) {
        currentCateogyName = currentCategory.getName();
      }
    } catch (err) {
      this.error = new MpgError(
        "MpgGraph: isCurrenTcategoryEntry:" + (err as Error).message
      );
      this.unexpectedError = true;
    }
    return currentCateogyName;
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // is current category entry
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  isCurrenTcategoryEntry = (): boolean => {
    let isEntry = false;
    try {
      const currentCategory = this.getCategoryById(this.currentCategoryId);
      if (currentCategory !== undefined) {
        if (currentCategory.getName() === MpgCategoryType.Entry) {
          isEntry = true;
        }
      }
    } catch (err) {
      this.error = new MpgError(
        "MpgGraph: isCurrenTcategoryEntry:" + (err as Error).message
      );
      this.unexpectedError = true;
    }
    return isEntry;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // getCurrentItemId
  ///////////////////////////////////////////////////////////////////////////////////////////////
  getCurrentItemId = (): string => {
    return this.currentItemId;
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // saveTag
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  saveTag = async (tag: MpgItem) => {
    // this.mpgLogger.debug(`MpgGraph: createItem: item importance:${importance}`)
    try {
      await this.mpgDataProxy.createDataRecord(this.copyItemToDataRecord(tag));
      this.allItems.push(tag);
      this.allTags.push(tag);
    } catch (err) {
      this.error = new MpgError("MpgGraph: savetag:" + (err as Error).message);
      this.unexpectedError = true;
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // create tag (without saving it)
  ///////////////////////////////////////////////////////////////////////////////////////////////
  createTagInstance = (
    name: string,
    priority: number = 0
  ): MpgItem | undefined => {
    let tag: MpgItem | undefined = undefined;
    const tagCategoryId = this.getTagCategoryId();
    if (tagCategoryId != undefined) {
      tag = new MpgItem(tagCategoryId, name, priority);
    }
    return tag;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // get tag by id
  ///////////////////////////////////////////////////////////////////////////////////////////////
  getTagById = (id: string): MpgItem | undefined => {
    let foundTag: MpgItem | undefined = undefined;
    for (let tag of this.allTags) {
      if (tag.getId() == id) {
        foundTag = tag;
        break;
      }
    }
    return foundTag;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // create tag rel
  ///////////////////////////////////////////////////////////////////////////////////////////////
  createItemTagRel = async (item: MpgItem, tag: MpgItem) => {
    let newTagRel: MpgRel | undefined = undefined;
    try {
      newTagRel = new MpgRel(MpgRelNames.Tag, item, tag);
      await this.mpgDataProxy.createDataRecord(
        this.copyRelToItemRecord(newTagRel)
      );
      // add to the item
      item.addTagRel(newTagRel);
      // this.allTagRels.push(newTagRel)
    } catch (err) {
      this.error = new MpgError(
        "MpgGraph: saveItemTag:" + (err as Error).message
      );
      this.unexpectedError = true;
    } finally {
      // consider not to invoke this as the creation of tags/ parents always happens in the
      // context of creating or updating items
      this.invokeDataRefreshedFun();
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // create parent rel
  ///////////////////////////////////////////////////////////////////////////////////////////////
  createItemParentRel = async (item: MpgItem, parent: MpgItem) => {
    let newParentRel: MpgRel | undefined = undefined;
    try {
      newParentRel = new MpgRel(MpgRelNames.Parent, item, parent);
      await this.mpgDataProxy.createDataRecord(
        this.copyRelToItemRecord(newParentRel)
      );
      // add to the item
      item.addParentRel(newParentRel);
    } catch (err) {
      this.error = new MpgError(
        "MpgGraph: saveItemParent:" + (err as Error).message
      );
      this.unexpectedError = true;
    } finally {
      this.invokeDataRefreshedFun();
    }
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // copyRelToItemRecord
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  copyRelToItemRecord = (rel: MpgRel): MpgDataRecord => {
    const itemRecord: MpgDataRecord = {
      dataFormatVersion: this.GraphFormatVersion,
      id: rel.getId(),
      class: MpgDataClasses.Rel,
      name: rel.getName(),
      category: "NULL",
      description: "NULL",
      item1Id: rel.getItem1().getId(),
      item2Id: rel.getItem2().getId(),
      importance: rel.getPriority(),
      createdAt: "NULL",
      updatedAt: "NULL"
    };
    return itemRecord;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // is Category Id valid?
  ///////////////////////////////////////////////////////////////////////////////////////////////
  isCategoryIdValid = (categoryId: string): boolean => {
    let categoryIdValid = false;
    if (categoryId == "NULL" || this.getCategoryById(categoryId) != undefined) {
      categoryIdValid = true;
    }
    return categoryIdValid;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // get Entry category id
  ///////////////////////////////////////////////////////////////////////////////////////////////
  public getEntryCategoryId = (): string | undefined => {
    let actionCategoryId = undefined;
    for (let category of this.allCategories) {
      if (category.getName() == MpgCategoryType.Entry) {
        actionCategoryId = category.getId();
        break;
      }
    }
    return actionCategoryId;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // set current item id
  ///////////////////////////////////////////////////////////////////////////////////////////////
  setCurrentItemId = async (id: string) => {
    this.currentItemId = id;
    await this.invokeDataRefreshedFun();
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // delete all item rels
  ///////////////////////////////////////////////////////////////////////////////////////////////
  deleteAllItemRels = (item: MpgItem) => {
    item.getTagRels().forEach(tagRel => {
      // this.mpgLogger.debug(`MpgGraph: deleteAllItemRels deleteing rel to tag: ${tagRel.getItem2().getName()}`)
      this.deleteTagRel(tagRel.getId());
      item.removeTagRel(tagRel);
    });
    item.getParentRels().forEach(parentRel => {
      // this.mpgLogger.debug(`MpgGraph: deleteAllItemRels deleteing rel to tag: ${tagRel.getItem2().getName()}`)
      item.removeParentRel(parentRel);
    });
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // delete Tag Rel
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  deleteTagRel = async (id: string) => {
    try {
      // this.allTagRels = this.allTagRels.filter(tagRel=> tagRel.getId() != id)
      // this.mpgLogger.debug(`MpgGraph: deleteTagRel deleteing rel with id: ${id}`)
      await this.mpgDataProxy.deleteDataRecord(id);
    } catch (err) {
      this.mpgLogger.unexpectedError(err, "MpgGraph: deleteTagRel: error:");
    } finally {
      this.invokeDataRefreshedFun();
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // set current all items of the same category as current category
  ///////////////////////////////////////////////////////////////////////////////////////////////
  setFilteredAllItems = () => {
    const currentCategory = this.getCategoryById(this.currentCategoryId);
    if (currentCategory != undefined) {
      this.filteredAllItems = [];
      for (let item of this.allItems) {
        if (item.getCategoryId() == this.currentCategoryId) {
          this.filteredAllItems.push(item);
        }
      }
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // getFilteredAllItems
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getFilteredAllItemsSorted = (): MpgItem[] => {
    let foundItems: MpgItem[] = [];
    const currentCategory = this.getCategoryById(this.currentCategoryId);
    if (currentCategory != undefined) {
      for (let item of this.allItems) {
        if (item.getCategoryId() == this.currentCategoryId) {
          foundItems.push(item);
        }
      }
    }
    foundItems = foundItems.sort((item1, item2) => {
      return item2.getNetPriority() - item1.getNetPriority();
    });
    this.filteredAllItems = foundItems;
    return foundItems;
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // delete tagRel in all tagRels
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  deleteItemInAllItems = (id: string) => {
    try {
      let item = this.getItemById(id);
      if (item != undefined) {
        let index = this.allItems.indexOf(item);
        if (index != -1) {
          this.allItems.splice(index, 1);
        }
        this.setFilteredAllItems();
      } else {
        throw new MpgError(
          "MpgGraph: deleteIteItemFromAllItems: item was not found with id:" +
            id
        );
      }
    } catch (error) {
      this.error = new MpgError(error.toString());
      this.unexpectedError = true;
    }
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // delete item
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  deleteItem = async (id: string) => {
    try {
      const item = this.getItemById(id);
      if (item != undefined) {
        // this.mpgLogger.debug(`MpgGraph: deleteItem: deleteing item: ${item.getName()}`)
        this.deleteAllItemRels(item);
        this.deleteItemInAllItems(id);
        await this.mpgDataProxy.deleteDataRecord(id);
        // this.mpgLogger.debug("MpgGraph: deleteItem: items after delete:", MpgRootItem.getItemsByClass(MpgItemClasses.Item))
      } else {
        throw new MpgError(`MpgGraph: deletItem: item is undefined: id:${id}`);
      }
    } catch (err) {
      this.mpgLogger.unexpectedError(err, "MpgGraph: deleteItem: error:");
    } finally {
      // this.setAllGoals()  // should we be invoking setAllRel too?
      this.reCalcNetPriority = true
      this.invokeDataRefreshedFun();
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // getAllCategoriesSorted
  ///////////////////////////////////////////////////////////////////////////////////////////////
  getAllCategoriesSorted = (): MpgCategory[] => {
    const sortedCategories = this.allCategories.sort((item1, item2) => {
      return item2.getPriority() - item1.getPriority();
    });
    return sortedCategories;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // set create or update mode
  ///////////////////////////////////////////////////////////////////////////////////////////////
  setDisplayMode = async (mode: MpgDisplayMode) => {
    this.viewCreateUpdateMode = mode;
    await this.invokeDataRefreshedFun();
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // get item type
  ///////////////////////////////////////////////////////////////////////////////////////////////
  getItemType = (itemId: string): string | undefined => {
    let itemType = undefined;
    const item = this.getItemById(itemId);
    if (item != undefined) {
      const category = this.getCategoryById(item.getCategoryId());
      if (category != undefined) {
        itemType = category.getName();
      }
    }
    return itemType;
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // get item by id
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  getItemById = (id: string): MpgItem | undefined => {
    let foundItem: MpgItem | undefined = undefined;
    for (let item of this.allItems) {
      if (item.getId() == id) {
        foundItem = item;
      }
    }
    return foundItem;
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // get cetgory by id
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  getCategoryById = (id: string): MpgCategory | undefined => {
    let foundCategory: MpgCategory | undefined = undefined;
    for (let category of this.allCategories) {
      if (category.getId() == id) {
        foundCategory = category;
      }
    }
    return foundCategory;
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // check if table empty and init
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  checkIfTableEmptyAndInit = async () => {
    try {
      // await this.mpgDataProxy.loadData()
      await this.loadData();
      this.userDataTableExists = true;
      // if (this.mpgDataProxy.getDataRecords().length == 0) {
      if (this.allCategories.length == 0) {
        this.debug("checkIfTableEmptyAndInit: table is empty");
        await this.initData();
      }
    } catch (error) {
      throw new MpgError(
        "MpgGraph:checkIfTableEmptyAndInit:" + (error as Error).message
      );
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // debug
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  debug = (...objects: any) => {
    this.mpgLogger.debug("MpgGraph: ", objects);
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // init data
  ///////////////////////////////////////////////////////////////////////////////////////////////
  private initData = async () => {
    this.showMessage("Initialising data ...");
    try {
      await this.initAppItems();
    } catch (error) {
      this.mpgLogger.unexpectedError(
        "MpgGraph: initData: unexpected error:",
        error
      );
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // init other objects
  // overrides base class initOtherObjects
  ///////////////////////////////////////////////////////////////////////////////////////////////
  protected initAppItems = async () => {
    await this.initCategories();
    // await this.initTags()
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // init categories
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  initCategories = async () => {
    try {
      for (let initialCategory of MpgInitialCategories) {
        const category = new MpgCategory(
          initialCategory.name,
          initialCategory.importance
        );
        await this.createCategory(category);
      }
    } catch (error) {
      this.mpgLogger.unexpectedError(
        "MpgGraph: initCategories: unexpected error:",
        error
      );
    }
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // create category
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  createCategory = async (category: MpgCategory) => {
    try {
      await this.mpgDataProxy.createDataRecord(
        this.copyCategoryToItemRecord(category)
      );
      this.allCategories.push(category);
    } catch (err) {
      this.error = new MpgError(
        "MpgGraph: createCategory:" + (err as Error).message
      );
      this.unexpectedError = true;
    } finally {
      // we are not creating category dynamically, so we don't need this. delete
      // if (!this.dataHasJustBeenInitialised) {
      //     this.invokeDataRefreshedFun()
      // }
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // load data
  ///////////////////////////////////////////////////////////////////////////////////////////////
  loadData = async () => {
    this.showMessage("Loading data ...");
    try {
      await this.mpgDataProxy.loadData();
      await this.loadRecordsIntoObjects();
      // this.mpgLogger.debug("MpgGraph: loadData: items:",this.allItems)
      this.setFilteredAllItems();
      this.setAllEntries()
      this.setAllTags()
      this.showMessage("Data loaded ...");
    } catch (error) {
      this.error = new MpgError(
        "MpgGraph: loadData: error:" + (error as Error).message
      );
      this.unexpectedError = true;
    } finally {
      this.reCalcNetPriority = true
      await this.invokeDataRefreshedFun();
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // calc net priority for all items
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  calcNetPriority4AllItems = () => {
    this.allItems.forEach(item=>{
      this.calcItemNetPriority(item)
    })
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // get current category id
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getCurrentCategoryId = (): string => {
    return this.currentCategoryId;
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // load records into objects
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  loadRecordsIntoObjects = () => {
    try {
      // load categories
      for (let itemRecord of this.mpgDataProxy.getDataRecords()) {
        if (itemRecord.class == MpgDataClasses.Category) {
          //loading category
          // this.mpgLogger.debug("MpgGraph: loadRecordsIntoObjects: loading category:",itemRecord)
          this.loadCategory(itemRecord);
        }
      }
      // load items
      for (let itemRecord of this.mpgDataProxy.getDataRecords()) {
        if (itemRecord.class == MpgDataClasses.Item) {
          // this.mpgLogger.debug("MpgGraph: loadRecordsIntoObjects: loading category:",itemRecord)
          this.loadItem(itemRecord);
        }
      }
      // load relationships
      for (let itemRecord of this.mpgDataProxy.getDataRecords()) {
        if (itemRecord.class == MpgDataClasses.Rel) {
          // this.mpgLogger.debug("MpgGraph: loadRecordsIntoObjects: loading category:",itemRecord)
          this.loadRel(itemRecord);
        }
      }
    } catch (error) {
      this.error = error;
      this.unexpectedError = true;
    } finally {
      this.invokeDataRefreshedFun();
    }
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // load Rel
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  loadRel = (dataRecord: MpgDataRecord) => {
    try {
      // validated that items exist
      const item1 = this.getItemById(dataRecord.item1Id);
      if (item1 != undefined) {
        const relatedItem = this.getItemById(dataRecord.item2Id);
        if (relatedItem != undefined) {
          // check what type of rel
          switch (dataRecord.name) {
            case MpgRelNames.Tag: {
              const tagRel = new MpgRel(
                dataRecord.name,
                item1,
                relatedItem,
                dataRecord.id
              );
              // this.mpgLogger.debug(`MpgGraph: loadRel: loading tag: ${tagOrGoal.getName()} for item: ${item1.getName()},
              //     recordItem:${dataRecord.id}, tagReg:`,tagRel)
              // this.allTagRels.push(tagRel)
              item1.addTagRel(tagRel);
              // this.mpgLogger.debug(`MpgGraph: loadRel: item's relations:`,item1.getTagRels())
              break;
            }
            case MpgRelNames.Parent: {
              const parentRel = new MpgRel(
                dataRecord.name,
                item1,
                relatedItem,
                dataRecord.id
              );
              item1.addParentRel(parentRel);
              // this.mpgLogger.debug(`MpgGraph: loadRel: item's relations:`,item1.getTagRels())
              break;
            }
            default: {
              throw new MpgError(
                `MpgGraph: loadRel: inavlid rel type: type:${dataRecord.name}`
              );
            }
          }
        } else {
          throw new MpgError(
            `MpgGraph: loadRel: tag does not exist. id: ${dataRecord.item2Id}`
          );
        }
      } else {
        throw new MpgError(
          `MpgGraph: loadRel: item does not exist. id: ${dataRecord.item1Id}`
        );
      }
    } catch (error) {
      // this.error = new MpgError(`MpgGraph: loadRel: Error:` + error.toString())
      // this.unexpectedError = true
      // report the error, delete the rel and continue
      this.mpgLogger
        .debug(`MpgGraph: loadRel: error loading rel: ${error.toString()}. 
                rel will be deleted`);
      this.deleteTagRel(dataRecord.id);
    } finally {
      this.invokeDataRefreshedFun();
    }
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // load item
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  loadItem = (itemRecord: MpgDataRecord) => {
    // this.mpgLogger.debug(`MpgGraph: loadItem: itemrecotd: ${itemRecord}`)
    const categoryId = itemRecord.category;
    if (this.isCategoryIdValid(itemRecord.category)) {
      const item = new MpgItem(
        categoryId,
        itemRecord.name,
        itemRecord.importance,
        itemRecord.id
      );
      this.allItems.push(item);
      this.setFilteredAllItems();
    } else {
      this.unexpectedError = true;
      this.error = new MpgError(
        `MpgGraph: loadItem: category was not found. Id=${itemRecord.category}`
      );
    }
    this.invokeDataRefreshedFun();
  };
  /////////////////////////////////////////////////////////////////////////////////////////////////////////
  // load category
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  loadCategory = (itemRecord: MpgDataRecord) => {
    const category = new MpgCategory(
      itemRecord.name,
      itemRecord.importance,
      itemRecord.id
    );
    this.allCategories.push(category);
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // set current category
  ///////////////////////////////////////////////////////////////////////////////////////////////
  setCurrentCategoryId = async (id: string) => {
    //  this.mpgLogger.debug("MpgGraph: setCategoryId:")
    this.currentCategoryId = id;
    this.setFilteredAllItems();
    await this.invokeDataRefreshedFun();
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // get action by id
  ///////////////////////////////////////////////////////////////////////////////////////////////
  getActionById = (id: string): MpgItem | undefined => {
    let foundAction: MpgItem | undefined = undefined;
    for (let action of this.allEntries) {
      if (action.getId() == id) {
        foundAction = action;
        break;
      }
    }
    return foundAction;
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // copyCategoryToItemRecord
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  copyCategoryToItemRecord = (category: MpgCategory): MpgDataRecord => {
    const itemRecord: MpgDataRecord = {
      dataFormatVersion: this.GraphFormatVersion,
      id: category.getId(),
      class: MpgDataClasses.Category,
      name: category.getName(),
      category: "NULL",
      description: "NULL",
      item1Id: "NULL",
      item2Id: "NULL",
      importance: category.getPriority(),
      createdAt: "NULL",
      updatedAt: "NULL"
    };
    return itemRecord;
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // doesUserDataTableExists()
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  doesUserDataTableExists = (): boolean => {
    return this.userDataTableExists;
  };
}
