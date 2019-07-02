import EachBlock from '../EachBlock';
import ThenBlock from '../ThenBlock';
import CatchBlock from '../CatchBlock';
import InlineComponent from '../InlineComponent';
import Element from '../Element';
declare type NodeWithScope = EachBlock | ThenBlock | CatchBlock | InlineComponent | Element;
export default class TemplateScope {
    names: Set<string>;
    dependencies_for_name: Map<string, Set<string>>;
    owners: Map<string, NodeWithScope>;
    parent?: TemplateScope;
    constructor(parent?: TemplateScope);
    add(name: any, dependencies: Set<string>, owner: any): this;
    child(): TemplateScope;
    is_top_level(name: string): any;
    get_owner(name: string): NodeWithScope;
    is_let(name: string): boolean;
}
export {};
