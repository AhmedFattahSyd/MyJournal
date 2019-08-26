import { MpgRelNames } from "./MpgDataClasses";
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mpg Item module
//////////////////////////////////////////////////////////////////////////////////////////////////////////
import MpgRootItem from "./MpgRootItem";
import { MpgDataClasses } from "./MpgDataClasses";
import MpgRel from "./MpgRel";
//////////////////////////////////////////////////////////////////////////////////////////////////////////
// Mpg Item class
//////////////////////////////////////////////////////////////////////////////////////////////////////////
export default class MpgItem extends MpgRootItem {
  private categoryId: string = "";
  private tagRels: MpgRel[];
  private parentRels: MpgRel[];
  private childRels: MpgRel[];
  private entryRels: MpgRel[];
  private netPriority = 0
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // constructor
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  constructor(
    categoryId: string,
    name: string,
    priority: number,
    id: string = ""
  ) {
    super(MpgDataClasses.Item, name, priority, id);
    this.categoryId = categoryId;
    this.tagRels = [];
    this.parentRels = [];
    this.childRels = [];
    this.entryRels = [];
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // set net priority
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  setNetPriority = (netPriority: number)=>{
    this.netPriority = netPriority
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // get net priority   
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getNetPriority = (): number => {
    return this.netPriority
  }
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // get categoryId
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  getCategoryId = (): string => {
    return this.categoryId;
  };
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  // set category
  //////////////////////////////////////////////////////////////////////////////////////////////////////////
  setCategoryId = (id: string) => {
    // category can be '' or a valid category id
    // should we validate here?
    this.categoryId = id;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // add tag Rel
  ///////////////////////////////////////////////////////////////////////////////////////////////
  addTagRel = (tagRel: MpgRel) => {
    this.tagRels.push(tagRel);
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // add entry Rel
  ///////////////////////////////////////////////////////////////////////////////////////////////
  addActionRel = (actionRel: MpgRel) => {
    this.entryRels.push(actionRel);
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // add parent Rel
  // todo: detect any loops and return error
  ///////////////////////////////////////////////////////////////////////////////////////////////
  addParentRel = (parentRel: MpgRel) => {
    this.parentRels.push(parentRel);
    // add a childRel in the corresponding item
    const child = parentRel.getItem2();
    const childrel = new MpgRel(MpgRelNames.Child, parentRel.getItem2(), this);
    child.addChildRel(childrel);
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // add child rel
  // todo: detect any loops and return error
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  addChildRel = (childRel: MpgRel) => {
    this.childRels.push(childRel);
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // get parents
  // returns direct parents only (not ancestors)
  ///////////////////////////////////////////////////////////////////////////////////////////////
  getParents = (): MpgItem[] => {
    const foundParents: MpgItem[] = [];
    this.parentRels.forEach(parentRel => {
      foundParents.push(parentRel.getItem2());
    });
    return foundParents;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // get children
  // returns direct children only (not descendents)
  ///////////////////////////////////////////////////////////////////////////////////////////////
  getChildren = (): MpgItem[] => {
    const foundChildren: MpgItem[] = [];
    this.childRels.forEach(childRel => {
      foundChildren.push(childRel.getItem2());
    });
    return foundChildren;
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // get Ancestors
  // returns an array all ancestors (not in any order)
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getAncestors = (ancestors: MpgItem[] = []): MpgItem[] => {
    const foundAncestors: MpgItem[] = ancestors;
    this.getParents().forEach(parent => {
      if (foundAncestors.includes(parent)) {
        throw new Error(
          "MpgGraph: getAncestors: parent is already in set" +
            "Item:" +
            this.getName() +
            " parent:" +
            parent.getName()
        );
      } else {
        foundAncestors.push(parent);
        parent.getAncestors(foundAncestors);
      }
    });
    return foundAncestors;
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // get descendants
  // returns an array all descendants (not in any order)
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  getDescendants = (descendants: MpgItem[] = []): MpgItem[] => {
    const foundDescendants: MpgItem[] = descendants;
    this.getChildren().forEach(child => {
      if (foundDescendants.includes(child)) {
        throw new Error(
          "MpgItem: getDescendants: child is already in set" +
            "Item:" +
            this.getName() +
            " child:" +
            child.getName()
        );
      } else {
        foundDescendants.push(child);
        child.getDescendants(foundDescendants);
      }
    });
    return foundDescendants;
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // hasParents
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  hasParents = (): boolean => {
    return this.parentRels.length > 0;
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // has children
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  hasChildren = (): boolean => {
    return this.childRels.length > 0;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // get entries
  ///////////////////////////////////////////////////////////////////////////////////////////////
  getEntries = (): MpgItem[] => {
    const foundActions: MpgItem[] = [];
    this.entryRels.forEach(actionRel => {
      foundActions.push(actionRel.getItem2());
    });
    return foundActions;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // get parent rels
  ///////////////////////////////////////////////////////////////////////////////////////////////
  getParentRels = (): MpgRel[] => {
    return this.parentRels;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // get child rels
  ///////////////////////////////////////////////////////////////////////////////////////////////
  getChildRels = (): MpgRel[] => {
    return this.childRels;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // get entry rels
  ///////////////////////////////////////////////////////////////////////////////////////////////
  getEntryRels = (): MpgRel[] => {
    return this.entryRels;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // get TagRel for Tag
  ///////////////////////////////////////////////////////////////////////////////////////////////
  getTagRel4Tag = (tag: MpgItem): MpgRel | undefined => {
    let foundTagRel: MpgRel | undefined = undefined;
    for (const tagRel of this.tagRels) {
      if (tagRel.getItem2().getId() == tag.getId()) {
        foundTagRel = tagRel;
        break;
      }
    }
    return foundTagRel;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // get entryRel for action
  ///////////////////////////////////////////////////////////////////////////////////////////////
  getEntryRel4Action = (tag: MpgItem): MpgRel | undefined => {
    let foundEntryRel: MpgRel | undefined = undefined;
    for (const actionRel of this.entryRels) {
      if (actionRel.getItem2().getId() == tag.getId()) {
        foundEntryRel = actionRel;
        break;
      }
    }
    return foundEntryRel;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // get parentRel for a parent
  ///////////////////////////////////////////////////////////////////////////////////////////////
  getParentRel4Parent = (parent: MpgItem): MpgRel | undefined => {
    let foundParentRel: MpgRel | undefined = undefined;
    for (const parentRel of this.parentRels) {
      if (parentRel.getItem2().getId() == parent.getId()) {
        foundParentRel = parentRel;
        break;
      }
    }
    return foundParentRel;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // get childRel for a child
  ///////////////////////////////////////////////////////////////////////////////////////////////
  getChildRel4Child = (child: MpgItem): MpgRel | undefined => {
    let foundChildRel: MpgRel | undefined = undefined;
    for (const childRel of this.childRels) {
      if (childRel.getItem2().getId() == child.getId()) {
        foundChildRel = childRel;
        break;
      }
    }
    return foundChildRel;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // has tag OLD to be deleted
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // hasTagOLD = (tagId: string): boolean => {
  //     let hasTag: boolean = false
  //     for (const tagRel of this.tagRels) {
  //         if tagRel.getItem2().getId() == tagId) {
  //             hasTag = true
  //             break
  //         }
  //     }
  //     return hasTag
  // }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // has tag
  ///////////////////////////////////////////////////////////////////////////////////////////////
  hasTag = (tag: MpgItem): boolean => {
    let hasTag: boolean = false;
    for (const tagRel of this.tagRels) {
      if (tagRel.getItem2().getId() == tag.getId()) {
        hasTag = true;
        break;
      } else {
        // check if its matches with any of the tag descendants
        for (const descendant of tag.getDescendants()) {
          if (tagRel.getItem2().getId() == descendant.getId()) {
            hasTag = true;
            break;
          }
        }
      }
    }
    return hasTag;
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // remove tag
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  removeTag = (tag: MpgItem)=>{
    const tagRel = this.getTagRel4Tag(tag)
    if(tagRel != undefined){
      this.removeTagRel(tagRel)
    }else{
      throw new Error('MpgItem: removeTag: tagRel undefined for tag with id:'+tag.getId())
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  // remove tags  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  removeTags = (tags: MpgItem[])=>{
    tags.forEach(tag=>{
      this.removeTag(tag)
    })
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // get tags
  ///////////////////////////////////////////////////////////////////////////////////////////////
  getTags = (): MpgItem[] => {
    const foundTags: MpgItem[] = [];
    this.tagRels.forEach(tagRel => {
      foundTags.push(tagRel.getItem2());
    });
    return foundTags;
  };
  ////////////////////////////////w///////////////////////////////////////////////////////////////
  // get tag rels
  ///////////////////////////////////////////////////////////////////////////////////////////////
  getTagRels = (): MpgRel[] => {
    return this.tagRels;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // has parent
  ///////////////////////////////////////////////////////////////////////////////////////////////
  hasParent = (parentId: string): boolean => {
    let hasParent: boolean = false;
    for (const parentRel of this.tagRels) {
      if (parentRel.getItem2().getId() == parentId) {
        hasParent = true;
        break;
      }
    }
    return hasParent;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // has child
  ///////////////////////////////////////////////////////////////////////////////////////////////
  hasChild = (childId: string): boolean => {
    let hasChild: boolean = false;
    for (const childRel of this.tagRels) {
      if (childRel.getItem2().getId() == childId) {
        hasChild = true;
        break;
      }
    }
    return hasChild;
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // remove tagRel
  ///////////////////////////////////////////////////////////////////////////////////////////////
  removeTagRel = (tagRel: MpgRel) => {
    this.tagRels = this.tagRels.filter(
      tagRel => tagRel.getId() != tagRel.getId()
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // remove parentRel
  ///////////////////////////////////////////////////////////////////////////////////////////////
  removeParentRel = (parentRel2Del: MpgRel) => {
    this.parentRels = this.parentRels.filter(
      parentRel => parentRel.getId() != parentRel2Del.getId()
    );
    const child = parentRel2Del.getItem2();
    const childRel2Del = child.getChildRel4Child(this);
    if (childRel2Del !== undefined) {
      child.addChildRel(childRel2Del);
    } else {
      throw new Error(
        "MpgItem: removeParentRel: corsspendng child rel undefined" +
          " item1: " +
          this.getName() +
          " item2: " +
          child.getName()
      );
    }
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // remove childRel
  ///////////////////////////////////////////////////////////////////////////////////////////////
  removeChildRel = (childRelId: string) => {
    this.childRels = this.childRels.filter(
      childRel => childRel.getId() != childRelId
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // remove entryRel
  ///////////////////////////////////////////////////////////////////////////////////////////////
  removeEntryRel = (actionRelId: string) => {
    this.entryRels = this.entryRels.filter(
      actionRel => actionRel.getId() != actionRelId
    );
  };
  ///////////////////////////////////////////////////////////////////////////////////////////////
  // has all tags
  ///////////////////////////////////////////////////////////////////////////////////////////////
  hasAllTags = (tags: MpgItem[]): boolean => {
    // const allFlags = tags.map(tag=>this.hasTag(tag.getId()))
    // let hasAllTags: boolean = true
    // allFlags.forEach(flag=>{
    //     // console.log(`MpgItem: hasAllTags: item:`, this.getName(),` AllFlags:`,allFlags, ` flag:`,flag,
    //     //  `hasAllTags:`,hasAllTags);
    //     if(!flag){
    //         hasAllTags = false
    //     }
    // })
    // return hasAllTags
    return tags
      .map(tag => this.hasTag(tag))
      .reduce((acc, hasTag) => {
        return acc && hasTag;
      }, true);
  };
}
