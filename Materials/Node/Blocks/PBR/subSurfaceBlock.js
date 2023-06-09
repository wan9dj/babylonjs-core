import { NodeMaterialBlock } from "../../nodeMaterialBlock.js";
import { NodeMaterialBlockConnectionPointTypes } from "../../Enums/nodeMaterialBlockConnectionPointTypes.js";
import { NodeMaterialConnectionPointDirection } from "../../nodeMaterialBlockConnectionPoint.js";
import { NodeMaterialBlockTargets } from "../../Enums/nodeMaterialBlockTargets.js";
import { RegisterClass } from "../../../../Misc/typeStore.js";
import { InputBlock } from "../Input/inputBlock.js";
import { NodeMaterialConnectionPointCustomObject } from "../../nodeMaterialConnectionPointCustomObject.js";
import { RefractionBlock } from "./refractionBlock.js";
/**
 * Block used to implement the sub surface module of the PBR material
 */
export class SubSurfaceBlock extends NodeMaterialBlock {
    /**
     * Create a new SubSurfaceBlock
     * @param name defines the block name
     */
    constructor(name) {
        super(name, NodeMaterialBlockTargets.Fragment);
        this._isUnique = true;
        this.registerInput("thickness", NodeMaterialBlockConnectionPointTypes.Float, false, NodeMaterialBlockTargets.Fragment);
        this.registerInput("tintColor", NodeMaterialBlockConnectionPointTypes.Color3, true, NodeMaterialBlockTargets.Fragment);
        this.registerInput("translucencyIntensity", NodeMaterialBlockConnectionPointTypes.Float, true, NodeMaterialBlockTargets.Fragment);
        this.registerInput("translucencyDiffusionDist", NodeMaterialBlockConnectionPointTypes.Color3, true, NodeMaterialBlockTargets.Fragment);
        this.registerInput("refraction", NodeMaterialBlockConnectionPointTypes.Object, true, NodeMaterialBlockTargets.Fragment, new NodeMaterialConnectionPointCustomObject("refraction", this, NodeMaterialConnectionPointDirection.Input, RefractionBlock, "RefractionBlock"));
        this.registerOutput("subsurface", NodeMaterialBlockConnectionPointTypes.Object, NodeMaterialBlockTargets.Fragment, new NodeMaterialConnectionPointCustomObject("subsurface", this, NodeMaterialConnectionPointDirection.Output, SubSurfaceBlock, "SubSurfaceBlock"));
    }
    /**
     * Initialize the block and prepare the context for build
     * @param state defines the state that will be used for the build
     */
    initialize(state) {
        state._excludeVariableName("subSurfaceOut");
        state._excludeVariableName("vThicknessParam");
        state._excludeVariableName("vTintColor");
        state._excludeVariableName("vSubSurfaceIntensity");
    }
    /**
     * Gets the current class name
     * @returns the class name
     */
    getClassName() {
        return "SubSurfaceBlock";
    }
    /**
     * Gets the thickness component
     */
    get thickness() {
        return this._inputs[0];
    }
    /**
     * Gets the tint color input component
     */
    get tintColor() {
        return this._inputs[1];
    }
    /**
     * Gets the translucency intensity input component
     */
    get translucencyIntensity() {
        return this._inputs[2];
    }
    /**
     * Gets the translucency diffusion distance input component
     */
    get translucencyDiffusionDist() {
        return this._inputs[3];
    }
    /**
     * Gets the refraction object parameters
     */
    get refraction() {
        return this._inputs[4];
    }
    /**
     * Gets the sub surface object output component
     */
    get subsurface() {
        return this._outputs[0];
    }
    autoConfigure() {
        if (!this.thickness.isConnected) {
            const thicknessInput = new InputBlock("SubSurface thickness", NodeMaterialBlockTargets.Fragment, NodeMaterialBlockConnectionPointTypes.Float);
            thicknessInput.value = 0;
            thicknessInput.output.connectTo(this.thickness);
        }
    }
    prepareDefines(mesh, nodeMaterial, defines) {
        super.prepareDefines(mesh, nodeMaterial, defines);
        const translucencyEnabled = this.translucencyDiffusionDist.isConnected || this.translucencyIntensity.isConnected;
        defines.setValue("SUBSURFACE", translucencyEnabled || this.refraction.isConnected, true);
        defines.setValue("SS_TRANSLUCENCY", translucencyEnabled, true);
        defines.setValue("SS_THICKNESSANDMASK_TEXTURE", false, true);
        defines.setValue("SS_REFRACTIONINTENSITY_TEXTURE", false, true);
        defines.setValue("SS_TRANSLUCENCYINTENSITY_TEXTURE", false, true);
        defines.setValue("SS_MASK_FROM_THICKNESS_TEXTURE", false, true);
        defines.setValue("SS_USE_GLTF_TEXTURES", false, true);
    }
    /**
     * Gets the main code of the block (fragment side)
     * @param state current state of the node material building
     * @param ssBlock instance of a SubSurfaceBlock or null if the code must be generated without an active sub surface module
     * @param reflectionBlock instance of a ReflectionBlock null if the code must be generated without an active reflection module
     * @param worldPosVarName name of the variable holding the world position
     * @returns the shader code
     */
    static GetCode(state, ssBlock, reflectionBlock, worldPosVarName) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
        let code = "";
        const thickness = (ssBlock === null || ssBlock === void 0 ? void 0 : ssBlock.thickness.isConnected) ? ssBlock.thickness.associatedVariableName : "0.";
        const tintColor = (ssBlock === null || ssBlock === void 0 ? void 0 : ssBlock.tintColor.isConnected) ? ssBlock.tintColor.associatedVariableName : "vec3(1.)";
        const translucencyIntensity = (ssBlock === null || ssBlock === void 0 ? void 0 : ssBlock.translucencyIntensity.isConnected) ? ssBlock === null || ssBlock === void 0 ? void 0 : ssBlock.translucencyIntensity.associatedVariableName : "1.";
        const translucencyDiffusionDistance = (ssBlock === null || ssBlock === void 0 ? void 0 : ssBlock.translucencyDiffusionDist.isConnected) ? ssBlock === null || ssBlock === void 0 ? void 0 : ssBlock.translucencyDiffusionDist.associatedVariableName : "vec3(1.)";
        const refractionBlock = ((ssBlock === null || ssBlock === void 0 ? void 0 : ssBlock.refraction.isConnected) ? (_a = ssBlock === null || ssBlock === void 0 ? void 0 : ssBlock.refraction.connectedPoint) === null || _a === void 0 ? void 0 : _a.ownerBlock : null);
        const refractionTintAtDistance = (refractionBlock === null || refractionBlock === void 0 ? void 0 : refractionBlock.tintAtDistance.isConnected) ? refractionBlock.tintAtDistance.associatedVariableName : "1.";
        const refractionIntensity = (refractionBlock === null || refractionBlock === void 0 ? void 0 : refractionBlock.intensity.isConnected) ? refractionBlock.intensity.associatedVariableName : "1.";
        const refractionView = (refractionBlock === null || refractionBlock === void 0 ? void 0 : refractionBlock.view.isConnected) ? refractionBlock.view.associatedVariableName : "";
        code += (_b = refractionBlock === null || refractionBlock === void 0 ? void 0 : refractionBlock.getCode(state)) !== null && _b !== void 0 ? _b : "";
        code += `subSurfaceOutParams subSurfaceOut;

        #ifdef SUBSURFACE
            vec2 vThicknessParam = vec2(0., ${thickness});
            vec4 vTintColor = vec4(${tintColor}, ${refractionTintAtDistance});
            vec3 vSubSurfaceIntensity = vec3(${refractionIntensity}, ${translucencyIntensity}, 0.);

            subSurfaceBlock(
                vSubSurfaceIntensity,
                vThicknessParam,
                vTintColor,
                normalW,
                specularEnvironmentReflectance,
            #ifdef SS_THICKNESSANDMASK_TEXTURE
                vec4(0.),
            #endif
            #ifdef REFLECTION
                #ifdef SS_TRANSLUCENCY
                    ${reflectionBlock === null || reflectionBlock === void 0 ? void 0 : reflectionBlock._reflectionMatrixName},
                    #ifdef USESPHERICALFROMREFLECTIONMAP
                        #if !defined(NORMAL) || !defined(USESPHERICALINVERTEX)
                            reflectionOut.irradianceVector,
                        #endif
                        #if defined(REALTIME_FILTERING)
                            ${reflectionBlock === null || reflectionBlock === void 0 ? void 0 : reflectionBlock._cubeSamplerName},
                            ${reflectionBlock === null || reflectionBlock === void 0 ? void 0 : reflectionBlock._vReflectionFilteringInfoName},
                        #endif
                        #endif
                    #ifdef USEIRRADIANCEMAP
                        irradianceSampler,
                    #endif
                #endif
            #endif
            #if defined(SS_REFRACTION) || defined(SS_TRANSLUCENCY)
                surfaceAlbedo,
            #endif
            #ifdef SS_REFRACTION
                ${worldPosVarName}.xyz,
                viewDirectionW,
                ${refractionView},
                ${(_c = refractionBlock === null || refractionBlock === void 0 ? void 0 : refractionBlock._vRefractionInfosName) !== null && _c !== void 0 ? _c : ""},
                ${(_d = refractionBlock === null || refractionBlock === void 0 ? void 0 : refractionBlock._refractionMatrixName) !== null && _d !== void 0 ? _d : ""},
                ${(_e = refractionBlock === null || refractionBlock === void 0 ? void 0 : refractionBlock._vRefractionMicrosurfaceInfosName) !== null && _e !== void 0 ? _e : ""},
                vLightingIntensity,
                #ifdef SS_LINKREFRACTIONTOTRANSPARENCY
                    alpha,
                #endif
                #ifdef ${(_f = refractionBlock === null || refractionBlock === void 0 ? void 0 : refractionBlock._defineLODRefractionAlpha) !== null && _f !== void 0 ? _f : "IGNORE"}
                    NdotVUnclamped,
                #endif
                #ifdef ${(_g = refractionBlock === null || refractionBlock === void 0 ? void 0 : refractionBlock._defineLinearSpecularRefraction) !== null && _g !== void 0 ? _g : "IGNORE"}
                    roughness,
                #endif
                alphaG,
                #ifdef ${(_h = refractionBlock === null || refractionBlock === void 0 ? void 0 : refractionBlock._define3DName) !== null && _h !== void 0 ? _h : "IGNORE"}
                    ${(_j = refractionBlock === null || refractionBlock === void 0 ? void 0 : refractionBlock._cubeSamplerName) !== null && _j !== void 0 ? _j : ""},
                #else
                    ${(_k = refractionBlock === null || refractionBlock === void 0 ? void 0 : refractionBlock._2DSamplerName) !== null && _k !== void 0 ? _k : ""},
                #endif
                #ifndef LODBASEDMICROSFURACE
                    #ifdef ${(_l = refractionBlock === null || refractionBlock === void 0 ? void 0 : refractionBlock._define3DName) !== null && _l !== void 0 ? _l : "IGNORE"}
                        ${(_m = refractionBlock === null || refractionBlock === void 0 ? void 0 : refractionBlock._cubeSamplerName) !== null && _m !== void 0 ? _m : ""},
                        ${(_o = refractionBlock === null || refractionBlock === void 0 ? void 0 : refractionBlock._cubeSamplerName) !== null && _o !== void 0 ? _o : ""},
                    #else
                        ${(_p = refractionBlock === null || refractionBlock === void 0 ? void 0 : refractionBlock._2DSamplerName) !== null && _p !== void 0 ? _p : ""},
                        ${(_q = refractionBlock === null || refractionBlock === void 0 ? void 0 : refractionBlock._2DSamplerName) !== null && _q !== void 0 ? _q : ""},
                    #endif
                #endif
                #ifdef ANISOTROPIC
                    anisotropicOut,
                #endif
                #ifdef REALTIME_FILTERING
                    ${(_r = refractionBlock === null || refractionBlock === void 0 ? void 0 : refractionBlock._vRefractionFilteringInfoName) !== null && _r !== void 0 ? _r : ""},
                #endif
                #ifdef SS_USE_LOCAL_REFRACTIONMAP_CUBIC
                    vRefractionPosition,
                    vRefractionSize,
                #endif
            #endif
            #ifdef SS_TRANSLUCENCY
                ${translucencyDiffusionDistance},
            #endif
                subSurfaceOut
            );

            #ifdef SS_REFRACTION
                surfaceAlbedo = subSurfaceOut.surfaceAlbedo;
                #ifdef SS_LINKREFRACTIONTOTRANSPARENCY
                    alpha = subSurfaceOut.alpha;
                #endif
            #endif
        #else
            subSurfaceOut.specularEnvironmentReflectance = specularEnvironmentReflectance;
        #endif\r\n`;
        return code;
    }
    _buildBlock(state) {
        if (state.target === NodeMaterialBlockTargets.Fragment) {
            state.sharedData.blocksWithDefines.push(this);
        }
        return this;
    }
}
RegisterClass("BABYLON.SubSurfaceBlock", SubSurfaceBlock);
//# sourceMappingURL=subSurfaceBlock.js.map