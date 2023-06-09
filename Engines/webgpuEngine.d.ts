import type { Nullable, DataArray, IndicesArray, Immutable } from "../types";
import { Engine } from "../Engines/engine";
import { InternalTexture, InternalTextureSource } from "../Materials/Textures/internalTexture";
import type { IEffectCreationOptions } from "../Materials/effect";
import { Effect } from "../Materials/effect";
import type { EffectFallbacks } from "../Materials/effectFallbacks";
import { VertexBuffer } from "../Buffers/buffer";
import type { IPipelineContext } from "./IPipelineContext";
import type { DataBuffer } from "../Buffers/dataBuffer";
import type { BaseTexture } from "../Materials/Textures/baseTexture";
import type { IShaderProcessor } from "./Processors/iShaderProcessor";
import type { ShaderProcessingContext } from "./Processors/shaderProcessingOptions";
import { WebGPUTextureHelper } from "./WebGPU/webgpuTextureHelper";
import type { ISceneLike, ThinEngineOptions } from "./thinEngine";
import { WebGPUBufferManager } from "./WebGPU/webgpuBufferManager";
import type { HardwareTextureWrapper } from "../Materials/Textures/hardwareTextureWrapper";
import type { IColor4Like } from "../Maths/math.like";
import { WebGPURenderPassWrapper } from "./WebGPU/webgpuRenderPassWrapper";
import { WebGPUCacheSampler } from "./WebGPU/webgpuCacheSampler";
import type { WebGPUCacheRenderPipeline } from "./WebGPU/webgpuCacheRenderPipeline";
import { DrawWrapper } from "../Materials/drawWrapper";
import { WebGPUMaterialContext } from "./WebGPU/webgpuMaterialContext";
import { WebGPUDrawContext } from "./WebGPU/webgpuDrawContext";
import type { IStencilState } from "../States/IStencilState";
import { WebGPUBundleList } from "./WebGPU/webgpuBundleList";
import { WebGPUTimestampQuery } from "./WebGPU/webgpuTimestampQuery";
import type { ComputeEffect } from "../Compute/computeEffect";
import { WebGPUOcclusionQuery } from "./WebGPU/webgpuOcclusionQuery";
import { Observable } from "../Misc/observable";
import type { TwgslOptions } from "./WebGPU/webgpuTintWASM";
import type { ExternalTexture } from "../Materials/Textures/externalTexture";
import { ShaderLanguage } from "../Materials/shaderLanguage";
import type { InternalTextureCreationOptions, TextureSize } from "../Materials/Textures/textureCreationOptions";
import type { WebGPUDataBuffer } from "../Meshes/WebGPU/webgpuDataBuffer";
declare type RenderTargetWrapper = import("./renderTargetWrapper").RenderTargetWrapper;
/**
 * Options to load the associated Glslang library
 */
export interface GlslangOptions {
    /**
     * Defines an existing instance of Glslang (useful in modules who do not access the global instance).
     */
    glslang?: any;
    /**
     * Defines the URL of the glslang JS File.
     */
    jsPath?: string;
    /**
     * Defines the URL of the glslang WASM File.
     */
    wasmPath?: string;
}
/**
 * Options to create the WebGPU engine
 */
export interface WebGPUEngineOptions extends ThinEngineOptions, GPURequestAdapterOptions {
    /**
     * Defines the category of adapter to use.
     * Is it the discrete or integrated device.
     */
    powerPreference?: GPUPowerPreference;
    /**
     * Defines the device descriptor used to create a device.
     */
    deviceDescriptor?: GPUDeviceDescriptor;
    /**
     * Defines the requested Swap Chain Format.
     */
    swapChainFormat?: GPUTextureFormat;
    /**
     * Defines whether we should generate debug markers in the gpu command lists (can be seen with PIX for eg)
     */
    enableGPUDebugMarkers?: boolean;
    /**
     * Options to load the associated Glslang library
     */
    glslangOptions?: GlslangOptions;
    /**
     * Options to load the associated Twgsl library
     */
    twgslOptions?: TwgslOptions;
}
/**
 * The web GPU engine class provides support for WebGPU version of babylon.js.
 * @since 5.0.0
 */
