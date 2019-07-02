import Attribute from '../../../nodes/Attribute';
import Block from '../../Block';
import ElementWrapper from './index';
export default class AttributeWrapper {
    node: Attribute;
    parent: ElementWrapper;
    constructor(parent: ElementWrapper, block: Block, node: Attribute);
    render(block: Block): void;
    stringify(): string;
}
