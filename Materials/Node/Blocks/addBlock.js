import { NodeMaterialBlock } from "../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../Enums/nodeMaterialBlockTargets.js";
import { RegisterClass } from "../../../Misc/typeStore.js";
/**
 * Block used to add 2 vectors
 */
export class AddBlock extends NodeMaterialBlock {
    /**
     * Creates a new AddBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name, NodeMaterialBlockTargets.Neutral);
        this.registerInput("left", NodeMaterialBlockConnectionPointTypes.AutoDetect);
        this.registerInput("right", NodeMaterialBlockConnectionPointTypes.AutoDetect);
        this.registerOutput("output", NodeMaterialBlockConnectionPointTypes.BasedOnInput);
        this._outputs[0]._typeConnectionSource = this._inputs[0];
        this._linkConnectionTypes(0, 1);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "AddBlock";
    }
    /**
     * Gets the left operand input component
     */
    get left() {
        return this._inputs[0];
    }
    /**
     * Gets the right operand input component
     */
    get right() {
        return this._inputs[1];
    }
    /**
     * Gets the output component
     */
    get output() {
        return this._outputs[0];
    }
    _buildBlock(state) {
        super._buildBlock(state);
        const output = this._outputs[0];
        state.compilationString += this._declareOutput(output, state) + ` = ${this.left.associatedVariableName} + ${this.right.associatedVariableName};\r\n`;
        return this;
    }
}
RegisterClass("BABYLON.AddBlock", AddBlock);
//# sourceMappingURL=addBlock.js.map