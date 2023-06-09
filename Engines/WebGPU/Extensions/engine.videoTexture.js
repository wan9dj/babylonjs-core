import { WebGPUEngine } from "../../webgpuEngine.js";
function IsExternalTexture(texture) {
    return texture && texture.underlyingResource !== undefined ? true : false;
}
WebGPUEngine.prototype.updateVideoTexture = function (texture, video, invertY) {
    var _a;
    if (!texture || texture._isDisabled) {
        return;
    }
    if (this._videoTextureSupported === undefined) {
        this._videoTextureSupported = true;
    }
    let gpuTextureWrapper = texture._hardwareTexture;
    if (!((_a = texture._hardwareTexture) === null || _a === void 0 ? void 0 : _a.underlyingResource)) {
        gpuTextureWrapper = this._textureHelper.createGPUTextureForInternalTexture(texture);
    }
    if (IsExternalTexture(video)) {
        this._textureHelper.copyVideoToTexture(video, texture, gpuTextureWrapper.format, !invertY);
        if (texture.generateMipMaps) {
            this._generateMipmaps(texture, this._uploadEncoder);
        }
        texture.isReady = true;
    }
    else if (video) {
        this.createImageBitmap(video)
            .then((bitmap) => {
            this._textureHelper.updateTexture(bitmap, texture, texture.width, texture.height, texture.depth, gpuTextureWrapper.format, 0, 0, !invertY, false, 0, 0);
            if (texture.generateMipMaps) {
                this._generateMipmaps(texture, this._uploadEncoder);
            }
            texture.isReady = true;
        })
            .catch(() => {
            // Sometimes createImageBitmap(video) fails with "Failed to execute 'createImageBitmap' on 'Window': The provided element's player has no current data."
            // Just keep going on
            texture.isReady = true;
        });
    }
};
//# sourceMappingURL=engine.videoTexture.js.map