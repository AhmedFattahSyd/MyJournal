////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mpg Graph module
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
import { MpgUser } from './MpgUser';
import MpgLogger from './MpgLogger';
import MpgCategory from './MpgCategory';
import { MpgError } from './MpgError';
import { MpgDataClasses, MpgRelNames } from './MpgDataClasses';
import { MpgItemRecord as MpgDataRecord} from './MpgDataDef';
import { MpgInitialCategories, MpgCategoryNames } from './MpgInitialCategories';
import { MpgDataProxy, MpgDataMode } from './MpgDataProxy';
import MpgItem from './MpgItem';
import MpgRel from './MpgRel';
///////////////////////////////////////////////////////////////////////////////////////////////
// Create or update mode 
///////////////////////////////////////////////////////////////////////////////////////////////
export enum CreateOrUpdateModes {
    Create = 'CREATE',
    Update = 'UPDATE'
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MpgGraph class
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
export default class MpgGraph {
    private mpgUser: MpgUser = new MpgUser()
    private mpgLogger: MpgLogger
    private showMessage: Function
    private dataRefreshedFun: Function
    private allCategories: MpgCategory[] = []
    private error: MpgError | undefined = undefined
    private unexpectedError: boolean = false
    private mpgDataProxy: MpgDataProxy
    private userName = 'New user'
    private dataHasJustBeenInitialised = false
    private GraphFormatVersion = '2'
    private userDataTableExists = false
    private allItems: MpgItem[] = []
    private createOrUpdateMode: CreateOrUpdateModes = CreateOrUpdateModes.Create
    private currentItemId = ''
    private filteredAllItems: MpgItem[] = []
    private currentCategoryId: string = ''
    protected allEntries: MpgItem[] = []
    protected allTags: MpgItem[] = []
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // constructor
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    constructor(mpgLogger: MpgLogger, showMessageFunctiuon: Function, dataRefreshedFun: Function) {
        this.mpgLogger = mpgLogger
        this.showMessage = showMessageFunctiuon
        this.dataRefreshedFun = dataRefreshedFun
        this.mpgDataProxy = new MpgDataProxy(mpgLogger, MpgDataMode.Remote)
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // init
    // initialise lists of objects
    // check user's table and if empty populate with builtin objects
    ///////////////////////////////////////////////////////////////////////////////////////////////
    public init = async (userName: string) => {
        this.allCategories = []
        this.userName = userName
        this.mpgDataProxy.setTableName(userName)
        await this.checkIfTableEmptyAndInit()
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // getMpguser
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    public getMpguser = (): MpgUser => {
        return this.mpgUser
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // invoke data refreshed function
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    invokeDataRefreshedFun = async () => {
        // this.mpgLogger.debug('MpgGraph: invokeDataRefreshedFun: all categories',this.allCategories)
        await this.dataRefreshedFun(
            this.error,
            this.unexpectedError,
            this.getAllCategoriesSorted(),
            this.filteredAllItems,
            this.currentCategoryId,
            this.currentItemId,
            this.createOrUpdateMode,
        )
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // create entry (without saving it)
    ///////////////////////////////////////////////////////////////////////////////////////////////
    createActionInstance = (name: string, importance: number = 0): MpgItem | undefined => {
        let action: MpgItem | undefined = undefined
        const actionCategoryId = this.getEntryCategoryId()
        if (actionCategoryId != undefined) {
            action = new MpgItem(actionCategoryId, name, importance)
            this.allItems.push(action)
            this.allEntries.push(action)
        }
        return action
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // save entry
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    saveEntry = async (action: MpgItem) => {
        // this.mpgLogger.debug(`MpgGraph: createItem: item importance:${importance}`)
        try {
            await this.mpgDataProxy.createDataRecord(this.copyItemToDataRecord(action))
        } catch (err) {
            this.error = new MpgError("MpgGraph: saveGoal:" + (err as Error).message)
            this.unexpectedError = true
        }
    }
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
            description: 'NULL',
            item1Id: 'NULL',
            item2Id: 'NULL',
            importance: item.getImportance(),
            createdAt: 'NULL',
            updatedAt: 'NULL',
        }
        return itemRecord
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // add tags to item
    ///////////////////////////////////////////////////////////////////////////////////////////////
    addTagsToItem = (item: MpgItem, tags: MpgItem[]) => {
        const allTags: MpgItem[] = item.getTags()
        tags.forEach(tag=>{
            if(allTags.indexOf(tag) == -1){
                allTags.push(tag)
            }
        })
        this.updateItem(item.getId(), item.getCategoryId(), item.getName(), item.getImportance(), allTags)
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // update item 
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    updateItem = async (itemId: string, categoryId: string, name: string, importance: number,
        newTags: MpgItem[] = [], newGoals: MpgItem[] = [], newActions: MpgItem[] = []) => {
        // this.mpgLogger.debug(`MpgGraph: update item: new name: ${name}`)
        try {
            const item = this.getItemById(itemId)
            if (item != undefined) {
                // this.mpgLogger.debug(`MpgGraph: update item: item's relations:`,item.getTagRels())
                if (this.isCategoryIdValid(categoryId)) {
                    item.setCategoryId(categoryId)
                    item.setName(name)
                    item.setImportance(importance)
                    await this.mpgDataProxy.updateDataRecord(this.copyItemToDataRecord(item))
                    // now update item tags
                    this.updateItemTagRels(item, newTags)
                    this.setAllEntries()
                    // this.setAllGoals()
                    this.setAllTags()
                } else {
                    throw new MpgError(`MpgGraph: updateItem: category is undefined. id:${categoryId}`)
                }
            } else {
                throw new MpgError(`MpgGraph: updateItem: item is undefined. id:${itemId}`)
            }
        } catch (error) {
            this.mpgLogger.unexpectedError("MpgGraph: updateItem:", error)
        } finally {
            // this.setAllGoals()
            this.invokeDataRefreshedFun()
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // set all tags
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    setAllTags = () => {
        const tagCategoryId = this.getTagCategoryId()
        if (tagCategoryId != undefined) {
            this.allTags = []
            for (let item of this.allItems) {
                if (item.getCategoryId() == tagCategoryId) {
                    this.allTags.push(item)
                }
            }
        } else {
            this.error = new MpgError(`MpgGraph: setAllTags: unable to init tags. tagCategoryId is undefined`)
            this.unexpectedError = true
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // get tag category id
    ///////////////////////////////////////////////////////////////////////////////////////////////
    public getTagCategoryId = (): string | undefined => {
        let tagCategoryId = undefined
        for (let category of this.allCategories) {
            if (category.getName() == MpgCategoryNames.Tag) {
                tagCategoryId = category.getId()
                break
            }
        }
        return tagCategoryId
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // set all entries
    ///////////////////////////////////////////////////////////////////////////////////////////////
    setAllEntries = () => {
        this.allEntries = []
        this.allItems.forEach(item => {
            const itemTypeId = item.getCategoryId()
            if (itemTypeId == this.getEntryCategoryId()) {
                this.allEntries.push(item)
            }
        })
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // update tag Rels
    ///////////////////////////////////////////////////////////////////////////////////////////////
    updateItemTagRels = (item: MpgItem, newTags: MpgItem[]) => {
        // add new tags: tags that exist in the newTags but not in the old tags
        const tagsToBeCreated = newTags.filter(tag => item.getTags().indexOf(tag) === -1)
        // this.mpgLogger.debug(`MpgGraph: updateItemTagRels: tagRelsToBeCreated:`, tagsToBeCreated)
        tagsToBeCreated.forEach(tagRel => {
            this.createItemTagRel(item, tagRel)
        })
        // delete tags that exists in the old tags but not in the newTags
        const tagsToBeDeleted = item.getTags().filter(tag => newTags.indexOf(tag) === -1)
        // this.mpgLogger.debug(`MpgGraph: updateItemTagRels: tagRelsToBeDeleted:`, tagsToBeDeleted)
        tagsToBeDeleted.forEach(tag => {
            // this.mpgLogger.debug(`MpgGraph: updateItemTagRels: deleteing rel for tag:`, tag)
            // get the crosponding tagRel
            const tagRel = item.getTagRel4Tag(tag)
            if (tagRel != undefined) {
                // remove from item
                // this.mpgLogger.debug(`MpgGraph: updateItemTagRels: deleteing tagRel:`, tagRel)
                this.removeTagRelFromItem(item, tagRel)
                this.deleteTagRel(tagRel.getId())
            } else {
                throw (new MpgError(`MpgGraph: updateItemtagRels. TagRel not found. id:${tag.getId()}`))
            }
        })
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // remove tag rel from item
    ///////////////////////////////////////////////////////////////////////////////////////////////
    removeTagRelFromItem = (item: MpgItem, tagRel: MpgRel) => {
        const tagRelIndex = item.getTagRels().indexOf(tagRel)
        if (tagRelIndex != -1) {
            item.getTagRels().splice(tagRelIndex, 1)
        } else {
            throw (new MpgError(`MpgGraph: removeTagRelFromItem. TagRel not found. id: ${tagRel.getId()}`))
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // get entries with ALL tags
    ///////////////////////////////////////////////////////////////////////////////////////////////
    getEntriesWithAllTag = (tags: MpgItem[]): MpgItem[] => {
        const foundItems: MpgItem[] = []
        if (tags.length > 0) {
            this.allEntries.forEach(entry => {
                if (entry.hasAllTags(tags)) {
                    foundItems.push(entry)
                }
            })
        }
        return foundItems
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create new item
    // this item could be Tag, Entry or view
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    createItem = async (categoryId: string, name: string, importance: number, tags: MpgItem[] = [],
        goals: MpgItem[] = [], actions: MpgItem[] = []) => {
        // this.mpgLogger.debug(`MpgGraph: createItem: item importance:${importance}`)
        try {
            if (this.isCategoryIdValid(categoryId)) {
                // create the new item with empty TagRels first and then populate them
                const item = new MpgItem(categoryId, name, importance)
                // this.mpgLogger.debug(`MpgGraph: createItem: item :`,item)
                await this.mpgDataProxy.createDataRecord(this.copyItemToDataRecord(item))
                // save tags
                for (const tag of tags) {
                    this.createItemTagRel(item, tag)
                }
                this.allItems.push(item)
                this.setAllTags()
                this.setAllEntries()
                this.setFilteredAllItems()
                // we will set this a the current item to cope with the crreation 'on the fly' situation
                this.currentItemId = item.getId()
                this.mpgLogger.debug(`MpgGraph: createItem`,` current item id:`,this.currentItemId)
                this.createOrUpdateMode = CreateOrUpdateModes.Update
            } else {
                throw new MpgError("MpgGraph: createItem: category is undefined")
            }
        } catch (err) {
            this.error = new MpgError("MpgGraph: createItem:" + (err as Error).message)
            this.unexpectedError = true
        } finally {
            this.invokeDataRefreshedFun()
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // getCurrentItemId
    ///////////////////////////////////////////////////////////////////////////////////////////////
    getCurrentItemId = (): string =>{
        return this.currentItemId
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // saveTag
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    saveTag = async (tag: MpgItem) => {
        // this.mpgLogger.debug(`MpgGraph: createItem: item importance:${importance}`)
        try {
            await this.mpgDataProxy.createDataRecord(this.copyItemToDataRecord(tag))
            this.allItems.push(tag)
            this.allTags.push(tag)
        } catch (err) {
            this.error = new MpgError("MpgGraph: savetag:" + (err as Error).message)
            this.unexpectedError = true
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // create tag (without saving it)
    ///////////////////////////////////////////////////////////////////////////////////////////////
    createTagInstance = (name: string, importance: number = 0): MpgItem | undefined => {
        let tag: MpgItem | undefined = undefined
        const tagCategoryId = this.getTagCategoryId()
        if (tagCategoryId != undefined) {
            tag = new MpgItem(tagCategoryId, name, importance)
        }
        return tag
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // get tag by id
    ///////////////////////////////////////////////////////////////////////////////////////////////
    getTagById = (id: string): MpgItem | undefined => {
        let foundTag: MpgItem | undefined = undefined
        for (let tag of this.allTags) {
            if (tag.getId() == id) {
                foundTag = tag
                break
            }
        }
        return foundTag
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // create tag rel
    ///////////////////////////////////////////////////////////////////////////////////////////////
    createItemTagRel = async (item: MpgItem, tag: MpgItem) => {
        let newTagRel: MpgRel | undefined = undefined
        try {
            newTagRel = new MpgRel(MpgRelNames.Tag, item, tag)
            await this.mpgDataProxy.createDataRecord(this.copyRelToItemRecord(newTagRel))
            // add to the item
            item.addTagRel(newTagRel)
            // this.allTagRels.push(newTagRel)
        } catch (err) {
            this.error = new MpgError("MpgGraph: saveItemTag:" + (err as Error).message)
            this.unexpectedError = true
        } finally {
            this.invokeDataRefreshedFun()
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // copyRelToItemRecord
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    copyRelToItemRecord = (rel: MpgRel): MpgDataRecord => {
        const itemRecord: MpgDataRecord = {
            dataFormatVersion: this.GraphFormatVersion,
            id: rel.getId(),
            class: MpgDataClasses.Rel,
            name: rel.getName(),
            category: 'NULL',
            description: 'NULL',
            item1Id: rel.getItem1().getId(),
            item2Id: rel.getItem2().getId(),
            importance: rel.getImportance(),
            createdAt: 'NULL',
            updatedAt: 'NULL',
        }
        return itemRecord
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // is Category Id valid?
    ///////////////////////////////////////////////////////////////////////////////////////////////
    isCategoryIdValid = (categoryId: string): boolean => {
        let categoryIdValid = false
        if (categoryId == 'NULL' || (this.getCategoryById(categoryId) != undefined)) {
            categoryIdValid = true
        }
        return categoryIdValid
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // get Entry category id
    ///////////////////////////////////////////////////////////////////////////////////////////////
    public getEntryCategoryId = (): string | undefined => {
        let actionCategoryId = undefined
        for (let category of this.allCategories) {
            if (category.getName() == MpgCategoryNames.Entry) {
                actionCategoryId = category.getId()
                break
            }
        }
        return actionCategoryId
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // set current item id
    ///////////////////////////////////////////////////////////////////////////////////////////////
    setCurrentItemId = async (id: string) => {
        this.currentItemId = id
        await this.invokeDataRefreshedFun()
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // delete all item rels
    ///////////////////////////////////////////////////////////////////////////////////////////////
    deleteAllItemRels = (item: MpgItem) => {
        item.getTagRels().forEach(tagRel => {
            // this.mpgLogger.debug(`MpgGraph: deleteAllItemRels deleteing rel to tag: ${tagRel.getItem2().getName()}`)
            this.deleteTagRel(tagRel.getId())
            item.removeTagRel(tagRel.getId())
        })
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // delete Tag Rel
    // should be renamed deleteRel as there's nothing special about tag here
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    deleteTagRel = async (id: string) => {
        try {
            // this.allTagRels = this.allTagRels.filter(tagRel=> tagRel.getId() != id)
            // this.mpgLogger.debug(`MpgGraph: deleteTagRel deleteing rel with id: ${id}`)
            await this.mpgDataProxy.deleteDataRecord(id)
        } catch (err) {
            this.mpgLogger.unexpectedError(err, "MpgGraph: deleteTagRel: error:")
        } finally {
            this.invokeDataRefreshedFun()
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // set current all items of the same category as current category
    ///////////////////////////////////////////////////////////////////////////////////////////////
    setFilteredAllItems = () => {
        const currentCategory = this.getCategoryById(this.currentCategoryId)
        if (currentCategory != undefined) {
            this.filteredAllItems = []
            for (let item of this.allItems) {
                if (item.getCategoryId() == this.currentCategoryId) {
                    this.filteredAllItems.push(item)
                }
            }
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // delete tagRel in all tagRels
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    deleteItemInAllItems = (id: string) => {
        try {
            let item = this.getItemById(id)
            if (item != undefined) {
                let index = this.allItems.indexOf(item)
                if (index != -1) {
                    this.allItems.splice(index, 1)
                }
                this.setFilteredAllItems()
            } else {
                throw new MpgError("MpgGraph: deleteIteItemFromAllItems: item was not found with id:" + id)
            }
        } catch (error) {
            this.error = new MpgError(error.toString())
            this.unexpectedError = true
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // delete item
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    deleteItem = async (id: string) => {
        try {
            const item = this.getItemById(id)
            if (item != undefined) {
                // this.mpgLogger.debug(`MpgGraph: deleteItem: deleteing item: ${item.getName()}`)
                this.deleteAllItemRels(item)
                this.deleteItemInAllItems(id)
                await this.mpgDataProxy.deleteDataRecord(id)
                // this.mpgLogger.debug("MpgGraph: deleteItem: items after delete:", MpgRootItem.getItemsByClass(MpgItemClasses.Item))
            } else {
                throw new MpgError(`MpgGraph: deletItem: item is undefined: id:${id}`)
            }

        } catch (err) {
            this.mpgLogger.unexpectedError(err, "MpgGraph: deleteItem: error:")
        } finally {
            // this.setAllGoals()  // should we be invoking setAllRel too?
            this.invokeDataRefreshedFun()
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // getAllCategoriesSorted
    ///////////////////////////////////////////////////////////////////////////////////////////////
    getAllCategoriesSorted = (): MpgCategory[] => {
        const sortedCategories = this.allCategories.sort((item1, item2) => { return item2.getImportance() - item1.getImportance() })
        return sortedCategories
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // set create or update mode
    ///////////////////////////////////////////////////////////////////////////////////////////////
    setCreateOrUpdateMode = async (mode: CreateOrUpdateModes) => {
        //  this.mpgLogger.debug("MpgGraph: setCategoryId:")
        this.createOrUpdateMode = mode
        await this.invokeDataRefreshedFun()
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // get item type
    ///////////////////////////////////////////////////////////////////////////////////////////////
    getItemType = (itemId: string): string | undefined => {
        let itemType = undefined
        const item = this.getItemById(itemId)
        if (item != undefined) {
            const category = this.getCategoryById(item.getCategoryId())
            if (category != undefined) {
                itemType = category.getName()
            }
        }
        return itemType
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get item by id
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getItemById = (id: string): MpgItem | undefined => {
        let foundItem: MpgItem | undefined = undefined
        for (let item of this.allItems) {
            if (item.getId() == id) {
                foundItem = item
            }
        }
        return foundItem
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get cetgory by id
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    getCategoryById = (id: string): MpgCategory | undefined => {
        let foundCategory: MpgCategory | undefined = undefined
        for (let category of this.allCategories) {
            if (category.getId() == id) {
                foundCategory = category
            }
        }
        return foundCategory
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // check if table empty and init
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    checkIfTableEmptyAndInit = async () => {
        try {
            // await this.mpgDataProxy.loadData()
            await this.loadData()
            this.userDataTableExists = true
            // if (this.mpgDataProxy.getDataRecords().length == 0) {
            if(this.allCategories.length == 0){
                this.debug('checkIfTableEmptyAndInit: table is empty')
                await this.initData()
            }
        } catch (error) {
            throw new MpgError("MpgGraph:checkIfTableEmptyAndInit:" + (error as Error).message)
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // debug
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    debug = (...objects: any)=>{
        this.mpgLogger.debug('MpgGraph: ',objects)
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // init data
    ///////////////////////////////////////////////////////////////////////////////////////////////
    private initData = async () => {
        this.showMessage('Initialising data ...')
        try {
            await this.initAppItems()
        } catch (error) {
            this.mpgLogger.unexpectedError("MpgGraph: initData: unexpected error:", error)
        }
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // init other objects
    // overrides base class initOtherObjects
    ///////////////////////////////////////////////////////////////////////////////////////////////
    protected initAppItems = async () => {
        await this.initCategories()
        // await this.initTags()
    }
     //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // init categories
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    initCategories = async () => {
        try {
            for (let initialCategory of MpgInitialCategories) {
                const category = new MpgCategory(initialCategory.name, initialCategory.importance)
                await this.createCategory(category)
            }
        } catch (error) {
            this.mpgLogger.unexpectedError("MpgGraph: initCategories: unexpected error:", error)
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // create category
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    createCategory = async (category: MpgCategory) => {
        try {
            await this.mpgDataProxy.createDataRecord(this.copyCategoryToItemRecord(category))
            this.allCategories.push(category)
        } catch (err) {
            this.error = new MpgError("MpgGraph: createCategory:" + (err as Error).message)
            this.unexpectedError = true
        } finally {
            // we are not creating category dynamically, so we don't need this. delete
            // if (!this.dataHasJustBeenInitialised) {
            //     this.invokeDataRefreshedFun()
            // }
        }
    }
     ///////////////////////////////////////////////////////////////////////////////////////////////
    // load data
    ///////////////////////////////////////////////////////////////////////////////////////////////
    loadData = async () => {
        this.showMessage('Loading data ...',)
        try {
            await this.mpgDataProxy.loadData()
            await this.loadRecordsIntoObjects()
            // this.mpgLogger.debug("MpgGraph: loadData: items:",this.allItems)
            this.setFilteredAllItems()
            // this.setAllTags()
            this.showMessage('Data loaded ...',)
        } catch (error) {
            this.error = new MpgError("MpgGraph: loadData: error:" + (error as Error).message)
            this.unexpectedError = true
        } finally {
            await this.invokeDataRefreshedFun()
        }
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // get current category id
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    getCurrentCategoryId = (): string =>{
        return this.currentCategoryId
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // get view category id
    ///////////////////////////////////////////////////////////////////////////////////////////////
    public getViewCategoryId = (): string | undefined => {
        let viewCategoryId = undefined
        for (let category of this.allCategories) {
            if (category.getName() == MpgCategoryNames.View) {
                viewCategoryId = category.getId()
                break
            }
        }
        return viewCategoryId
    }
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
                    this.loadCategory(itemRecord)
                }
            }
            // load items
            for (let itemRecord of this.mpgDataProxy.getDataRecords()) {
                if (itemRecord.class == MpgDataClasses.Item) {
                    // this.mpgLogger.debug("MpgGraph: loadRecordsIntoObjects: loading category:",itemRecord)
                    this.loadItem(itemRecord)
                }
            }
            // load relationships
            for (let itemRecord of this.mpgDataProxy.getDataRecords()) {
                if (itemRecord.class == MpgDataClasses.Rel) {
                    // this.mpgLogger.debug("MpgGraph: loadRecordsIntoObjects: loading category:",itemRecord)
                    this.loadRel(itemRecord)
                }
            }
        } catch (error) {
            this.error = error
            this.unexpectedError = true
        } finally {
            this.invokeDataRefreshedFun()
        }
    }
     //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // load Rel
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    loadRel = (dataRecord: MpgDataRecord) => {
        try {
            // validated that items exist
            const item1 = this.getItemById(dataRecord.item1Id)
            if (item1 != undefined) {
                const relatedItem = this.getItemById(dataRecord.item2Id)
                if (relatedItem != undefined) {
                    // check what type of rel
                    switch (dataRecord.name) {
                        case MpgRelNames.Tag: {
                            const tagRel = new MpgRel(dataRecord.name, item1, relatedItem, dataRecord.id)
                            // this.mpgLogger.debug(`MpgGraph: loadRel: loading tag: ${tagOrGoal.getName()} for item: ${item1.getName()},
                            //     recordItem:${dataRecord.id}, tagReg:`,tagRel)
                            // this.allTagRels.push(tagRel)
                            item1.addTagRel(tagRel)
                            // this.mpgLogger.debug(`MpgGraph: loadRel: item's relations:`,item1.getTagRels())
                            break
                        }
                        default: {
                            throw new MpgError(`MpgGraph: loadRel: inavlid rel type: type:${dataRecord.name}`)
                        }
                    }
                } else {
                    throw new MpgError(`MpgGraph: loadRel: tag does not exist. id: ${dataRecord.item2Id}`)
                }
            } else {
                throw new MpgError(`MpgGraph: loadRel: item does not exist. id: ${dataRecord.item1Id}`)
            }
        } catch (error) {
            // this.error = new MpgError(`MpgGraph: loadRel: Error:` + error.toString())
            // this.unexpectedError = true
            // report the error, delete the rel and continue
            this.mpgLogger.debug(`MpgGraph: loadRel: error loading rel: ${error.toString()}. 
                rel will be deleted`)
            this.deleteTagRel(dataRecord.id)
        } finally {
            this.invokeDataRefreshedFun()
        }
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // load item
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    loadItem = (itemRecord: MpgDataRecord) => {
        // this.mpgLogger.debug(`MpgGraph: loadItem: itemrecotd: ${itemRecord}`)
        const categoryId = itemRecord.category
        if (this.isCategoryIdValid(itemRecord.category)) {
            const item = new MpgItem(categoryId, itemRecord.name, itemRecord.importance, itemRecord.id)
            this.allItems.push(item)
            this.setFilteredAllItems()
        } else {
            this.unexpectedError = true
            this.error = new MpgError(`MpgGraph: loadItem: category was not found. Id=${itemRecord.category}`)
        }
        this.invokeDataRefreshedFun()
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////////////
    // load category
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    loadCategory = (itemRecord: MpgDataRecord) => {
        const category = new MpgCategory(itemRecord.name, itemRecord.importance, itemRecord.id)
        this.allCategories.push(category)
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // set current category
    ///////////////////////////////////////////////////////////////////////////////////////////////
    setCurrentCategoryId = async (id: string) => {
        //  this.mpgLogger.debug("MpgGraph: setCategoryId:")
        this.currentCategoryId = id
        this.setFilteredAllItems()
        await this.invokeDataRefreshedFun()
    }
    ///////////////////////////////////////////////////////////////////////////////////////////////
    // get action by id
    ///////////////////////////////////////////////////////////////////////////////////////////////
    getActionById = (id: string): MpgItem | undefined => {
        let foundAction: MpgItem | undefined = undefined
        for (let action of this.allEntries) {
            if (action.getId() == id) {
                foundAction = action
                break
            }
        }
        return foundAction
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // copyCategoryToItemRecord
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    copyCategoryToItemRecord = (category: MpgCategory): MpgDataRecord => {
        const itemRecord: MpgDataRecord = {
            dataFormatVersion: this.GraphFormatVersion,
            id: category.getId(),
            class: MpgDataClasses.Category,
            name: category.getName(),
            category: 'NULL',
            description: 'NULL',
            item1Id: 'NULL',
            item2Id: 'NULL',
            importance: category.getImportance(),
            createdAt: 'NULL',
            updatedAt: 'NULL',
        }
        return itemRecord
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // doesUserDataTableExists()
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    doesUserDataTableExists = (): boolean => {
        return this.userDataTableExists
    }
}