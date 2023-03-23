import { __decorate } from "../../../../tslib.es6.js";
import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { NodeMaterialBlockTargets } from "../../Enums/nodeMaterialBlockTargets.js";
import { NodeMaterialBlockConnectionPointTypes } from "../../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { MaterialHelper } from "../../../materialHelper.js";
import { NodeMaterialSystemValues } from "../../Enums/nodeMaterialSystemValues.js";
import { InputBlock } from "../Input/inputBlock.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
import { editableInPropertyPage, PropertyTypeForEdition } from "../../nodeMaterialDecorator.js";
import "../../../../Shaders/ShadersInclude/lightFragmentDeclaration.js";
import "../../../../Shaders/ShadersInclude/lightVxFragmentDeclaration.js";
import "../../../../Shaders/ShadersInclude/lightUboDeclaration.js";
import "../../../../Shaders/ShadersInclude/lightVxUboDeclaration.js";
import "../../../../Shaders/ShadersInclude/lightFragment.js";
import "../../../../Shaders/ShadersInclude/helperFunctions.js";
import "../../../../Shaders/ShadersInclude/lightsFragmentFunctions.js";
import "../../../../Shaders/ShadersInclude/shadowsFragmentFunctions.js";
import "../../../../Shaders/ShadersInclude/shadowsVertex.js";
/**
 * Block used to add light in the fragment shader
 */
