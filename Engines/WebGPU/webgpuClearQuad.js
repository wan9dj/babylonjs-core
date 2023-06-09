
import { WebGPUCacheRenderPipelineTree } from "./webgpuCacheRenderPipelineTree.js";
import { WebGPUShaderProcessingContext } from "./webgpuShaderProcessingContext.js";
import { renderableTextureFormatToIndex, WebGPUTextureHelper } from "./webgpuTextureHelper.js";
import "../../Shaders/clearQuad.vertex.js";
import "../../Shaders/clearQuad.fragment.js";
/** @internal */
export class WebGPUClearQuad {
    setDepthStencilFormat(format) {
        this._depthTextureFormat = format;
        this._cacheRenderPipeline.setDepthStencilFormat(format);
    }
    setColorFormat(format) {
        this._cacheRenderPipeline.setColorFormat(format);
    }
    setMRTAttachments(attachments, textureArray, textureCount) {
        this._cacheRenderPipeline.setMRT(textureArray, textureCount);
        this._cacheRenderPipeline.setMRTAttachments(attachments);
    }
    constructor(device, engine, emptyVertexBuffer) {
        this._bindGroups = {};
        this._bundleCache = {};
        this._keyTemp = [];
        this._device = device;
        this._engine = engine;
        this._cacheRenderPipeline = new WebGPUCacheRenderPipelineTree(this._device, emptyVertexBuffer, !engine._caps.textureFloatLinearFiltering);
        this._cacheRenderPipeline.setDepthTestEnabled(false);
        this._cacheRenderPipeline.setStencilReadMask(0xff);
        this._effect = engine.createEffect("clearQuad", [], ["color", "depthValue"]);
    }
    clear(renderPass, clearColor, clearDepth, clearStencil, sampleCount = 1) {
        var _a, _b;
        let renderPass2;
        let bundle = null;
        let bundleKey;
        const isRTTPass = !!this._engine._currentRenderTarget;
        if (renderPass) {
            renderPass2 = renderPass;
        }
        else {
            let idx = 0;
            this._keyTemp.length = 0;
            for (let i = 0; i < this._cacheRenderPipeline.colorFormats.length; ++i) {
                this._keyTemp[idx++] = renderableTextureFormatToIndex[(_a = this._cacheRenderPipeline.colorFormats[i]) !== null && _a !== void 0 ? _a : ""];
            }
            const depthStencilFormatIndex = renderableTextureFormatToIndex[(_b = this._depthTextureFormat) !== null && _b !== void 0 ? _b : 0];
            this._keyTemp[idx] =
                (clearColor ? clearColor.r + clearColor.g * 256 + clearColor.b * 256 * 256 + clearColor.a * 256 * 256 * 256 : 0) +
                    (clearDepth ? 2 ** 32 : 0) +
                    (clearStencil ? 2 ** 33 : 0) +
                    (this._engine.useReverseDepthBuffer ? 2 ** 34 : 0) +
                    (isRTTPass ? 2 ** 35 : 0) +
                    (sampleCount > 1 ? 2 ** 36 : 0) +
                    depthStencilFormatIndex * 2 ** 37;
            bundleKey = this._keyTemp.join("_");
            bundle = this._bundleCache[bundleKey];
            if (bundle) {
                return bundle;
            }
            renderPass2 = this._device.createRenderBundleEncoder({
                colorFormats: this._cacheRenderPipeline.colorFormats,
                depthStencilFormat: this._depthTextureFormat,
                sampleCount,
            });
        }
        this._cacheRenderPipeline.setDepthWriteEnabled(!!clearDepth);
        this._cacheRenderPipeline.setStencilEnabled(!!clearStencil && !!this._depthTextureFormat && WebGPUTextureHelper.HasStencilAspect(this._depthTextureFormat));
        this._cacheRenderPipeline.setStencilWriteMask(clearStencil ? 0xff : 0);
        this._cacheRenderPipeline.setStencilCompare(clearStencil ? 519 : 512);
        this._cacheRenderPipeline.setStencilPassOp(clearStencil ? 7681 : 7680);
        this._cacheRenderPipeline.setWriteMask(clearColor ? 0xf : 0);
        const pipeline = this._cacheRenderPipeline.getRenderPipeline(7, this._effect, sampleCount);
        const webgpuPipelineContext = this._effect._pipelineContext;
        if (clearColor) {
            this._effect.setDirectColor4("color", clearColor);
        }
        this._effect.setFloat("depthValue", this._engine.useReverseDepthBuffer ? this._engine._clearReverseDepthValue : this._engine._clearDepthValue);
        webgpuPipelineContext.uniformBuffer.update();
        const bufferInternals = isRTTPass ? this._engine._ubInvertY : this._engine._ubDontInvertY;
        const bufferLeftOver = webgpuPipelineContext.uniformBuffer.getBuffer();
        const key = bufferLeftOver.uniqueId + "-" + bufferInternals.uniqueId;
        let bindGroups = this._bindGroups[key];
        if (!bindGroups) {
            const bindGroupLayouts = webgpuPipelineContext.bindGroupLayouts;
            bindGroups = this._bindGroups[key] = [];
            bindGroups.push(this._device.createBindGroup({
                layout: bindGroupLayouts[0],
                entries: [],
            }));
            if (!WebGPUShaderProcessingContext._SimplifiedKnownBindings) {
                bindGroups.push(this._device.createBindGroup({
                    layout: bindGroupLayouts[1],
                    entries: [],
                }));
            }
            bindGroups.push(this._device.createBindGroup({
                layout: bindGroupLayouts[WebGPUShaderProcessingContext._SimplifiedKnownBindings ? 1 : 2],
                entries: [
                    {
                        binding: 0,
                        resource: {
                            buffer: bufferInternals.underlyingResource,
                            size: bufferInternals.capacity,
                        },
                    },
                    {
                        binding: 1,
                        resource: {
                            buffer: bufferLeftOver.underlyingResource,
                            size: bufferLeftOver.capacity,
                        },
                    },
                ],
            }));
        }
        renderPass2.setPipeline(pipeline);
        for (let i = 0; i < bindGroups.length; ++i) {
            renderPass2.setBindGroup(i, bindGroups[i]);
        }
        renderPass2.draw(4, 1, 0, 0);
        if (!renderPass) {
            bundle = renderPass2.finish();
            this._bundleCache[bundleKey] = bundle;
        }
        return bundle;
    }
}
//# sourceMappingURL=webgpuClearQuad.js.map