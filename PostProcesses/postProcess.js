import { __decorate } from "../tslib.es6.js";
import { SmartArray } from "../Misc/smartArray.js";
import { Observable } from "../Misc/observable.js";
import { Vector2 } from "../Maths/math.vector.js";

import "../Shaders/postprocess.vertex.js";
import { Engine } from "../Engines/engine.js";
import "../Engines/Extensions/engine.renderTarget.js";
import { serialize, serializeAsColor4, SerializationHelper } from "../Misc/decorators.js";
import { GetClass, RegisterClass } from "../Misc/typeStore.js";
import { DrawWrapper } from "../Materials/drawWrapper.js";
import { ShaderLanguage } from "../Materials/shaderLanguage.js";
/**
 * PostProcess can be used to apply a shader to a texture after it has been rendered
 * See https://doc.babylonjs.com/features/featuresDeepDive/postProcesses/usePostProcesses
 */
export class PostProcess {
    /**
     * Registers a shader code processing with a post process name.
     * @param postProcessName name of the post process. Use null for the fallback shader code processing. This is the shader code processing that will be used in case no specific shader code processing has been associated to a post process name
     * @param customShaderCodeProcessing shader code processing to associate to the post process name
     * @returns
     */
    static RegisterShaderCodeProcessing(postProcessName, customShaderCodeProcessing) {
        if (!customShaderCodeProcessing) {
            delete PostProcess._CustomShaderCodeProcessing[postProcessName !== null && postProcessName !== void 0 ? postProcessName : ""];
            return;
        }
        PostProcess._CustomShaderCodeProcessing[postProcessName !== null && postProcessName !== void 0 ? postProcessName : ""] = customShaderCodeProcessing;
    }
    static _GetShaderCodeProcessing(postProcessName) {
        var _a;
        return (_a = PostProcess._CustomShaderCodeProcessing[postProcessName]) !== null && _a !== void 0 ? _a : PostProcess._CustomShaderCodeProcessing[""];
    }
    /**
     * Number of sample textures (default: 1)
     */
    get samples() {
        return this._samples;
    }
    set samples(n) {
        this._samples = Math.min(n, this._engine.getCaps().maxMSAASamples);
        this._textures.forEach((texture) => {
            texture.setSamples(this._samples);
        });
    }
    /**
     * Returns the fragment url or shader name used in the post process.
     * @returns the fragment url or name in the shader store.
     */
    getEffectName() {
        return this._fragmentUrl;
    }
    /**
     * A function that is added to the onActivateObservable
     */
    set onActivate(callback) {
        if (this._onActivateObserver) {
            this.onActivateObservable.remove(this._onActivateObserver);
        }
        if (callback) {
            this._onActivateObserver = this.onActivateObservable.add(callback);
        }
    }
    /**
     * A function that is added to the onSizeChangedObservable
     */
    set onSizeChanged(callback) {
        if (this._onSizeChangedObserver) {
            this.onSizeChangedObservable.remove(this._onSizeChangedObserver);
        }
        this._onSizeChangedObserver = this.onSizeChangedObservable.add(callback);
    }
    /**
     * A function that is added to the onApplyObservable
     */
    set onApply(callback) {
        if (this._onApplyObserver) {
            this.onApplyObservable.remove(this._onApplyObserver);
        }
        this._onApplyObserver = this.onApplyObservable.add(callback);
    }
    /**
     * A function that is added to the onBeforeRenderObservable
     */
    set onBeforeRender(callback) {
        if (this._onBeforeRenderObserver) {
            this.onBeforeRenderObservable.remove(this._onBeforeRenderObserver);
        }
        this._onBeforeRenderObserver = this.onBeforeRenderObservable.add(callback);
    }
    /**
     * A function that is added to the onAfterRenderObservable
     */
    set onAfterRender(callback) {
        if (this._onAfterRenderObserver) {
            this.onAfterRenderObservable.remove(this._onAfterRenderObserver);
        }
        this._onAfterRenderObserver = this.onAfterRenderObservable.add(callback);
    }
    /**
     * The input texture for this post process and the output texture of the previous post process. When added to a pipeline the previous post process will
     * render it's output into this texture and this texture will be used as textureSampler in the fragment shader of this post process.
     */
    get inputTexture() {
        return this._textures.data[this._currentRenderTextureInd];
    }
    set inputTexture(value) {
        this._forcedOutputTexture = value;
    }
    /**
     * Since inputTexture should always be defined, if we previously manually set `inputTexture`,
     * the only way to unset it is to use this function to restore its internal state
     */
    restoreDefaultInputTexture() {
        if (this._forcedOutputTexture) {
            this._forcedOutputTexture = null;
            this.markTextureDirty();
        }
    }
    /**
     * Gets the camera which post process is applied to.
     * @returns The camera the post process is applied to.
     */
    getCamera() {
        return this._camera;
    }
    /**
     * Gets the texel size of the postprocess.
     * See https://en.wikipedia.org/wiki/Texel_(graphics)
     */
    get texelSize() {
        if (this._shareOutputWithPostProcess) {
            return this._shareOutputWithPostProcess.texelSize;
        }
        if (this._forcedOutputTexture) {
            this._texelSize.copyFromFloats(1.0 / this._forcedOutputTexture.width, 1.0 / this._forcedOutputTexture.height);
        }
        return this._texelSize;
    }
    /**
     * Creates a new instance PostProcess
     * @param name The name of the PostProcess.
     * @param fragmentUrl The url of the fragment shader to be used.
     * @param parameters Array of the names of uniform non-sampler2D variables that will be passed to the shader.
     * @param samplers Array of the names of uniform sampler2D variables that will be passed to the shader.
     * @param options The required width/height ratio to downsize to before computing the render pass. (Use 1.0 for full size)
     * @param camera The camera to apply the render pass to.
     * @param samplingMode The sampling mode to be used when computing the pass. (default: 0)
     * @param engine The engine which the post process will be applied. (default: current engine)
     * @param reusable If the post process can be reused on the same frame. (default: false)
     * @param defines String of defines that will be set when running the fragment shader. (default: null)
     * @param textureType Type of textures used when performing the post process. (default: 0)
     * @param vertexUrl The url of the vertex shader to be used. (default: "postprocess")
     * @param indexParameters The index parameters to be used for babylons include syntax "#include<kernelBlurVaryingDeclaration>[0..varyingCount]". (default: undefined) See usage in babylon.blurPostProcess.ts and kernelBlur.vertex.fx
     * @param blockCompilation If the shader should not be compiled immediatly. (default: false)
     * @param textureFormat Format of textures used when performing the post process. (default: TEXTUREFORMAT_RGBA)
     */
    constructor(name, fragmentUrl, parameters, samplers, options, camera, samplingMode = 1, engine, reusable, defines = null, textureType = 0, vertexUrl = "postprocess", indexParameters, blockCompilation = false, textureFormat = 5, shaderLanguage = ShaderLanguage.GLSL) {
        /** @internal */
        this._parentContainer = null;
        /**
         * Width of the texture to apply the post process on
         */
        this.width = -1;
        /**
         * Height of the texture to apply the post process on
         */
        this.height = -1;
        /**
         * Gets the node material used to create this postprocess (null if the postprocess was manually created)
         */
        this.nodeMaterialSource = null;
        /**
         * Internal, reference to the location where this postprocess was output to. (Typically the texture on the next postprocess in the chain)
         * @internal
         */
        this._outputTexture = null;
        /**
         * If the buffer needs to be cleared before applying the post process. (default: true)
         * Should be set to false if shader will overwrite all previous pixels.
         */
        this.autoClear = true;
        /**
         * Type of alpha mode to use when performing the post process (default: Engine.ALPHA_DISABLE)
         */
        this.alphaMode = 0;
        /**
         * Animations to be used for the post processing
         */
        this.animations = new Array();
        /**
         * Enable Pixel Perfect mode where texture is not scaled to be power of 2.
         * Can only be used on a single postprocess or on the last one of a chain. (default: false)
         */
        this.enablePixelPerfectMode = false;
        /**
         * Force the postprocess to be applied without taking in account viewport
         */
        this.forceFullscreenViewport = true;
        /**
         * Scale mode for the post process (default: Engine.SCALEMODE_FLOOR)
         *
         * | Value | Type                                | Description |
         * | ----- | ----------------------------------- | ----------- |
         * | 1     | SCALEMODE_FLOOR                     | [engine.scalemode_floor](https://doc.babylonjs.com/api/classes/babylon.engine#scalemode_floor) |
         * | 2     | SCALEMODE_NEAREST                   | [engine.scalemode_nearest](https://doc.babylonjs.com/api/classes/babylon.engine#scalemode_nearest) |
         * | 3     | SCALEMODE_CEILING                   | [engine.scalemode_ceiling](https://doc.babylonjs.com/api/classes/babylon.engine#scalemode_ceiling) |
         *
         */
        this.scaleMode = 1;
        /**
         * Force textures to be a power of two (default: false)
         */
        this.alwaysForcePOT = false;
        this._samples = 1;
        /**
         * Modify the scale of the post process to be the same as the viewport (default: false)
         */
        this.adaptScaleToCurrentViewport = false;
        this._reusable = false;
        this._renderId = 0;
        /**
         * if externalTextureSamplerBinding is true, the "apply" method won't bind the textureSampler texture, it is expected to be done by the "outside" (by the onApplyObservable observer most probably).
         * counter-productive in some cases because if the texture bound by "apply" is different from the currently texture bound, (the one set by the onApplyObservable observer, for eg) some
         * internal structures (materialContext) will be dirtified, which may impact performances
         */
        this.externalTextureSamplerBinding = false;
        /**
         * Smart array of input and output textures for the post process.
         * @internal
         */
        this._textures = new SmartArray(2);
        /**
         * Smart array of input and output textures for the post process.
         * @internal
         */
        this._textureCache = [];
        /**
         * The index in _textures that corresponds to the output texture.
         * @internal
         */
        this._currentRenderTextureInd = 0;
        this._scaleRatio = new Vector2(1, 1);
        this._texelSize = Vector2.Zero();
        // Events
        /**
         * An event triggered when the postprocess is activated.
         */
        this.onActivateObservable = new Observable();
        /**
         * An event triggered when the postprocess changes its size.
         */
        this.onSizeChangedObservable = new Observable();
        /**
         * An event triggered when the postprocess applies its effect.
         */
        this.onApplyObservable = new Observable();
        /**
         * An event triggered before rendering the postprocess
         */
        this.onBeforeRenderObservable = new Observable();
        /**
         * An event triggered after rendering the postprocess
         */
        this.onAfterRenderObservable = new Observable();
        this.name = name;
        if (camera != null) {
            this._camera = camera;
            this._scene = camera.getScene();
            camera.attachPostProcess(this);
            this._engine = this._scene.getEngine();
            this._scene.postProcesses.push(this);
            this.uniqueId = this._scene.getUniqueId();
        }
        else if (engine) {
            this._engine = engine;
            this._engine.postProcesses.push(this);
        }
        this._options = options;
        this.renderTargetSamplingMode = samplingMode ? samplingMode : 1;
        this._reusable = reusable || false;
        this._textureType = textureType;
        this._textureFormat = textureFormat;
        this._shaderLanguage = shaderLanguage;
        this._samplers = samplers || [];
        this._samplers.push("textureSampler");
        this._fragmentUrl = fragmentUrl;
        this._vertexUrl = vertexUrl;
        this._parameters = parameters || [];
        this._parameters.push("scale");
        this._indexParameters = indexParameters;
        this._drawWrapper = new DrawWrapper(this._engine);
        if (!blockCompilation) {
            this.updateEffect(defines);
        }
    }
    /**
     * Gets a string identifying the name of the class
     * @returns "PostProcess" string
     */
    getClassName() {
        return "PostProcess";
    }
    /**
     * Gets the engine which this post process belongs to.
     * @returns The engine the post process was enabled with.
     */
    getEngine() {
        return this._engine;
    }
    /**
     * The effect that is created when initializing the post process.
     * @returns The created effect corresponding the the postprocess.
     */
    getEffect() {
        return this._drawWrapper.effect;
    }
    /**
     * To avoid multiple redundant textures for multiple post process, the output the output texture for this post process can be shared with another.
     * @param postProcess The post process to share the output with.
     * @returns This post process.
     */
    shareOutputWith(postProcess) {
        this._disposeTextures();
        this._shareOutputWithPostProcess = postProcess;
        return this;
    }
    /**
     * Reverses the effect of calling shareOutputWith and returns the post process back to its original state.
     * This should be called if the post process that shares output with this post process is disabled/disposed.
     */
    useOwnOutput() {
        if (this._textures.length == 0) {
            this._textures = new SmartArray(2);
        }
        this._shareOutputWithPostProcess = null;
    }
    /**
     * Updates the effect with the current post process compile time values and recompiles the shader.
     * @param defines Define statements that should be added at the beginning of the shader. (default: null)
     * @param uniforms Set of uniform variables that will be passed to the shader. (default: null)
     * @param samplers Set of Texture2D variables that will be passed to the shader. (default: null)
     * @param indexParameters The index parameters to be used for babylons include syntax "#include<kernelBlurVaryingDeclaration>[0..varyingCount]". (default: undefined) See usage in babylon.blurPostProcess.ts and kernelBlur.vertex.fx
     * @param onCompiled Called when the shader has been compiled.
     * @param onError Called if there is an error when compiling a shader.
     * @param vertexUrl The url of the vertex shader to be used (default: the one given at construction time)
     * @param fragmentUrl The url of the fragment shader to be used (default: the one given at construction time)
     */
    updateEffect(defines = null, uniforms = null, samplers = null, indexParameters, onCompiled, onError, vertexUrl, fragmentUrl) {
        var _a, _b;
        const customShaderCodeProcessing = PostProcess._GetShaderCodeProcessing(this.name);
        if (customShaderCodeProcessing === null || customShaderCodeProcessing === void 0 ? void 0 : customShaderCodeProcessing.defineCustomBindings) {
            const newUniforms = (_a = uniforms === null || uniforms === void 0 ? void 0 : uniforms.slice()) !== null && _a !== void 0 ? _a : [];
            newUniforms.push(...this._parameters);
            const newSamplers = (_b = samplers === null || samplers === void 0 ? void 0 : samplers.slice()) !== null && _b !== void 0 ? _b : [];
            newSamplers.push(...this._samplers);
            defines = customShaderCodeProcessing.defineCustomBindings(this.name, defines, newUniforms, newSamplers);
            uniforms = newUniforms;
            samplers = newSamplers;
        }
        this._postProcessDefines = defines;
        this._drawWrapper.effect = this._engine.createEffect({ vertex: vertexUrl !== null && vertexUrl !== void 0 ? vertexUrl : this._vertexUrl, fragment: fragmentUrl !== null && fragmentUrl !== void 0 ? fragmentUrl : this._fragmentUrl }, {
            attributes: ["position"],
            uniformsNames: uniforms || this._parameters,
            uniformBuffersNames: [],
            samplers: samplers || this._samplers,
            defines: defines !== null ? defines : "",
            fallbacks: null,
            onCompiled: onCompiled !== null && onCompiled !== void 0 ? onCompiled : null,
            onError: onError !== null && onError !== void 0 ? onError : null,
            indexParameters: indexParameters || this._indexParameters,
            processCodeAfterIncludes: (customShaderCodeProcessing === null || customShaderCodeProcessing === void 0 ? void 0 : customShaderCodeProcessing.processCodeAfterIncludes)
                ? (shaderType, code) => customShaderCodeProcessing.processCodeAfterIncludes(this.name, shaderType, code)
                : null,
            processFinalCode: (customShaderCodeProcessing === null || customShaderCodeProcessing === void 0 ? void 0 : customShaderCodeProcessing.processFinalCode)
                ? (shaderType, code) => customShaderCodeProcessing.processFinalCode(this.name, shaderType, code)
                : null,
            shaderLanguage: this._shaderLanguage,
        }, this._engine);
    }
    /**
     * The post process is reusable if it can be used multiple times within one frame.
     * @returns If the post process is reusable
     */
    isReusable() {
        return this._reusable;
    }
    /** invalidate frameBuffer to hint the postprocess to create a depth buffer */
    markTextureDirty() {
        this.width = -1;
    }
    _createRenderTargetTexture(textureSize, textureOptions, channel = 0) {
        for (let i = 0; i < this._textureCache.length; i++) {
            if (this._textureCache[i].texture.width === textureSize.width &&
                this._textureCache[i].texture.height === textureSize.height &&
                this._textureCache[i].postProcessChannel === channel &&
                this._textureCache[i].texture._generateDepthBuffer === textureOptions.generateDepthBuffer &&
                this._textureCache[i].texture.samples === textureOptions.samples) {
                return this._textureCache[i].texture;
            }
        }
        const tex = this._engine.createRenderTargetTexture(textureSize, textureOptions);
        this._textureCache.push({ texture: tex, postProcessChannel: channel, lastUsedRenderId: -1 });
        return tex;
    }
    _flushTextureCache() {
        const currentRenderId = this._renderId;
        for (let i = this._textureCache.length - 1; i >= 0; i--) {
            if (currentRenderId - this._textureCache[i].lastUsedRenderId > 100) {
                let currentlyUsed = false;
                for (let j = 0; j < this._textures.length; j++) {
                    if (this._textures.data[j] === this._textureCache[i].texture) {
                        currentlyUsed = true;
                        break;
                    }
                }
                if (!currentlyUsed) {
                    this._textureCache[i].texture.dispose();
                    this._textureCache.splice(i, 1);
                }
            }
        }
    }
    _resize(width, height, camera, needMipMaps, forceDepthStencil) {
        if (this._textures.length > 0) {
            this._textures.reset();
        }
        this.width = width;
        this.height = height;
        let firstPP = null;
        for (let i = 0; i < camera._postProcesses.length; i++) {
            if (camera._postProcesses[i] !== null) {
                firstPP = camera._postProcesses[i];
                break;
            }
        }
        const textureSize = { width: this.width, height: this.height };
        const textureOptions = {
            generateMipMaps: needMipMaps,
            generateDepthBuffer: forceDepthStencil || firstPP === this,
            generateStencilBuffer: (forceDepthStencil || firstPP === this) && this._engine.isStencilEnable,
            samplingMode: this.renderTargetSamplingMode,
            type: this._textureType,
            format: this._textureFormat,
            samples: this._samples,
        };
        this._textures.push(this._createRenderTargetTexture(textureSize, textureOptions, 0));
        if (this._reusable) {
            this._textures.push(this._createRenderTargetTexture(textureSize, textureOptions, 1));
        }
        this._texelSize.copyFromFloats(1.0 / this.width, 1.0 / this.height);
        this.onSizeChangedObservable.notifyObservers(this);
    }
    /**
     * Activates the post process by intializing the textures to be used when executed. Notifies onActivateObservable.
     * When this post process is used in a pipeline, this is call will bind the input texture of this post process to the output of the previous.
     * @param camera The camera that will be used in the post process. This camera will be used when calling onActivateObservable.
     * @param sourceTexture The source texture to be inspected to get the width and height if not specified in the post process constructor. (default: null)
     * @param forceDepthStencil If true, a depth and stencil buffer will be generated. (default: false)
     * @returns The render target wrapper that was bound to be written to.
     */
    activate(camera, sourceTexture = null, forceDepthStencil) {
        var _a, _b;
        camera = camera || this._camera;
        const scene = camera.getScene();
        const engine = scene.getEngine();
        const maxSize = engine.getCaps().maxTextureSize;
        let requiredWidth = ((sourceTexture ? sourceTexture.width : this._engine.getRenderWidth(true)) * this._options) | 0;
        const requiredHeight = ((sourceTexture ? sourceTexture.height : this._engine.getRenderHeight(true)) * this._options) | 0;
        // If rendering to a webvr camera's left or right eye only half the width should be used to avoid resize when rendered to screen
        const webVRCamera = camera.parent;
        if (webVRCamera && (webVRCamera.leftCamera == camera || webVRCamera.rightCamera == camera)) {
            requiredWidth /= 2;
        }
        let desiredWidth = this._options.width || requiredWidth;
        let desiredHeight = this._options.height || requiredHeight;
        const needMipMaps = this.renderTargetSamplingMode !== 7 &&
            this.renderTargetSamplingMode !== 1 &&
            this.renderTargetSamplingMode !== 2;
        if (!this._shareOutputWithPostProcess && !this._forcedOutputTexture) {
            if (this.adaptScaleToCurrentViewport) {
                const currentViewport = engine.currentViewport;
                if (currentViewport) {
                    desiredWidth *= currentViewport.width;
                    desiredHeight *= currentViewport.height;
                }
            }
            if (needMipMaps || this.alwaysForcePOT) {
                if (!this._options.width) {
                    desiredWidth = engine.needPOTTextures ? Engine.GetExponentOfTwo(desiredWidth, maxSize, this.scaleMode) : desiredWidth;
                }
                if (!this._options.height) {
                    desiredHeight = engine.needPOTTextures ? Engine.GetExponentOfTwo(desiredHeight, maxSize, this.scaleMode) : desiredHeight;
                }
            }
            if (this.width !== desiredWidth || this.height !== desiredHeight) {
                this._resize(desiredWidth, desiredHeight, camera, needMipMaps, forceDepthStencil);
            }
            this._textures.forEach((texture) => {
                if (texture.samples !== this.samples) {
                    this._engine.updateRenderTargetTextureSampleCount(texture, this.samples);
                }
            });
            this._flushTextureCache();
            this._renderId++;
        }
        let target;
        if (this._shareOutputWithPostProcess) {
            target = this._shareOutputWithPostProcess.inputTexture;
        }
        else if (this._forcedOutputTexture) {
            target = this._forcedOutputTexture;
            this.width = this._forcedOutputTexture.width;
            this.height = this._forcedOutputTexture.height;
        }
        else {
            target = this.inputTexture;
            let cache;
            for (let i = 0; i < this._textureCache.length; i++) {
                if (this._textureCache[i].texture === target) {
                    cache = this._textureCache[i];
                    break;
                }
            }
            if (cache) {
                cache.lastUsedRenderId = this._renderId;
            }
        }
        // Bind the input of this post process to be used as the output of the previous post process.
        if (this.enablePixelPerfectMode) {
            this._scaleRatio.copyFromFloats(requiredWidth / desiredWidth, requiredHeight / desiredHeight);
            this._engine.bindFramebuffer(target, 0, requiredWidth, requiredHeight, this.forceFullscreenViewport);
        }
        else {
            this._scaleRatio.copyFromFloats(1, 1);
            this._engine.bindFramebuffer(target, 0, undefined, undefined, this.forceFullscreenViewport);
        }
        (_b = (_a = this._engine)._debugInsertMarker) === null || _b === void 0 ? void 0 : _b.call(_a, `post process ${this.name} input`);
        this.onActivateObservable.notifyObservers(camera);
        // Clear
        if (this.autoClear && this.alphaMode === 0) {
            this._engine.clear(this.clearColor ? this.clearColor : scene.clearColor, scene._allowPostProcessClearColor, true, true);
        }
        if (this._reusable) {
            this._currentRenderTextureInd = (this._currentRenderTextureInd + 1) % 2;
        }
        return target;
    }
    /**
     * If the post process is supported.
     */
    get isSupported() {
        return this._drawWrapper.effect.isSupported;
    }
    /**
     * The aspect ratio of the output texture.
     */
    get aspectRatio() {
        if (this._shareOutputWithPostProcess) {
            return this._shareOutputWithPostProcess.aspectRatio;
        }
        if (this._forcedOutputTexture) {
            return this._forcedOutputTexture.width / this._forcedOutputTexture.height;
        }
        return this.width / this.height;
    }
    /**
     * Get a value indicating if the post-process is ready to be used
     * @returns true if the post-process is ready (shader is compiled)
     */
    isReady() {
        var _a, _b;
        return (_b = (_a = this._drawWrapper.effect) === null || _a === void 0 ? void 0 : _a.isReady()) !== null && _b !== void 0 ? _b : false;
    }
    /**
     * Binds all textures and uniforms to the shader, this will be run on every pass.
     * @returns the effect corresponding to this post process. Null if not compiled or not ready.
     */
    apply() {
        var _a, _b, _c;
        // Check
        if (!((_a = this._drawWrapper.effect) === null || _a === void 0 ? void 0 : _a.isReady())) {
            return null;
        }
        // States
        this._engine.enableEffect(this._drawWrapper);
        this._engine.setState(false);
        this._engine.setDepthBuffer(false);
        this._engine.setDepthWrite(false);
        // Alpha
        this._engine.setAlphaMode(this.alphaMode);
        if (this.alphaConstants) {
            this.getEngine().setAlphaConstants(this.alphaConstants.r, this.alphaConstants.g, this.alphaConstants.b, this.alphaConstants.a);
        }
        // Bind the output texture of the preivous post process as the input to this post process.
        let source;
        if (this._shareOutputWithPostProcess) {
            source = this._shareOutputWithPostProcess.inputTexture;
        }
        else if (this._forcedOutputTexture) {
            source = this._forcedOutputTexture;
        }
        else {
            source = this.inputTexture;
        }
        if (!this.externalTextureSamplerBinding) {
            this._drawWrapper.effect._bindTexture("textureSampler", source === null || source === void 0 ? void 0 : source.texture);
        }
        // Parameters
        this._drawWrapper.effect.setVector2("scale", this._scaleRatio);
        this.onApplyObservable.notifyObservers(this._drawWrapper.effect);
        (_c = (_b = PostProcess._GetShaderCodeProcessing(this.name)) === null || _b === void 0 ? void 0 : _b.bindCustomBindings) === null || _c === void 0 ? void 0 : _c.call(_b, this.name, this._drawWrapper.effect);
        return this._drawWrapper.effect;
    }
    _disposeTextures() {
        if (this._shareOutputWithPostProcess || this._forcedOutputTexture) {
            this._disposeTextureCache();
            return;
        }
        this._disposeTextureCache();
        this._textures.dispose();
    }
    _disposeTextureCache() {
        for (let i = this._textureCache.length - 1; i >= 0; i--) {
            this._textureCache[i].texture.dispose();
        }
        this._textureCache.length = 0;
    }
    /**
     * Sets the required values to the prepass renderer.
     * @param prePassRenderer defines the prepass renderer to setup.
     * @returns true if the pre pass is needed.
     */
    setPrePassRenderer(prePassRenderer) {
        if (this._prePassEffectConfiguration) {
            this._prePassEffectConfiguration = prePassRenderer.addEffectConfiguration(this._prePassEffectConfiguration);
            this._prePassEffectConfiguration.enabled = true;
            return true;
        }
        return false;
    }
    /**
     * Disposes the post process.
     * @param camera The camera to dispose the post process on.
     */
    dispose(camera) {
        camera = camera || this._camera;
        this._disposeTextures();
        let index;
        if (this._scene) {
            index = this._scene.postProcesses.indexOf(this);
            if (index !== -1) {
                this._scene.postProcesses.splice(index, 1);
            }
        }
        if (this._parentContainer) {
            const index = this._parentContainer.postProcesses.indexOf(this);
            if (index > -1) {
                this._parentContainer.postProcesses.splice(index, 1);
            }
            this._parentContainer = null;
        }
        index = this._engine.postProcesses.indexOf(this);
        if (index !== -1) {
            this._engine.postProcesses.splice(index, 1);
        }
        if (!camera) {
            return;
        }
        camera.detachPostProcess(this);
        index = camera._postProcesses.indexOf(this);
        if (index === 0 && camera._postProcesses.length > 0) {
            const firstPostProcess = this._camera._getFirstPostProcess();
            if (firstPostProcess) {
                firstPostProcess.markTextureDirty();
            }
        }
        this.onActivateObservable.clear();
        this.onAfterRenderObservable.clear();
        this.onApplyObservable.clear();
        this.onBeforeRenderObservable.clear();
        this.onSizeChangedObservable.clear();
    }
    /**
     * Serializes the post process to a JSON object
     * @returns the JSON object
     */
    serialize() {
        const serializationObject = SerializationHelper.Serialize(this);
        const camera = this.getCamera() || (this._scene && this._scene.activeCamera);
        serializationObject.customType = "BABYLON." + this.getClassName();
        serializationObject.cameraId = camera ? camera.id : null;
        serializationObject.reusable = this._reusable;
        serializationObject.textureType = this._textureType;
        serializationObject.fragmentUrl = this._fragmentUrl;
        serializationObject.parameters = this._parameters;
        serializationObject.samplers = this._samplers;
        serializationObject.options = this._options;
        serializationObject.defines = this._postProcessDefines;
        serializationObject.textureFormat = this._textureFormat;
        serializationObject.vertexUrl = this._vertexUrl;
        serializationObject.indexParameters = this._indexParameters;
        return serializationObject;
    }
    /**
     * Clones this post process
     * @returns a new post process similar to this one
     */
    clone() {
        const serializationObject = this.serialize();
        serializationObject._engine = this._engine;
        serializationObject.cameraId = null;
        const result = PostProcess.Parse(serializationObject, this._scene, "");
        if (!result) {
            return null;
        }
        result.onActivateObservable = this.onActivateObservable.clone();
        result.onSizeChangedObservable = this.onSizeChangedObservable.clone();
        result.onApplyObservable = this.onApplyObservable.clone();
        result.onBeforeRenderObservable = this.onBeforeRenderObservable.clone();
        result.onAfterRenderObservable = this.onAfterRenderObservable.clone();
        result._prePassEffectConfiguration = this._prePassEffectConfiguration;
        return result;
    }
    /**
     * Creates a material from parsed material data
     * @param parsedPostProcess defines parsed post process data
     * @param scene defines the hosting scene
     * @param rootUrl defines the root URL to use to load textures
     * @returns a new post process
     */
    static Parse(parsedPostProcess, scene, rootUrl) {
        const postProcessType = GetClass(parsedPostProcess.customType);
        if (!postProcessType || !postProcessType._Parse) {
            return null;
        }
        const camera = scene ? scene.getCameraById(parsedPostProcess.cameraId) : null;
        return postProcessType._Parse(parsedPostProcess, camera, scene, rootUrl);
    }
    /**
     * @internal
     */
    static _Parse(parsedPostProcess, targetCamera, scene, rootUrl) {
        return SerializationHelper.Parse(() => {
            return new PostProcess(parsedPostProcess.name, parsedPostProcess.fragmentUrl, parsedPostProcess.parameters, parsedPostProcess.samplers, parsedPostProcess.options, targetCamera, parsedPostProcess.renderTargetSamplingMode, parsedPostProcess._engine, parsedPostProcess.reusable, parsedPostProcess.defines, parsedPostProcess.textureType, parsedPostProcess.vertexUrl, parsedPostProcess.indexParameters, false, parsedPostProcess.textureFormat);
        }, parsedPostProcess, scene, rootUrl);
    }
}
PostProcess._CustomShaderCodeProcessing = {};
__decorate([
    serialize()
], PostProcess.prototype, "uniqueId", void 0);
__decorate([
    serialize()
], PostProcess.prototype, "name", void 0);
__decorate([
    serialize()
], PostProcess.prototype, "width", void 0);
__decorate([
    serialize()
], PostProcess.prototype, "height", void 0);
__decorate([
    serialize()
], PostProcess.prototype, "renderTargetSamplingMode", void 0);
__decorate([
    serializeAsColor4()
], PostProcess.prototype, "clearColor", void 0);
__decorate([
    serialize()
], PostProcess.prototype, "autoClear", void 0);
__decorate([
    serialize()
], PostProcess.prototype, "alphaMode", void 0);
__decorate([
    serialize()
], PostProcess.prototype, "alphaConstants", void 0);
__decorate([
    serialize()
], PostProcess.prototype, "enablePixelPerfectMode", void 0);
__decorate([
    serialize()
], PostProcess.prototype, "forceFullscreenViewport", void 0);
__decorate([
    serialize()
], PostProcess.prototype, "scaleMode", void 0);
__decorate([
    serialize()
], PostProcess.prototype, "alwaysForcePOT", void 0);
__decorate([
    serialize("samples")
], PostProcess.prototype, "_samples", void 0);
__decorate([
    serialize()
], PostProcess.prototype, "adaptScaleToCurrentViewport", void 0);
RegisterClass("BABYLON.PostProcess", PostProcess);
//# sourceMappingURL=postProcess.js.map