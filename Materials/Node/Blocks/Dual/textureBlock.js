import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialBlockTargets } from "../../Enums/nodeMaterialBlockTargets.js";
import { NodeMaterialConnectionPointDirection } from "../../nodeMaterialBlockConnectionPoint.js";
import { NodeMaterial } from "../../nodeMaterial.js";
import { InputBlock } from "../Input/inputBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
import { Texture } from "../../../Textures/texture.js";
import { NodeMaterialModes } from "../../Enums/nodeMaterialModes.js";

import "../../../../Shaders/ShadersInclude/helperFunctions.js";
import { ImageSourceBlock } from "./imageSourceBlock.js";
import { NodeMaterialConnectionPointCustomObject } from "../../nodeMaterialConnectionPointCustomObject.js";
import { EngineStore } from "../../../../Engines/engineStore.js";
/**
 * Block used to read a texture from a sampler
 */
export class TextureBlock extends NodeMaterialBlock {
    /**
     * Gets or sets the texture associated with the node
     */
    get texture() {
        var _a;
        if (this.source.isConnected) {
            return ((_a = this.source.connectedPoint) === null || _a === void 0 ? void 0 : _a.ownerBlock).texture;
        }
        return this._texture;
    }
    set texture(texture) {
        var _a;
        if (this._texture === texture) {
            return;
        }
        const scene = (_a = texture === null || texture === void 0 ? void 0 : texture.getScene()) !== null && _a !== void 0 ? _a : EngineStore.LastCreatedScene;
        if (!texture && scene) {
            scene.markAllMaterialsAsDirty(1, (mat) => {
                return mat.hasTexture(this._texture);
            });
        }
        this._texture = texture;
        if (texture && scene) {
            scene.markAllMaterialsAsDirty(1, (mat) => {
                return mat.hasTexture(texture);
            });
        }
    }
    /**
     * Gets the sampler name associated with this texture
     */
    get samplerName() {
        if (this._imageSource) {
            return this._imageSource.samplerName;
        }
        return this._samplerName;
    }
    /**
     * Gets a boolean indicating that this block is linked to an ImageSourceBlock
     */
    get hasImageSource() {
        return this.source.isConnected;
    }
    /**
     * Gets or sets a boolean indicating if content needs to be converted to gamma space
     */
    set convertToGammaSpace(value) {
        var _a;
        if (value === this._convertToGammaSpace) {
            return;
        }
        this._convertToGammaSpace = value;
        if (this.texture) {
            const scene = (_a = this.texture.getScene()) !== null && _a !== void 0 ? _a : EngineStore.LastCreatedScene;
            scene === null || scene === void 0 ? void 0 : scene.markAllMaterialsAsDirty(1, (mat) => {
                return mat.hasTexture(this.texture);
            });
        }
    }
    get convertToGammaSpace() {
        return this._convertToGammaSpace;
    }
    /**
     * Gets or sets a boolean indicating if content needs to be converted to linear space
     */
    set convertToLinearSpace(value) {
        var _a;
        if (value === this._convertToLinearSpace) {
            return;
        }
        this._convertToLinearSpace = value;
        if (this.texture) {
            const scene = (_a = this.texture.getScene()) !== null && _a !== void 0 ? _a : EngineStore.LastCreatedScene;
            scene === null || scene === void 0 ? void 0 : scene.markAllMaterialsAsDirty(1, (mat) => {
                return mat.hasTexture(this.texture);
            });
        }
    }
    get convertToLinearSpace() {
        return this._convertToLinearSpace;
    }
    /**
     * Create a new TextureBlock
     * @param name defines the block name
     * @param fragmentOnly
     */
    constructor(name, fragmentOnly = false) {
        super(name, fragmentOnly ? NodeMaterialBlockTargets.Fragment : NodeMaterialBlockTargets.VertexAndFragment);
        this._convertToGammaSpace = false;
        this._convertToLinearSpace = false;
        /**
         * Gets or sets a boolean indicating if multiplication of texture with level should be disabled
         */
        this.disableLevelMultiplication = false;
        this._fragmentOnly = fragmentOnly;
        this.registerInput("uv", NodeMaterialBlockConnectionPointTypes.AutoDetect, false, NodeMaterialBlockTargets.VertexAndFragment);
        this.registerInput("source", NodeMaterialBlockConnectionPointTypes.Object, true, NodeMaterialBlockTargets.VertexAndFragment, new NodeMaterialConnectionPointCustomObject("source", this, NodeMaterialConnectionPointDirection.Input, ImageSourceBlock, "ImageSourceBlock"));
        this.registerInput("layer", NodeMaterialBlockConnectionPointTypes.Float, true);
        this.registerOutput("rgba", NodeMaterialBlockConnectionPointTypes.Color4, NodeMaterialBlockTargets.Neutral);
        this.registerOutput("rgb", NodeMaterialBlockConnectionPointTypes.Color3, NodeMaterialBlockTargets.Neutral);
        this.registerOutput("r", NodeMaterialBlockConnectionPointTypes.Float, NodeMaterialBlockTargets.Neutral);
        this.registerOutput("g", NodeMaterialBlockConnectionPointTypes.Float, NodeMaterialBlockTargets.Neutral);
        this.registerOutput("b", NodeMaterialBlockConnectionPointTypes.Float, NodeMaterialBlockTargets.Neutral);
        this.registerOutput("a", NodeMaterialBlockConnectionPointTypes.Float, NodeMaterialBlockTargets.Neutral);
        this.registerOutput("level", NodeMaterialBlockConnectionPointTypes.Float, NodeMaterialBlockTargets.Neutral);
        this._inputs[0].addExcludedConnectionPointFromAllowedTypes(NodeMaterialBlockConnectionPointTypes.Vector2 | NodeMaterialBlockConnectionPointTypes.Vector3 | NodeMaterialBlockConnectionPointTypes.Vector4);
        this._inputs[0]._prioritizeVertex = !fragmentOnly;
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "TextureBlock";
    }
    /**
     * Gets the uv input component
     */
    get uv() {
        return this._inputs[0];
    }
    /**
     * Gets the source input component
     */
    get source() {
        return this._inputs[1];
    }
    /**
     * Gets the layer input component
     */
    get layer() {
        return this._inputs[2];
    }
    /**
     * Gets the rgba output component
     */
    get rgba() {
        return this._outputs[0];
    }
    /**
     * Gets the rgb output component
     */
    get rgb() {
        return this._outputs[1];
    }
    /**
     * Gets the r output component
     */
    get r() {
        return this._outputs[2];
    }
    /**
     * Gets the g output component
     */
    get g() {
        return this._outputs[3];
    }
    /**
     * Gets the b output component
     */
    get b() {
        return this._outputs[4];
    }
    /**
     * Gets the a output component
     */
    get a() {
        return this._outputs[5];
    }
    /**
     * Gets the level output component
     */
    get level() {
        return this._outputs[6];
    }
    get target() {
        if (this._fragmentOnly) {
            return NodeMaterialBlockTargets.Fragment;
        }
        // TextureBlock has a special optimizations for uvs that come from the vertex shaders as they can be packed into a single varyings.
        // But we need to detect uvs coming from fragment then
        if (!this.uv.isConnected) {
            return NodeMaterialBlockTargets.VertexAndFragment;
        }
        if (this.uv.sourceBlock.isInput) {
            return NodeMaterialBlockTargets.VertexAndFragment;
        }
        let parent = this.uv.connectedPoint;
        while (parent) {
            if (parent.target === NodeMaterialBlockTargets.Fragment) {
                return NodeMaterialBlockTargets.Fragment;
            }
            if (parent.target === NodeMaterialBlockTargets.Vertex) {
                return NodeMaterialBlockTargets.VertexAndFragment;
            }
            if (parent.target === NodeMaterialBlockTargets.Neutral || parent.target === NodeMaterialBlockTargets.VertexAndFragment) {
                const parentBlock = parent.ownerBlock;
                if (parentBlock.target === NodeMaterialBlockTargets.Fragment) {
                    return NodeMaterialBlockTargets.Fragment;
                }
                parent = null;
                for (const input of parentBlock.inputs) {
                    if (input.connectedPoint) {
                        parent = input.connectedPoint;
                        break;
                    }
                }
            }
        }
        return NodeMaterialBlockTargets.VertexAndFragment;
    }
    set target(value) { }
    autoConfigure(material) {
        if (!this.uv.isConnected) {
            if (material.mode === NodeMaterialModes.PostProcess) {
                const uvInput = material.getBlockByPredicate((b) => b.name === "uv");
                if (uvInput) {
                    uvInput.connectTo(this);
                }
            }
            else {
                const attributeName = material.mode === NodeMaterialModes.Particle ? "particle_uv" : "uv";
                let uvInput = material.getInputBlockByPredicate((b) => b.isAttribute && b.name === attributeName);
                if (!uvInput) {
                    uvInput = new InputBlock("uv");
                    uvInput.setAsAttribute(attributeName);
                }
                uvInput.output.connectTo(this.uv);
            }
        }
    }
    initializeDefines(mesh, nodeMaterial, defines) {
        if (!defines._areTexturesDirty) {
            return;
        }
        if (this._mainUVDefineName !== undefined) {
            defines.setValue(this._mainUVDefineName, false, true);
        }
    }
    prepareDefines(mesh, nodeMaterial, defines) {
        if (!defines._areTexturesDirty) {
            return;
        }
        if (!this.texture || !this.texture.getTextureMatrix) {
            if (this._isMixed) {
                defines.setValue(this._defineName, false, true);
                defines.setValue(this._mainUVDefineName, true, true);
            }
            return;
        }
        const toGamma = this.convertToGammaSpace && this.texture && !this.texture.gammaSpace;
        const toLinear = this.convertToLinearSpace && this.texture && this.texture.gammaSpace;
        // Not a bug... Name defines the texture space not the required conversion
        defines.setValue(this._linearDefineName, toGamma, true);
        defines.setValue(this._gammaDefineName, toLinear, true);
        if (this._isMixed) {
            if (!this.texture.getTextureMatrix().isIdentityAs3x2()) {
                defines.setValue(this._defineName, true);
                if (defines[this._mainUVDefineName] == undefined) {
                    defines.setValue(this._mainUVDefineName, false, true);
                }
            }
            else {
                defines.setValue(this._defineName, false, true);
                defines.setValue(this._mainUVDefineName, true, true);
            }
        }
    }
    isReady() {
        if (this.texture && !this.texture.isReadyOrNotBlocking()) {
            return false;
        }
        return true;
    }
    bind(effect) {
        if (!this.texture) {
            return;
        }
        if (this._isMixed) {
            effect.setFloat(this._textureInfoName, this.texture.level);
            effect.setMatrix(this._textureTransformName, this.texture.getTextureMatrix());
        }
        if (!this._imageSource) {
            effect.setTexture(this._samplerName, this.texture);
        }
    }
    get _isMixed() {
        return this.target !== NodeMaterialBlockTargets.Fragment;
    }
    _injectVertexCode(state) {
        const uvInput = this.uv;
        // Inject code in vertex
        this._defineName = state._getFreeDefineName("UVTRANSFORM");
        this._mainUVDefineName = "VMAIN" + uvInput.associatedVariableName.toUpperCase();
        this._mainUVName = "vMain" + uvInput.associatedVariableName;
        this._transformedUVName = state._getFreeVariableName("transformedUV");
        this._textureTransformName = state._getFreeVariableName("textureTransform");
        this._textureInfoName = state._getFreeVariableName("textureInfoName");
        this.level.associatedVariableName = this._textureInfoName;
        state._emitVaryingFromString(this._transformedUVName, "vec2", this._defineName);
        state._emitVaryingFromString(this._mainUVName, "vec2", this._mainUVDefineName);
        state._emitUniformFromString(this._textureTransformName, "mat4", this._defineName);
        state.compilationString += `#ifdef ${this._defineName}\r\n`;
        state.compilationString += `${this._transformedUVName} = vec2(${this._textureTransformName} * vec4(${uvInput.associatedVariableName}.xy, 1.0, 0.0));\r\n`;
        state.compilationString += `#elif defined(${this._mainUVDefineName})\r\n`;
        state.compilationString += `${this._mainUVName} = ${uvInput.associatedVariableName}.xy;\r\n`;
        state.compilationString += `#endif\r\n`;
        if (!this._outputs.some((o) => o.isConnectedInVertexShader)) {
            return;
        }
        this._writeTextureRead(state, true);
        for (const output of this._outputs) {
            if (output.hasEndpoints && output.name !== "level") {
                this._writeOutput(state, output, output.name, true);
            }
        }
    }
    _getUVW(uvName) {
        var _a, _b, _c;
        let coords = uvName;
        const is2DArrayTexture = (_c = (_b = (_a = this._texture) === null || _a === void 0 ? void 0 : _a._texture) === null || _b === void 0 ? void 0 : _b.is2DArray) !== null && _c !== void 0 ? _c : false;
        if (is2DArrayTexture) {
            const layerValue = this.layer.isConnected ? this.layer.associatedVariableName : "0";
            coords = `vec3(${uvName}, ${layerValue})`;
        }
        return coords;
    }
    _generateTextureLookup(state) {
        const samplerName = this.samplerName;
        state.compilationString += `#ifdef ${this._defineName}\r\n`;
        state.compilationString += `vec4 ${this._tempTextureRead} = texture2D(${samplerName}, ${this._getUVW(this._transformedUVName)});\r\n`;
        state.compilationString += `#elif defined(${this._mainUVDefineName})\r\n`;
        state.compilationString += `vec4 ${this._tempTextureRead} = texture2D(${samplerName}, ${this._getUVW(this._mainUVName ? this._mainUVName : this.uv.associatedVariableName)});\r\n`;
        state.compilationString += `#endif\r\n`;
    }
    _writeTextureRead(state, vertexMode = false) {
        const uvInput = this.uv;
        if (vertexMode) {
            if (state.target === NodeMaterialBlockTargets.Fragment) {
                return;
            }
            this._generateTextureLookup(state);
            return;
        }
        if (this.uv.ownerBlock.target === NodeMaterialBlockTargets.Fragment) {
            state.compilationString += `vec4 ${this._tempTextureRead} = texture2D(${this.samplerName}, ${this._getUVW(uvInput.associatedVariableName)});\r\n`;
            return;
        }
        this._generateTextureLookup(state);
    }
    _generateConversionCode(state, output, swizzle) {
        if (swizzle !== "a") {
            // no conversion if the output is "a" (alpha)
            if (!this.texture || !this.texture.gammaSpace) {
                state.compilationString += `#ifdef ${this._linearDefineName}
                    ${output.associatedVariableName} = toGammaSpace(${output.associatedVariableName});
                    #endif
                `;
            }
            state.compilationString += `#ifdef ${this._gammaDefineName}
                ${output.associatedVariableName} = toLinearSpace(${output.associatedVariableName});
                #endif
            `;
        }
    }
    _writeOutput(state, output, swizzle, vertexMode = false) {
        if (vertexMode) {
            if (state.target === NodeMaterialBlockTargets.Fragment) {
                return;
            }
            state.compilationString += `${this._declareOutput(output, state)} = ${this._tempTextureRead}.${swizzle};\r\n`;
            this._generateConversionCode(state, output, swizzle);
            return;
        }
        if (this.uv.ownerBlock.target === NodeMaterialBlockTargets.Fragment) {
            state.compilationString += `${this._declareOutput(output, state)} = ${this._tempTextureRead}.${swizzle};\r\n`;
            this._generateConversionCode(state, output, swizzle);
            return;
        }
        let complement = "";
        if (!this.disableLevelMultiplication) {
            complement = ` * ${this._textureInfoName}`;
        }
        state.compilationString += `${this._declareOutput(output, state)} = ${this._tempTextureRead}.${swizzle}${complement};\r\n`;
        this._generateConversionCode(state, output, swizzle);
    }
    _buildBlock(state) {
        var _a, _b, _c, _d;
        super._buildBlock(state);
        if (this.source.isConnected) {
            this._imageSource = this.source.connectedPoint.ownerBlock;
        }
        else {
            this._imageSource = null;
        }
        if (state.target === NodeMaterialBlockTargets.Vertex || this._fragmentOnly || state.target === NodeMaterialBlockTargets.Fragment) {
            this._tempTextureRead = state._getFreeVariableName("tempTextureRead");
            this._linearDefineName = state._getFreeDefineName("ISLINEAR");
            this._gammaDefineName = state._getFreeDefineName("ISGAMMA");
        }
        if ((!this._isMixed && state.target === NodeMaterialBlockTargets.Fragment) || (this._isMixed && state.target === NodeMaterialBlockTargets.Vertex)) {
            if (!this._imageSource) {
                this._samplerName = state._getFreeVariableName(this.name + "Sampler");
                if ((_b = (_a = this._texture) === null || _a === void 0 ? void 0 : _a._texture) === null || _b === void 0 ? void 0 : _b.is2DArray) {
                    state._emit2DArraySampler(this._samplerName);
                }
                else {
                    state._emit2DSampler(this._samplerName);
                }
            }
            // Declarations
            state.sharedData.blockingBlocks.push(this);
            state.sharedData.textureBlocks.push(this);
            state.sharedData.blocksWithDefines.push(this);
            state.sharedData.bindableBlocks.push(this);
        }
        if (state.target !== NodeMaterialBlockTargets.Fragment) {
            // Vertex
            this._injectVertexCode(state);
            return;
        }
        // Fragment
        if (!this._outputs.some((o) => o.isConnectedInFragmentShader)) {
            return;
        }
        if (this._isMixed && !this._imageSource) {
            // Reexport the sampler
            if ((_d = (_c = this._texture) === null || _c === void 0 ? void 0 : _c._texture) === null || _d === void 0 ? void 0 : _d.is2DArray) {
                state._emit2DArraySampler(this._samplerName);
            }
            else {
                state._emit2DSampler(this._samplerName);
            }
        }
        const comments = `//${this.name}`;
        state._emitFunctionFromInclude("helperFunctions", comments);
        if (this._isMixed) {
            state._emitUniformFromString(this._textureInfoName, "float");
        }
        this._writeTextureRead(state);
        for (const output of this._outputs) {
            if (output.hasEndpoints && output.name !== "level") {
                this._writeOutput(state, output, output.name);
            }
        }
        return this;
    }
    _dumpPropertiesCode() {
        let codeString = super._dumpPropertiesCode();
        codeString += `${this._codeVariableName}.convertToGammaSpace = ${this.convertToGammaSpace};\r\n`;
        codeString += `${this._codeVariableName}.convertToLinearSpace = ${this.convertToLinearSpace};\r\n`;
        codeString += `${this._codeVariableName}.disableLevelMultiplication = ${this.disableLevelMultiplication};\r\n`;
        if (!this.texture) {
            return codeString;
        }
        codeString += `${this._codeVariableName}.texture = new BABYLON.Texture("${this.texture.name}", null, ${this.texture.noMipmap}, ${this.texture.invertY}, ${this.texture.samplingMode});\r\n`;
        codeString += `${this._codeVariableName}.texture.wrapU = ${this.texture.wrapU};\r\n`;
        codeString += `${this._codeVariableName}.texture.wrapV = ${this.texture.wrapV};\r\n`;
        codeString += `${this._codeVariableName}.texture.uAng = ${this.texture.uAng};\r\n`;
        codeString += `${this._codeVariableName}.texture.vAng = ${this.texture.vAng};\r\n`;
        codeString += `${this._codeVariableName}.texture.wAng = ${this.texture.wAng};\r\n`;
        codeString += `${this._codeVariableName}.texture.uOffset = ${this.texture.uOffset};\r\n`;
        codeString += `${this._codeVariableName}.texture.vOffset = ${this.texture.vOffset};\r\n`;
        codeString += `${this._codeVariableName}.texture.uScale = ${this.texture.uScale};\r\n`;
        codeString += `${this._codeVariableName}.texture.vScale = ${this.texture.vScale};\r\n`;
        codeString += `${this._codeVariableName}.texture.coordinatesMode = ${this.texture.coordinatesMode};\r\n`;
        return codeString;
    }
    serialize() {
        const serializationObject = super.serialize();
        serializationObject.convertToGammaSpace = this.convertToGammaSpace;
        serializationObject.convertToLinearSpace = this.convertToLinearSpace;
        serializationObject.fragmentOnly = this._fragmentOnly;
        serializationObject.disableLevelMultiplication = this.disableLevelMultiplication;
        if (!this.hasImageSource && this.texture && !this.texture.isRenderTarget && this.texture.getClassName() !== "VideoTexture") {
            serializationObject.texture = this.texture.serialize();
        }
        return serializationObject;
    }
    _deserialize(serializationObject, scene, rootUrl) {
        super._deserialize(serializationObject, scene, rootUrl);
        this.convertToGammaSpace = serializationObject.convertToGammaSpace;
        this.convertToLinearSpace = !!serializationObject.convertToLinearSpace;
        this._fragmentOnly = !!serializationObject.fragmentOnly;
        this.disableLevelMultiplication = !!serializationObject.disableLevelMultiplication;
        if (serializationObject.texture && !NodeMaterial.IgnoreTexturesAtLoadTime && serializationObject.texture.url !== undefined) {
            rootUrl = serializationObject.texture.url.indexOf("data:") === 0 ? "" : rootUrl;
            this.texture = Texture.Parse(serializationObject.texture, scene, rootUrl);
        }
    }
}
RegisterClass("BABYLON.TextureBlock", TextureBlock);
//# sourceMappingURL=textureBlock.js.map