export class LightBlock extends NodeMaterialBlock {
    static _OnGenerateOnlyFragmentCodeChanged(block, _propertyName) {
        const that = block;
        if (that.worldPosition.isConnected) {
            that.generateOnlyFragmentCode = !that.generateOnlyFragmentCode;
            console.error("The worldPosition input must not be connected to be able to switch!");
            return false;
        }
        that._setTarget();
        return true;
    }
    _setTarget() {
        this._setInitialTarget(this.generateOnlyFragmentCode ? NodeMaterialBlockTargets.Fragment : NodeMaterialBlockTargets.VertexAndFragment);
        this.getInputByName("worldPosition").target = this.generateOnlyFragmentCode ? NodeMaterialBlockTargets.Fragment : NodeMaterialBlockTargets.Vertex;
    }
    /**
     * Create a new LightBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name, NodeMaterialBlockTargets.VertexAndFragment);
        this._lightId = 0;
        /** Indicates that no code should be generated in the vertex shader. Can be useful in some specific circumstances (like when doing ray marching for eg) */
        this.generateOnlyFragmentCode = false;
        this._isUnique = true;
        this.registerInput("worldPosition", NodeMaterialBlockConnectionPointTypes.Vector4, false, NodeMaterialBlockTargets.Vertex);
        this.registerInput("worldNormal", NodeMaterialBlockConnectionPointTypes.Vector4, false, NodeMaterialBlockTargets.Fragment);
        this.registerInput("cameraPosition", NodeMaterialBlockConnectionPointTypes.Vector3, false, NodeMaterialBlockTargets.Fragment);
        this.registerInput("glossiness", NodeMaterialBlockConnectionPointTypes.Float, true, NodeMaterialBlockTargets.Fragment);
        this.registerInput("glossPower", NodeMaterialBlockConnectionPointTypes.Float, true, NodeMaterialBlockTargets.Fragment);
        this.registerInput("diffuseColor", NodeMaterialBlockConnectionPointTypes.Color3, true, NodeMaterialBlockTargets.Fragment);
        this.registerInput("specularColor", NodeMaterialBlockConnectionPointTypes.Color3, true, NodeMaterialBlockTargets.Fragment);
        this.registerInput("view", NodeMaterialBlockConnectionPointTypes.Matrix, true);
        this.registerOutput("diffuseOutput", NodeMaterialBlockConnectionPointTypes.Color3, NodeMaterialBlockTargets.Fragment);
        this.registerOutput("specularOutput", NodeMaterialBlockConnectionPointTypes.Color3, NodeMaterialBlockTargets.Fragment);
        this.registerOutput("shadow", NodeMaterialBlockConnectionPointTypes.Float, NodeMaterialBlockTargets.Fragment);
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "LightBlock";
    }
    /**
     * Gets the world position input component
     */
    get worldPosition() {
        return this._inputs[0];
    }
    /**
     * Gets the world normal input component
     */
    get worldNormal() {
        return this._inputs[1];
    }
    /**
     * Gets the camera (or eye) position component
     */
    get cameraPosition() {
        return this._inputs[2];
    }
    /**
     * Gets the glossiness component
     */
    get glossiness() {
        return this._inputs[3];
    }
    /**
     * Gets the glossiness power component
     */
    get glossPower() {
        return this._inputs[4];
    }
    /**
     * Gets the diffuse color component
     */
    get diffuseColor() {
        return this._inputs[5];
    }
    /**
     * Gets the specular color component
     */
    get specularColor() {
        return this._inputs[6];
    }
    /**
     * Gets the view matrix component
     */
    get view() {
        return this._inputs[7];
    }
    /**
     * Gets the diffuse output component
     */
    get diffuseOutput() {
        return this._outputs[0];
    }
    /**
     * Gets the specular output component
     */
    get specularOutput() {
        return this._outputs[1];
    }
    /**
     * Gets the shadow output component
     */
    get shadow() {
        return this._outputs[2];
    }
    autoConfigure(material) {
        if (!this.cameraPosition.isConnected) {
            let cameraPositionInput = material.getInputBlockByPredicate((b) => b.systemValue === NodeMaterialSystemValues.CameraPosition);
            if (!cameraPositionInput) {
                cameraPositionInput = new InputBlock("cameraPosition");
                cameraPositionInput.setAsSystemValue(NodeMaterialSystemValues.CameraPosition);
            }
            cameraPositionInput.output.connectTo(this.cameraPosition);
        }
    }
    prepareDefines(mesh, nodeMaterial, defines) {
        if (!defines._areLightsDirty) {
            return;
        }
        const scene = mesh.getScene();
        if (!this.light) {
            MaterialHelper.PrepareDefinesForLights(scene, mesh, defines, true, nodeMaterial.maxSimultaneousLights);
        }
        else {
            const state = {
                needNormals: false,
                needRebuild: false,
                lightmapMode: false,
                shadowEnabled: false,
                specularEnabled: false,
            };
            MaterialHelper.PrepareDefinesForLight(scene, mesh, this.light, this._lightId, defines, true, state);
            if (state.needRebuild) {
                defines.rebuild();
            }
        }
    }
    updateUniformsAndSamples(state, nodeMaterial, defines, uniformBuffers) {
        for (let lightIndex = 0; lightIndex < nodeMaterial.maxSimultaneousLights; lightIndex++) {
            if (!defines["LIGHT" + lightIndex]) {
                break;
            }
            const onlyUpdateBuffersList = state.uniforms.indexOf("vLightData" + lightIndex) >= 0;
            MaterialHelper.PrepareUniformsAndSamplersForLight(lightIndex, state.uniforms, state.samplers, defines["PROJECTEDLIGHTTEXTURE" + lightIndex], uniformBuffers, onlyUpdateBuffersList);
        }
    }
    bind(effect, nodeMaterial, mesh) {
        if (!mesh) {
            return;
        }
        const scene = mesh.getScene();
        if (!this.light) {
            MaterialHelper.BindLights(scene, mesh, effect, true, nodeMaterial.maxSimultaneousLights);
        }
        else {
            MaterialHelper.BindLight(this.light, this._lightId, scene, effect, true);
        }
    }
    _injectVertexCode(state) {
        const worldPos = this.worldPosition;
        const comments = `//${this.name}`;
        // Declaration
        if (!this.light) {
            // Emit for all lights
            state._emitFunctionFromInclude(state.supportUniformBuffers ? "lightVxUboDeclaration" : "lightVxFragmentDeclaration", comments, {
                repeatKey: "maxSimultaneousLights",
            });
            this._lightId = 0;
            state.sharedData.dynamicUniformBlocks.push(this);
        }
        else {
            this._lightId = (state.counters["lightCounter"] !== undefined ? state.counters["lightCounter"] : -1) + 1;
            state.counters["lightCounter"] = this._lightId;
            state._emitFunctionFromInclude(state.supportUniformBuffers ? "lightVxUboDeclaration" : "lightVxFragmentDeclaration", comments, {
                replaceStrings: [{ search: /{X}/g, replace: this._lightId.toString() }],
            }, this._lightId.toString());
        }
        // Inject code in vertex
        const worldPosVaryingName = "v_" + worldPos.associatedVariableName;
        if (state._emitVaryingFromString(worldPosVaryingName, "vec4")) {
            state.compilationString += `${worldPosVaryingName} = ${worldPos.associatedVariableName};\r\n`;
        }
        if (this.light) {
            state.compilationString += state._emitCodeFromInclude("shadowsVertex", comments, {
                replaceStrings: [
                    { search: /{X}/g, replace: this._lightId.toString() },
                    { search: /worldPos/g, replace: worldPos.associatedVariableName },
                ],
            });
        }
        else {
            state.compilationString += `vec4 worldPos = ${worldPos.associatedVariableName};\r\n`;
            if (this.view.isConnected) {
                state.compilationString += `mat4 view = ${this.view.associatedVariableName};\r\n`;
            }
            state.compilationString += state._emitCodeFromInclude("shadowsVertex", comments, {
                repeatKey: "maxSimultaneousLights",
            });
        }
    }
    _buildBlock(state) {
        super._buildBlock(state);
        if (state.target !== NodeMaterialBlockTargets.Fragment) {
            // Vertex
            this._injectVertexCode(state);
            return;
        }
        if (this.generateOnlyFragmentCode) {
            state.sharedData.dynamicUniformBlocks.push(this);
        }
        // Fragment
        state.sharedData.forcedBindableBlocks.push(this);
        state.sharedData.blocksWithDefines.push(this);
        const comments = `//${this.name}`;
        const worldPos = this.worldPosition;
        let worldPosVariableName = worldPos.associatedVariableName;
        if (this.generateOnlyFragmentCode) {
            worldPosVariableName = state._getFreeVariableName("globalWorldPos");
            state._emitFunction("light_globalworldpos", `vec3 ${worldPosVariableName};\r\n`, comments);
            state.compilationString += `${worldPosVariableName} = ${worldPos.associatedVariableName}.xyz;\r\n`;
            state.compilationString += state._emitCodeFromInclude("shadowsVertex", comments, {
                repeatKey: "maxSimultaneousLights",
                substitutionVars: this.generateOnlyFragmentCode ? `worldPos,${worldPos.associatedVariableName}` : undefined,
            });
        }
        else {
            worldPosVariableName = "v_" + worldPosVariableName + ".xyz";
        }
        state._emitFunctionFromInclude("helperFunctions", comments);
        state._emitFunctionFromInclude("lightsFragmentFunctions", comments, {
            replaceStrings: [{ search: /vPositionW/g, replace: worldPosVariableName }],
        });
        state._emitFunctionFromInclude("shadowsFragmentFunctions", comments, {
            replaceStrings: [{ search: /vPositionW/g, replace: worldPosVariableName }],
        });
        if (!this.light) {
            // Emit for all lights
            state._emitFunctionFromInclude(state.supportUniformBuffers ? "lightUboDeclaration" : "lightFragmentDeclaration", comments, {
                repeatKey: "maxSimultaneousLights",
                substitutionVars: this.generateOnlyFragmentCode ? "varying," : undefined,
            });
        }
        else {
            state._emitFunctionFromInclude(state.supportUniformBuffers ? "lightUboDeclaration" : "lightFragmentDeclaration", comments, {
                replaceStrings: [{ search: /{X}/g, replace: this._lightId.toString() }],
            }, this._lightId.toString());
        }
        // Code
        if (this._lightId === 0) {
            if (state._registerTempVariable("viewDirectionW")) {
                state.compilationString += `vec3 viewDirectionW = normalize(${this.cameraPosition.associatedVariableName} - ${worldPosVariableName});\r\n`;
            }
            state.compilationString += `lightingInfo info;\r\n`;
            state.compilationString += `float shadow = 1.;\r\n`;
            state.compilationString += `float glossiness = ${this.glossiness.isConnected ? this.glossiness.associatedVariableName : "1.0"} * ${this.glossPower.isConnected ? this.glossPower.associatedVariableName : "1024.0"};\r\n`;
            state.compilationString += `vec3 diffuseBase = vec3(0., 0., 0.);\r\n`;
            state.compilationString += `vec3 specularBase = vec3(0., 0., 0.);\r\n`;
            state.compilationString += `vec3 normalW = ${this.worldNormal.associatedVariableName}.xyz;\r\n`;
        }
        if (this.light) {
            state.compilationString += state._emitCodeFromInclude("lightFragment", comments, {
                replaceStrings: [{ search: /{X}/g, replace: this._lightId.toString() }],
            });
        }
        else {
            state.compilationString += state._emitCodeFromInclude("lightFragment", comments, {
                repeatKey: "maxSimultaneousLights",
            });
        }
        const diffuseOutput = this.diffuseOutput;
        const specularOutput = this.specularOutput;
        state.compilationString +=
            this._declareOutput(diffuseOutput, state) + ` = diffuseBase${this.diffuseColor.isConnected ? " * " + this.diffuseColor.associatedVariableName : ""};\r\n`;
        if (specularOutput.hasEndpoints) {
            state.compilationString +=
                this._declareOutput(specularOutput, state) + ` = specularBase${this.specularColor.isConnected ? " * " + this.specularColor.associatedVariableName : ""};\r\n`;
        }
        if (this.shadow.hasEndpoints) {
            state.compilationString += this._declareOutput(this.shadow, state) + ` = shadow;\r\n`;
        }
        return this;
    }
    serialize() {
        const serializationObject = super.serialize();
        serializationObject.generateOnlyFragmentCode = this.generateOnlyFragmentCode;
        if (this.light) {
            serializationObject.lightId = this.light.id;
        }
        return serializationObject;
    }
    _deserialize(serializationObject, scene, rootUrl) {
        super._deserialize(serializationObject, scene, rootUrl);
        if (serializationObject.lightId) {
            this.light = scene.getLightById(serializationObject.lightId);
        }
        this.generateOnlyFragmentCode = serializationObject.generateOnlyFragmentCode;
        this._setTarget();
    }
}
__decorate([
    editableInPropertyPage("Generate only fragment code", PropertyTypeForEdition.Boolean, "ADVANCED", {
        notifiers: { rebuild: true, update: true, onValidation: LightBlock._OnGenerateOnlyFragmentCodeChanged },
    })
], LightBlock.prototype, "generateOnlyFragmentCode", void 0);
RegisterClass("BABYLON.LightBlock", LightBlock);
//# sourceMappingURL=lightBlock.js.map