export declare class WebGPUEngine extends Engine {
    private static readonly _GLSLslangDefaultOptions;
    /** true to enable using TintWASM to convert Spir-V to WGSL */
    static UseTWGSL: boolean;
    private readonly _uploadEncoderDescriptor;
    private readonly _renderEncoderDescriptor;
    private readonly _renderTargetEncoderDescriptor;
    /** @internal */
    readonly _clearDepthValue = 1;
    /** @internal */
    readonly _clearReverseDepthValue = 0;
    /** @internal */
    readonly _clearStencilValue = 0;
    private readonly _defaultSampleCount;
    private _canvas;
    /** @internal */
    _options: WebGPUEngineOptions;
    private _glslang;
    private _tintWASM;
    private _adapter;
    private _adapterSupportedExtensions;
    /** @internal */
    _device: GPUDevice;
    private _deviceEnabledExtensions;
    private _context;
    private _mainPassSampleCount;
    /** @internal */
    _textureHelper: WebGPUTextureHelper;
    /** @internal */
    _bufferManager: WebGPUBufferManager;
    private _clearQuad;
    /** @internal */
    _cacheSampler: WebGPUCacheSampler;
    /** @internal */
    _cacheRenderPipeline: WebGPUCacheRenderPipeline;
    private _cacheBindGroups;
    private _emptyVertexBuffer;
    /** @internal */
    _mrtAttachments: number[];
    /** @internal */
    _timestampQuery: WebGPUTimestampQuery;
    /** @internal */
    _occlusionQuery: WebGPUOcclusionQuery;
    /** @internal */
    _compiledComputeEffects: {
        [key: string]: ComputeEffect;
    };
    /** @internal */
    _counters: {
        numEnableEffects: number;
        numEnableDrawWrapper: number;
        numBundleCreationNonCompatMode: number;
        numBundleReuseNonCompatMode: number;
    };
    /**
     * Counters from last frame
     */
    readonly countersLastFrame: {
        numEnableEffects: number;
        numEnableDrawWrapper: number;
        numBundleCreationNonCompatMode: number;
        numBundleReuseNonCompatMode: number;
    };
    /**
     * Max number of uncaptured error messages to log
     */
    numMaxUncapturedErrors: number;
    private _mainTexture;
    private _depthTexture;
    private _mainTextureExtends;
    private _depthTextureFormat;
    private _colorFormat;
    /** @internal */
    _ubInvertY: WebGPUDataBuffer;
    /** @internal */
    _ubDontInvertY: WebGPUDataBuffer;
    /** @internal */
    _uploadEncoder: GPUCommandEncoder;
    /** @internal */
    _renderEncoder: GPUCommandEncoder;
    /** @internal */
    _renderTargetEncoder: GPUCommandEncoder;
    private _commandBuffers;
    /** @internal */
    _currentRenderPass: Nullable<GPURenderPassEncoder>;
    /** @internal */
    _mainRenderPassWrapper: WebGPURenderPassWrapper;
    /** @internal */
    _rttRenderPassWrapper: WebGPURenderPassWrapper;
    /** @internal */
    _pendingDebugCommands: Array<[string, Nullable<string>]>;
    /** @internal */
    _bundleList: WebGPUBundleList;
    /** @internal */
    _bundleListRenderTarget: WebGPUBundleList;
    /** @internal */
    _onAfterUnbindFrameBufferObservable: Observable<WebGPUEngine>;
    private _defaultDrawContext;
    private _defaultMaterialContext;
    /** @internal */
    _currentDrawContext: WebGPUDrawContext;
    /** @internal */
    _currentMaterialContext: WebGPUMaterialContext;
    private _currentOverrideVertexBuffers;
    private _currentIndexBuffer;
    private _colorWriteLocal;
    private _forceEnableEffect;
    /** @internal */
    dbgShowShaderCode: boolean;
    /** @internal */
    dbgSanityChecks: boolean;
    /** @internal */
    dbgVerboseLogsForFirstFrames: boolean;
    /** @internal */
    dbgVerboseLogsNumFrames: number;
    /** @internal */
    dbgLogIfNotDrawWrapper: boolean;
    /** @internal */
    dbgShowEmptyEnableEffectCalls: boolean;
    private _snapshotRendering;
    /**
     * Gets or sets the snapshot rendering mode
     */
    get snapshotRenderingMode(): number;
    set snapshotRenderingMode(mode: number);
    /**
     * Creates a new snapshot at the next frame using the current snapshotRenderingMode
     */
    snapshotRenderingReset(): void;
    /**
     * Enables or disables the snapshot rendering mode
     * Note that the WebGL engine does not support snapshot rendering so setting the value won't have any effect for this engine
     */
    get snapshotRendering(): boolean;
    set snapshotRendering(activate: boolean);
    /**
     * Sets this to true to disable the cache for the samplers. You should do it only for testing purpose!
     */
    get disableCacheSamplers(): boolean;
    set disableCacheSamplers(disable: boolean);
    /**
     * Sets this to true to disable the cache for the render pipelines. You should do it only for testing purpose!
     */
    get disableCacheRenderPipelines(): boolean;
    set disableCacheRenderPipelines(disable: boolean);
    /**
     * Sets this to true to disable the cache for the bind groups. You should do it only for testing purpose!
     */
    get disableCacheBindGroups(): boolean;
    set disableCacheBindGroups(disable: boolean);
    /**
     * Gets a Promise<boolean> indicating if the engine can be instantiated (ie. if a WebGPU context can be found)
     */
    static get IsSupportedAsync(): Promise<boolean>;
    /**
     * Not supported by WebGPU, you should call IsSupportedAsync instead!
     */
    static get IsSupported(): boolean;
    /**
     * Gets a boolean indicating that the engine supports uniform buffers
     */
    get supportsUniformBuffers(): boolean;
    /** Gets the supported extensions by the WebGPU adapter */
    get supportedExtensions(): Immutable<GPUFeatureName[]>;
    /** Gets the currently enabled extensions on the WebGPU device */
    get enabledExtensions(): Immutable<GPUFeatureName[]>;
    /**
     * Returns a string describing the current engine
     */
    get description(): string;
    /**
     * Returns the version of the engine
     */
    get version(): number;
    /**
     * Gets an object containing information about the current engine context
     * @returns an object containing the vendor, the renderer and the version of the current engine context
     */
    getInfo(): {
        vendor: string;
        renderer: string;
        version: string;
    };
    /**
     * (WebGPU only) True (default) to be in compatibility mode, meaning rendering all existing scenes without artifacts (same rendering than WebGL).
     * Setting the property to false will improve performances but may not work in some scenes if some precautions are not taken.
     * See https://doc.babylonjs.com/setup/support/webGPU/webGPUOptimization/webGPUNonCompatibilityMode for more details
     */
    get compatibilityMode(): boolean;
    set compatibilityMode(mode: boolean);
    /** @internal */
    get currentSampleCount(): number;
    /**
     * Create a new instance of the gpu engine asynchronously
     * @param canvas Defines the canvas to use to display the result
     * @param options Defines the options passed to the engine to create the GPU context dependencies
     * @returns a promise that resolves with the created engine
     */
    static CreateAsync(canvas: HTMLCanvasElement, options?: WebGPUEngineOptions): Promise<WebGPUEngine>;
    /**
     * Indicates if the z range in NDC space is 0..1 (value: true) or -1..1 (value: false)
     */
    readonly isNDCHalfZRange: boolean;
    /**
     * Indicates that the origin of the texture/framebuffer space is the bottom left corner. If false, the origin is top left
     */
    readonly hasOriginBottomLeft: boolean;
    /**
     * Create a new instance of the gpu engine.
     * @param canvas Defines the canvas to use to display the result
     * @param options Defines the options passed to the engine to create the GPU context dependencies
     */
    constructor(canvas: HTMLCanvasElement, options?: WebGPUEngineOptions);
    /**
     * Initializes the WebGPU context and dependencies.
     * @param glslangOptions Defines the GLSLang compiler options if necessary
     * @param twgslOptions Defines the Twgsl compiler options if necessary
     * @returns a promise notifying the readiness of the engine.
     */
    initAsync(glslangOptions?: GlslangOptions, twgslOptions?: TwgslOptions): Promise<void>;
    private _initGlslang;
    private _initializeLimits;
    private _initializeContextAndSwapChain;
    private _initializeMainAttachments;
    private _configureContext;
    /**
     * Force a specific size of the canvas
     * @param width defines the new canvas' width
     * @param height defines the new canvas' height
     * @param forceSetSize true to force setting the sizes of the underlying canvas
     * @returns true if the size was changed
     */
    setSize(width: number, height: number, forceSetSize?: boolean): boolean;
    private _shaderProcessorWGSL;
    /**
     * @internal
     */
    _getShaderProcessor(shaderLanguage: ShaderLanguage): Nullable<IShaderProcessor>;
    /**
     * @internal
     */
    _getShaderProcessingContext(shaderLanguage: ShaderLanguage): Nullable<ShaderProcessingContext>;
    /** @internal */
    applyStates(): void;
    /**
     * Force the entire cache to be cleared
     * You should not have to use this function unless your engine needs to share the WebGPU context with another engine
     * @param bruteForce defines a boolean to force clearing ALL caches (including stencil, detoh and alpha states)
     */
    wipeCaches(bruteForce?: boolean): void;
    /**
     * Enable or disable color writing
     * @param enable defines the state to set
     */
    setColorWrite(enable: boolean): void;
    /**
     * Gets a boolean indicating if color writing is enabled
     * @returns the current color writing state
     */
    getColorWrite(): boolean;
    private _viewportsCurrent;
    private _resetCurrentViewport;
    private _mustUpdateViewport;
    private _applyViewport;
    /**
     * @internal
     */
    _viewport(x: number, y: number, width: number, height: number): void;
    private _scissorsCurrent;
    protected _scissorCached: {
        x: number;
        y: number;
        z: number;
        w: number;
    };
    private _resetCurrentScissor;
    private _mustUpdateScissor;
    private _applyScissor;
    private _scissorIsActive;
    enableScissor(x: number, y: number, width: number, height: number): void;
    disableScissor(): void;
    private _stencilRefsCurrent;
    private _resetCurrentStencilRef;
    private _mustUpdateStencilRef;
    /**
     * @internal
     */
    _applyStencilRef(renderPass: GPURenderPassEncoder): void;
    private _blendColorsCurrent;
    private _resetCurrentColorBlend;
    private _mustUpdateBlendColor;
    private _applyBlendColor;
    /**
     * Clear the current render buffer or the current render target (if any is set up)
     * @param color defines the color to use
     * @param backBuffer defines if the back buffer must be cleared
     * @param depth defines if the depth buffer must be cleared
     * @param stencil defines if the stencil buffer must be cleared
     */
    clear(color: Nullable<IColor4Like>, backBuffer: boolean, depth: boolean, stencil?: boolean): void;
    private _clearFullQuad;
    /**
     * Creates a vertex buffer
     * @param data the data for the vertex buffer
     * @returns the new buffer
     */
    createVertexBuffer(data: DataArray): DataBuffer;
    /**
     * Creates a vertex buffer
     * @param data the data for the dynamic vertex buffer
     * @returns the new buffer
     */
    createDynamicVertexBuffer(data: DataArray): DataBuffer;
    /**
     * Creates a new index buffer
     * @param indices defines the content of the index buffer
     * @returns a new buffer
     */
    createIndexBuffer(indices: IndicesArray): DataBuffer;
    /**
     * @internal
     */
    _createBuffer(data: DataArray | number, creationFlags: number): DataBuffer;
    /**
     * @internal
     */
    bindBuffersDirectly(): void;
    /**
     * @internal
     */
    updateAndBindInstancesBuffer(): void;
    /**
     * Bind a list of vertex buffers with the engine
     * @param vertexBuffers defines the list of vertex buffers to bind
     * @param indexBuffer defines the index buffer to bind
     * @param effect defines the effect associated with the vertex buffers
     * @param overrideVertexBuffers defines optional list of avertex buffers that overrides the entries in vertexBuffers
     */
    bindBuffers(vertexBuffers: {
        [key: string]: Nullable<VertexBuffer>;
    }, indexBuffer: Nullable<DataBuffer>, effect: Effect, overrideVertexBuffers?: {
        [kind: string]: Nullable<VertexBuffer>;
    }): void;
    /**
     * @internal
     */
    _releaseBuffer(buffer: DataBuffer): boolean;
    /**
     * Create a new effect (used to store vertex/fragment shaders)
     * @param baseName defines the base name of the effect (The name of file without .fragment.fx or .vertex.fx)
     * @param attributesNamesOrOptions defines either a list of attribute names or an IEffectCreationOptions object
     * @param uniformsNamesOrEngine defines either a list of uniform names or the engine to use
     * @param samplers defines an array of string used to represent textures
     * @param defines defines the string containing the defines to use to compile the shaders
     * @param fallbacks defines the list of potential fallbacks to use if shader compilation fails
     * @param onCompiled defines a function to call when the effect creation is successful
     * @param onError defines a function to call when the effect creation has failed
     * @param indexParameters defines an object containing the index values to use to compile shaders (like the maximum number of simultaneous lights)
     * @param shaderLanguage the language the shader is written in (default: GLSL)
     * @returns the new Effect
     */
    createEffect(baseName: any, attributesNamesOrOptions: string[] | IEffectCreationOptions, uniformsNamesOrEngine: string[] | Engine, samplers?: string[], defines?: string, fallbacks?: EffectFallbacks, onCompiled?: Nullable<(effect: Effect) => void>, onError?: Nullable<(effect: Effect, errors: string) => void>, indexParameters?: any, shaderLanguage?: ShaderLanguage): Effect;
    private _compileRawShaderToSpirV;
    private _compileShaderToSpirV;
    private _getWGSLShader;
    private _createPipelineStageDescriptor;
    private _compileRawPipelineStageDescriptor;
    private _compilePipelineStageDescriptor;
    /**
     * @internal
     */
    createRawShaderProgram(): WebGLProgram;
    /**
     * @internal
     */
    createShaderProgram(): WebGLProgram;
    /**
     * Inline functions in shader code that are marked to be inlined
     * @param code code to inline
     * @returns inlined code
     */
    inlineShaderCode(code: string): string;
    /**
     * Creates a new pipeline context
     * @param shaderProcessingContext defines the shader processing context used during the processing if available
     * @returns the new pipeline
     */
    createPipelineContext(shaderProcessingContext: Nullable<ShaderProcessingContext>): IPipelineContext;
    /**
     * Creates a new material context
     * @returns the new context
     */
    createMaterialContext(): WebGPUMaterialContext | undefined;
    /**
     * Creates a new draw context
     * @returns the new context
     */
    createDrawContext(): WebGPUDrawContext | undefined;
    /**
     * @internal
     */
    _preparePipelineContext(pipelineContext: IPipelineContext, vertexSourceCode: string, fragmentSourceCode: string, createAsRaw: boolean, rawVertexSourceCode: string, rawFragmentSourceCode: string, rebuildRebind: any, defines: Nullable<string>): void;
    /**
     * Gets the list of active attributes for a given WebGPU program
     * @param pipelineContext defines the pipeline context to use
     * @param attributesNames defines the list of attribute names to get
     * @returns an array of indices indicating the offset of each attribute
     */
    getAttributes(pipelineContext: IPipelineContext, attributesNames: string[]): number[];
    /**
     * Activates an effect, making it the current one (ie. the one used for rendering)
     * @param effect defines the effect to activate
     */
    enableEffect(effect: Nullable<Effect | DrawWrapper>): void;
    /**
     * @internal
     */
    _releaseEffect(effect: Effect): void;
    /**
     * Force the engine to release all cached effects. This means that next effect compilation will have to be done completely even if a similar effect was already compiled
     */
    releaseEffects(): void;
    _deletePipelineContext(pipelineContext: IPipelineContext): void;
    /**
     * Gets a boolean indicating that only power of 2 textures are supported
     * Please note that you can still use non power of 2 textures but in this case the engine will forcefully convert them
     */
    get needPOTTextures(): boolean;
    /** @internal */
    _createHardwareTexture(): HardwareTextureWrapper;
    /**
     * @internal
     */
    _releaseTexture(texture: InternalTexture): void;
    /**
     * @internal
     */
    _getRGBABufferInternalSizedFormat(): number;
    updateTextureComparisonFunction(texture: InternalTexture, comparisonFunction: number): void;
    /**
     * Creates an internal texture without binding it to a framebuffer
     * @internal
     * @param size defines the size of the texture
     * @param options defines the options used to create the texture
     * @param delayGPUTextureCreation true to delay the texture creation the first time it is really needed. false to create it right away
     * @param source source type of the texture
     * @returns a new internal texture
     */
    _createInternalTexture(size: TextureSize, options: boolean | InternalTextureCreationOptions, delayGPUTextureCreation?: boolean, source?: InternalTextureSource): InternalTexture;
    /**
     * Usually called from Texture.ts.
     * Passed information to create a hardware texture
     * @param url defines a value which contains one of the following:
     * * A conventional http URL, e.g. 'http://...' or 'file://...'
     * * A base64 string of in-line texture data, e.g. 'data:image/jpg;base64,/...'
     * * An indicator that data being passed using the buffer parameter, e.g. 'data:mytexture.jpg'
     * @param noMipmap defines a boolean indicating that no mipmaps shall be generated.  Ignored for compressed textures.  They must be in the file
     * @param invertY when true, image is flipped when loaded.  You probably want true. Certain compressed textures may invert this if their default is inverted (eg. ktx)
     * @param scene needed for loading to the correct scene
     * @param samplingMode mode with should be used sample / access the texture (Default: Texture.TRILINEAR_SAMPLINGMODE)
     * @param onLoad optional callback to be called upon successful completion
     * @param onError optional callback to be called upon failure
     * @param buffer a source of a file previously fetched as either a base64 string, an ArrayBuffer (compressed or image format), HTMLImageElement (image format), or a Blob
     * @param fallback an internal argument in case the function must be called again, due to etc1 not having alpha capabilities
     * @param format internal format.  Default: RGB when extension is '.jpg' else RGBA.  Ignored for compressed textures
     * @param forcedExtension defines the extension to use to pick the right loader
     * @param mimeType defines an optional mime type
     * @param loaderOptions options to be passed to the loader
     * @param creationFlags specific flags to use when creating the texture (Constants.TEXTURE_CREATIONFLAG_STORAGE for storage textures, for eg)
     * @param useSRGBBuffer defines if the texture must be loaded in a sRGB GPU buffer (if supported by the GPU).
     * @returns a InternalTexture for assignment back into BABYLON.Texture
     */
    createTexture(url: Nullable<string>, noMipmap: boolean, invertY: boolean, scene: Nullable<ISceneLike>, samplingMode?: number, onLoad?: Nullable<(texture: InternalTexture) => void>, onError?: Nullable<(message: string, exception: any) => void>, buffer?: Nullable<string | ArrayBuffer | ArrayBufferView | HTMLImageElement | Blob | ImageBitmap>, fallback?: Nullable<InternalTexture>, format?: Nullable<number>, forcedExtension?: Nullable<string>, mimeType?: string, loaderOptions?: any, creationFlags?: number, useSRGBBuffer?: boolean): InternalTexture;
    /**
     * Wraps an external web gpu texture in a Babylon texture.
     * @param texture defines the external texture
     * @returns the babylon internal texture
     */
    wrapWebGPUTexture(texture: GPUTexture): InternalTexture;
    /**
     * Wraps an external web gl texture in a Babylon texture.
     * @returns the babylon internal texture
     */
    wrapWebGLTexture(): InternalTexture;
    generateMipMapsForCubemap(texture: InternalTexture): void;
    /**
     * Update the sampling mode of a given texture
     * @param samplingMode defines the required sampling mode
     * @param texture defines the texture to update
     * @param generateMipMaps defines whether to generate mipmaps for the texture
     */
    updateTextureSamplingMode(samplingMode: number, texture: InternalTexture, generateMipMaps?: boolean): void;
    /**
     * Update the sampling mode of a given texture
     * @param texture defines the texture to update
     * @param wrapU defines the texture wrap mode of the u coordinates
     * @param wrapV defines the texture wrap mode of the v coordinates
     * @param wrapR defines the texture wrap mode of the r coordinates
     */
    updateTextureWrappingMode(texture: InternalTexture, wrapU: Nullable<number>, wrapV?: Nullable<number>, wrapR?: Nullable<number>): void;
    /**
     * Update the dimensions of a texture
     * @param texture texture to update
     * @param width new width of the texture
     * @param height new height of the texture
     * @param depth new depth of the texture
     */
    updateTextureDimensions(texture: InternalTexture, width: number, height: number, depth?: number): void;
    /**
     * @internal
     */
    _setInternalTexture(name: string, texture: Nullable<InternalTexture | ExternalTexture>, baseName?: string): void;
    /**
     * Sets a texture to the according uniform.
     * @param channel The texture channel
     * @param unused unused parameter
     * @param texture The texture to apply
     * @param name The name of the uniform in the effect
     */
    setTexture(channel: number, unused: Nullable<WebGLUniformLocation>, texture: Nullable<BaseTexture>, name: string): void;
    /**
     * Sets an array of texture to the WebGPU context
     * @param channel defines the channel where the texture array must be set
     * @param unused unused parameter
     * @param textures defines the array of textures to bind
     * @param name name of the channel
     */
    setTextureArray(channel: number, unused: Nullable<WebGLUniformLocation>, textures: BaseTexture[], name: string): void;
    protected _setTexture(channel: number, texture: Nullable<BaseTexture>, isPartOfTextureArray?: boolean, depthStencilTexture?: boolean, name?: string, baseName?: string): boolean;
    /**
     * @internal
     */
    _setAnisotropicLevel(target: number, internalTexture: InternalTexture, anisotropicFilteringLevel: number): void;
    /**
     * @internal
     */
    _bindTexture(channel: number, texture: InternalTexture, name: string): void;
    /**
     * Generates the mipmaps for a texture
     * @param texture texture to generate the mipmaps for
     */
    generateMipmaps(texture: InternalTexture): void;
    /**
     * @internal
     */
    _generateMipmaps(texture: InternalTexture, commandEncoder?: GPUCommandEncoder): void;
    /**
     * Update a portion of an internal texture
     * @param texture defines the texture to update
     * @param imageData defines the data to store into the texture
     * @param xOffset defines the x coordinates of the update rectangle
     * @param yOffset defines the y coordinates of the update rectangle
     * @param width defines the width of the update rectangle
     * @param height defines the height of the update rectangle
     * @param faceIndex defines the face index if texture is a cube (0 by default)
     * @param lod defines the lod level to update (0 by default)
     * @param generateMipMaps defines whether to generate mipmaps or not
     */
    updateTextureData(texture: InternalTexture, imageData: ArrayBufferView, xOffset: number, yOffset: number, width: number, height: number, faceIndex?: number, lod?: number, generateMipMaps?: boolean): void;
    /**
     * @internal
     */
    _uploadCompressedDataToTextureDirectly(texture: InternalTexture, internalFormat: number, width: number, height: number, imageData: ArrayBufferView, faceIndex?: number, lod?: number): void;
    /**
     * @internal
     */
    _uploadDataToTextureDirectly(texture: InternalTexture, imageData: ArrayBufferView, faceIndex?: number, lod?: number, babylonInternalFormat?: number, useTextureWidthAndHeight?: boolean): void;
    /**
     * @internal
     */
    _uploadArrayBufferViewToTexture(texture: InternalTexture, imageData: ArrayBufferView, faceIndex?: number, lod?: number): void;
    /**
     * @internal
     */
    _uploadImageToTexture(texture: InternalTexture, image: HTMLImageElement | ImageBitmap, faceIndex?: number, lod?: number): void;
    /**
     * Reads pixels from the current frame buffer. Please note that this function can be slow
     * @param x defines the x coordinate of the rectangle where pixels must be read
     * @param y defines the y coordinate of the rectangle where pixels must be read
     * @param width defines the width of the rectangle where pixels must be read
     * @param height defines the height of the rectangle where pixels must be read
     * @param hasAlpha defines whether the output should have alpha or not (defaults to true)
     * @param flushRenderer true to flush the renderer from the pending commands before reading the pixels
     * @returns a ArrayBufferView promise (Uint8Array) containing RGBA colors
     */
    readPixels(x: number, y: number, width: number, height: number, hasAlpha?: boolean, flushRenderer?: boolean): Promise<ArrayBufferView>;
    /**
     * Begin a new frame
     */
    beginFrame(): void;
    /**
     * End the current frame
     */
    endFrame(): void;
    /**
     * Force a WebGPU flush (ie. a flush of all waiting commands)
     * @param reopenPass true to reopen at the end of the function the pass that was active when entering the function
     */
    flushFramebuffer(reopenPass?: boolean): void;
    /** @internal */
    _currentFrameBufferIsDefaultFrameBuffer(): boolean;
    private _startRenderTargetRenderPass;
    /** @internal */
    _endRenderTargetRenderPass(): void;
    private _getCurrentRenderPass;
    /** @internal */
    _getCurrentRenderPassIndex(): number;
    private _startMainRenderPass;
    private _endMainRenderPass;
    /**
     * Binds the frame buffer to the specified texture.
     * @param texture The render target wrapper to render to
     * @param faceIndex The face of the texture to render to in case of cube texture
     * @param requiredWidth The width of the target to render to
     * @param requiredHeight The height of the target to render to
     * @param forceFullscreenViewport Forces the viewport to be the entire texture/screen if true
     * @param lodLevel defines the lod level to bind to the frame buffer
     * @param layer defines the 2d array index to bind to frame buffer to
     */
    bindFramebuffer(texture: RenderTargetWrapper, faceIndex?: number, requiredWidth?: number, requiredHeight?: number, forceFullscreenViewport?: boolean, lodLevel?: number, layer?: number): void;
    /**
     * Unbind the current render target texture from the WebGPU context
     * @param texture defines the render target wrapper to unbind
     * @param disableGenerateMipMaps defines a boolean indicating that mipmaps must not be generated
     * @param onBeforeUnbind defines a function which will be called before the effective unbind
     */
    unBindFramebuffer(texture: RenderTargetWrapper, disableGenerateMipMaps?: boolean, onBeforeUnbind?: () => void): void;
    /**
     * Unbind the current render target and bind the default framebuffer
     */
    restoreDefaultFramebuffer(): void;
    /**
     * @internal
     */
    _setColorFormat(wrapper: WebGPURenderPassWrapper): void;
    /**
     * @internal
     */
    _setDepthTextureFormat(wrapper: WebGPURenderPassWrapper): void;
    setDitheringState(): void;
    setRasterizerState(): void;
    /**
     * Set various states to the webGL context
     * @param culling defines culling state: true to enable culling, false to disable it
     * @param zOffset defines the value to apply to zOffset (0 by default)
     * @param force defines if states must be applied even if cache is up to date
     * @param reverseSide defines if culling must be reversed (CCW if false, CW if true)
     * @param cullBackFaces true to cull back faces, false to cull front faces (if culling is enabled)
     * @param stencil stencil states to set
     * @param zOffsetUnits defines the value to apply to zOffsetUnits (0 by default)
     */
    setState(culling: boolean, zOffset?: number, force?: boolean, reverseSide?: boolean, cullBackFaces?: boolean, stencil?: IStencilState, zOffsetUnits?: number): void;
    private _applyRenderPassChanges;
    private _draw;
    /**
     * Draw a list of indexed primitives
     * @param fillMode defines the primitive to use
     * @param indexStart defines the starting index
     * @param indexCount defines the number of index to draw
     * @param instancesCount defines the number of instances to draw (if instantiation is enabled)
     */
    drawElementsType(fillMode: number, indexStart: number, indexCount: number, instancesCount?: number): void;
    /**
     * Draw a list of unindexed primitives
     * @param fillMode defines the primitive to use
     * @param verticesStart defines the index of first vertex to draw
     * @param verticesCount defines the count of vertices to draw
     * @param instancesCount defines the number of instances to draw (if instantiation is enabled)
     */
    drawArraysType(fillMode: number, verticesStart: number, verticesCount: number, instancesCount?: number): void;
    /**
     * Dispose and release all associated resources
     */
    dispose(): void;
    /**
     * Gets the current render width
     * @param useScreen defines if screen size must be used (or the current render target if any)
     * @returns a number defining the current render width
     */
    getRenderWidth(useScreen?: boolean): number;
    /**
     * Gets the current render height
     * @param useScreen defines if screen size must be used (or the current render target if any)
     * @returns a number defining the current render height
     */
    getRenderHeight(useScreen?: boolean): number;
    /**
     * Gets the HTML canvas attached with the current WebGPU context
     * @returns a HTML canvas
     */
    getRenderingCanvas(): Nullable<HTMLCanvasElement>;
    /**
     * Get the current error code of the WebGPU context
     * @returns the error code
     */
    getError(): number;
    /**
     * @internal
     */
    bindSamplers(): void;
    /**
     * @internal
     */
    _bindTextureDirectly(): boolean;
    /**
     * Gets a boolean indicating if all created effects are ready
     * @returns always true - No parallel shader compilation
     */
    areAllEffectsReady(): boolean;
    /**
     * @internal
     */
    _executeWhenRenderingStateIsCompiled(pipelineContext: IPipelineContext, action: () => void): void;
    /**
     * @internal
     */
    _isRenderingStateCompiled(): boolean;
    /** @internal */
    _getUnpackAlignement(): number;
    /**
     * @internal
     */
    _unpackFlipY(): void;
    /**
     * @internal
     */
    _bindUnboundFramebuffer(): void;
    /**
     * @internal
     */
    _getSamplingParameters(): {
        min: number;
        mag: number;
    };
    /**
     * @internal
     */
    getUniforms(): Nullable<WebGLUniformLocation>[];
    /**
     * @internal
     */
    setIntArray(): boolean;
    /**
     * @internal
     */
    setIntArray2(): boolean;
    /**
     * @internal
     */
    setIntArray3(): boolean;
    /**
     * @internal
     */
    setIntArray4(): boolean;
    /**
     * @internal
     */
    setArray(): boolean;
    /**
     * @internal
     */
    setArray2(): boolean;
    /**
     * @internal
     */
    setArray3(): boolean;
    /**
     * @internal
     */
    setArray4(): boolean;
    /**
     * @internal
     */
    setMatrices(): boolean;
    /**
     * @internal
     */
    setMatrix3x3(): boolean;
    /**
     * @internal
     */
    setMatrix2x2(): boolean;
    /**
     * @internal
     */
    setFloat(): boolean;
    /**
     * @internal
     */
    setFloat2(): boolean;
    /**
     * @internal
     */
    setFloat3(): boolean;
    /**
     * @internal
     */
    setFloat4(): boolean;
}
export {};
