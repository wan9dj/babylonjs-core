import { Mesh } from "../Meshes/mesh.js";
import { VertexBuffer, Buffer } from "../Buffers/buffer.js";
import { Matrix, Vector3, TmpVectors } from "../Maths/math.vector.js";
import { Logger } from "../Misc/logger.js";
Mesh.prototype.thinInstanceAdd = function (matrix, refresh = true) {
    if (!this.getScene().getEngine().getCaps().instancedArrays) {
        Logger.Error("Thin Instances are not supported on this device as Instanced Array extension not supported");
        return -1;
    }
    this._thinInstanceUpdateBufferSize("matrix", Array.isArray(matrix) ? matrix.length : 1);
    const index = this._thinInstanceDataStorage.instancesCount;
    if (Array.isArray(matrix)) {
        for (let i = 0; i < matrix.length; ++i) {
            this.thinInstanceSetMatrixAt(this._thinInstanceDataStorage.instancesCount++, matrix[i], i === matrix.length - 1 && refresh);
        }
    }
    else {
        this.thinInstanceSetMatrixAt(this._thinInstanceDataStorage.instancesCount++, matrix, refresh);
    }
    return index;
};
Mesh.prototype.thinInstanceAddSelf = function (refresh = true) {
    return this.thinInstanceAdd(Matrix.IdentityReadOnly, refresh);
};
Mesh.prototype.thinInstanceRegisterAttribute = function (kind, stride) {
    // preserve backward compatibility
    if (kind === VertexBuffer.ColorKind) {
        kind = VertexBuffer.ColorInstanceKind;
    }
    this.removeVerticesData(kind);
    this._thinInstanceInitializeUserStorage();
    this._userThinInstanceBuffersStorage.strides[kind] = stride;
    this._userThinInstanceBuffersStorage.sizes[kind] = stride * Math.max(32, this._thinInstanceDataStorage.instancesCount); // Initial size
    this._userThinInstanceBuffersStorage.data[kind] = new Float32Array(this._userThinInstanceBuffersStorage.sizes[kind]);
    this._userThinInstanceBuffersStorage.vertexBuffers[kind] = new VertexBuffer(this.getEngine(), this._userThinInstanceBuffersStorage.data[kind], kind, true, false, stride, true);
    this.setVerticesBuffer(this._userThinInstanceBuffersStorage.vertexBuffers[kind]);
};
Mesh.prototype.thinInstanceSetMatrixAt = function (index, matrix, refresh = true) {
    if (!this._thinInstanceDataStorage.matrixData || index >= this._thinInstanceDataStorage.instancesCount) {
        return false;
    }
    const matrixData = this._thinInstanceDataStorage.matrixData;
    matrix.copyToArray(matrixData, index * 16);
    if (this._thinInstanceDataStorage.worldMatrices) {
        this._thinInstanceDataStorage.worldMatrices[index] = matrix;
    }
    if (refresh) {
        this.thinInstanceBufferUpdated("matrix");
        if (!this.doNotSyncBoundingInfo) {
            this.thinInstanceRefreshBoundingInfo(false);
        }
    }
    return true;
};
Mesh.prototype.thinInstanceSetAttributeAt = function (kind, index, value, refresh = true) {
    // preserve backward compatibility
    if (kind === VertexBuffer.ColorKind) {
        kind = VertexBuffer.ColorInstanceKind;
    }
    if (!this._userThinInstanceBuffersStorage || !this._userThinInstanceBuffersStorage.data[kind] || index >= this._thinInstanceDataStorage.instancesCount) {
        return false;
    }
    this._thinInstanceUpdateBufferSize(kind, 0); // make sur the buffer for the kind attribute is big enough
    this._userThinInstanceBuffersStorage.data[kind].set(value, index * this._userThinInstanceBuffersStorage.strides[kind]);
    if (refresh) {
        this.thinInstanceBufferUpdated(kind);
    }
    return true;
};
Object.defineProperty(Mesh.prototype, "thinInstanceCount", {
    get: function () {
        return this._thinInstanceDataStorage.instancesCount;
    },
    set: function (value) {
        var _a, _b;
        const matrixData = (_a = this._thinInstanceDataStorage.matrixData) !== null && _a !== void 0 ? _a : (_b = this.source) === null || _b === void 0 ? void 0 : _b._thinInstanceDataStorage.matrixData;
        const numMaxInstances = matrixData ? matrixData.length / 16 : 0;
        if (value <= numMaxInstances) {
            this._thinInstanceDataStorage.instancesCount = value;
        }
    },
    enumerable: true,
    configurable: true,
});
Mesh.prototype._thinInstanceCreateMatrixBuffer = function (kind, buffer, staticBuffer = false) {
    // preserve backward compatibility
    if (kind === VertexBuffer.ColorKind) {
        kind = VertexBuffer.ColorInstanceKind;
    }
    const matrixBuffer = new Buffer(this.getEngine(), buffer, !staticBuffer, 16, false, true);
    for (let i = 0; i < 4; i++) {
        this.setVerticesBuffer(matrixBuffer.createVertexBuffer(kind + i, i * 4, 4));
    }
    return matrixBuffer;
};
Mesh.prototype.thinInstanceSetBuffer = function (kind, buffer, stride = 0, staticBuffer = false) {
    var _a, _b, _c;
    stride = stride || 16;
    if (kind === "matrix") {
        (_a = this._thinInstanceDataStorage.matrixBuffer) === null || _a === void 0 ? void 0 : _a.dispose();
        this._thinInstanceDataStorage.matrixBuffer = null;
        this._thinInstanceDataStorage.matrixBufferSize = buffer ? buffer.length : 32 * stride;
        this._thinInstanceDataStorage.matrixData = buffer;
        this._thinInstanceDataStorage.worldMatrices = null;
        if (buffer !== null) {
            this._thinInstanceDataStorage.instancesCount = buffer.length / stride;
            this._thinInstanceDataStorage.matrixBuffer = this._thinInstanceCreateMatrixBuffer("world", buffer, staticBuffer);
            if (!this.doNotSyncBoundingInfo) {
                this.thinInstanceRefreshBoundingInfo(false);
            }
        }
        else {
            this._thinInstanceDataStorage.instancesCount = 0;
            if (!this.doNotSyncBoundingInfo) {
                // mesh has no more thin instances, so need to recompute the bounding box because it's the regular mesh that will now be displayed
                this.refreshBoundingInfo();
            }
        }
    }
    else if (kind === "previousMatrix") {
        (_b = this._thinInstanceDataStorage.previousMatrixBuffer) === null || _b === void 0 ? void 0 : _b.dispose();
        this._thinInstanceDataStorage.previousMatrixBuffer = null;
        this._thinInstanceDataStorage.previousMatrixData = buffer;
        if (buffer !== null) {
            this._thinInstanceDataStorage.previousMatrixBuffer = this._thinInstanceCreateMatrixBuffer("previousWorld", buffer, staticBuffer);
        }
    }
    else {
        // color for instanced mesh is ColorInstanceKind and not ColorKind because of native that needs to do the differenciation
        // hot switching kind here to preserve backward compatibility
        if (kind === VertexBuffer.ColorKind) {
            kind = VertexBuffer.ColorInstanceKind;
        }
        if (buffer === null) {
            if ((_c = this._userThinInstanceBuffersStorage) === null || _c === void 0 ? void 0 : _c.data[kind]) {
                this.removeVerticesData(kind);
                delete this._userThinInstanceBuffersStorage.data[kind];
                delete this._userThinInstanceBuffersStorage.strides[kind];
                delete this._userThinInstanceBuffersStorage.sizes[kind];
                delete this._userThinInstanceBuffersStorage.vertexBuffers[kind];
            }
        }
        else {
            this._thinInstanceInitializeUserStorage();
            this._userThinInstanceBuffersStorage.data[kind] = buffer;
            this._userThinInstanceBuffersStorage.strides[kind] = stride;
            this._userThinInstanceBuffersStorage.sizes[kind] = buffer.length;
            this._userThinInstanceBuffersStorage.vertexBuffers[kind] = new VertexBuffer(this.getEngine(), buffer, kind, !staticBuffer, false, stride, true);
            this.setVerticesBuffer(this._userThinInstanceBuffersStorage.vertexBuffers[kind]);
        }
    }
};
Mesh.prototype.thinInstanceBufferUpdated = function (kind) {
    var _a, _b, _c;
    if (kind === "matrix") {
        (_a = this._thinInstanceDataStorage.matrixBuffer) === null || _a === void 0 ? void 0 : _a.updateDirectly(this._thinInstanceDataStorage.matrixData, 0, this._thinInstanceDataStorage.instancesCount);
    }
    else if (kind === "previousMatrix") {
        (_b = this._thinInstanceDataStorage.previousMatrixBuffer) === null || _b === void 0 ? void 0 : _b.updateDirectly(this._thinInstanceDataStorage.previousMatrixData, 0, this._thinInstanceDataStorage.instancesCount);
    }
    else {
        // preserve backward compatibility
        if (kind === VertexBuffer.ColorKind) {
            kind = VertexBuffer.ColorInstanceKind;
        }
        if ((_c = this._userThinInstanceBuffersStorage) === null || _c === void 0 ? void 0 : _c.vertexBuffers[kind]) {
            this._userThinInstanceBuffersStorage.vertexBuffers[kind].updateDirectly(this._userThinInstanceBuffersStorage.data[kind], 0);
        }
    }
};
Mesh.prototype.thinInstancePartialBufferUpdate = function (kind, data, offset) {
    var _a;
    if (kind === "matrix") {
        if (this._thinInstanceDataStorage.matrixBuffer) {
            this._thinInstanceDataStorage.matrixBuffer.updateDirectly(data, offset);
        }
    }
    else {
        // preserve backward compatibility
        if (kind === VertexBuffer.ColorKind) {
            kind = VertexBuffer.ColorInstanceKind;
        }
        if ((_a = this._userThinInstanceBuffersStorage) === null || _a === void 0 ? void 0 : _a.vertexBuffers[kind]) {
            this._userThinInstanceBuffersStorage.vertexBuffers[kind].updateDirectly(data, offset);
        }
    }
};
Mesh.prototype.thinInstanceGetWorldMatrices = function () {
    if (!this._thinInstanceDataStorage.matrixData || !this._thinInstanceDataStorage.matrixBuffer) {
        return [];
    }
    const matrixData = this._thinInstanceDataStorage.matrixData;
    if (!this._thinInstanceDataStorage.worldMatrices) {
        this._thinInstanceDataStorage.worldMatrices = new Array();
        for (let i = 0; i < this._thinInstanceDataStorage.instancesCount; ++i) {
            this._thinInstanceDataStorage.worldMatrices[i] = Matrix.FromArray(matrixData, i * 16);
        }
    }
    return this._thinInstanceDataStorage.worldMatrices;
};
Mesh.prototype.thinInstanceRefreshBoundingInfo = function (forceRefreshParentInfo = false, applySkeleton = false, applyMorph = false) {
    if (!this._thinInstanceDataStorage.matrixData || !this._thinInstanceDataStorage.matrixBuffer) {
        return;
    }
    const vectors = this._thinInstanceDataStorage.boundingVectors;
    if (forceRefreshParentInfo) {
        vectors.length = 0;
        this.refreshBoundingInfo(applySkeleton, applyMorph);
    }
    const boundingInfo = this.getBoundingInfo();
    const matrixData = this._thinInstanceDataStorage.matrixData;
    if (vectors.length === 0) {
        for (let v = 0; v < boundingInfo.boundingBox.vectors.length; ++v) {
            vectors.push(boundingInfo.boundingBox.vectors[v].clone());
        }
    }
    TmpVectors.Vector3[0].setAll(Number.POSITIVE_INFINITY); // min
    TmpVectors.Vector3[1].setAll(Number.NEGATIVE_INFINITY); // max
    for (let i = 0; i < this._thinInstanceDataStorage.instancesCount; ++i) {
        Matrix.FromArrayToRef(matrixData, i * 16, TmpVectors.Matrix[0]);
        for (let v = 0; v < vectors.length; ++v) {
            Vector3.TransformCoordinatesToRef(vectors[v], TmpVectors.Matrix[0], TmpVectors.Vector3[2]);
            TmpVectors.Vector3[0].minimizeInPlace(TmpVectors.Vector3[2]);
            TmpVectors.Vector3[1].maximizeInPlace(TmpVectors.Vector3[2]);
        }
    }
    boundingInfo.reConstruct(TmpVectors.Vector3[0], TmpVectors.Vector3[1]);
    this._updateBoundingInfo();
};
Mesh.prototype._thinInstanceUpdateBufferSize = function (kind, numInstances = 1) {
    var _a, _b, _c;
    // preserve backward compatibility
    if (kind === VertexBuffer.ColorKind) {
        kind = VertexBuffer.ColorInstanceKind;
    }
    const kindIsMatrix = kind === "matrix";
    if (!kindIsMatrix && (!this._userThinInstanceBuffersStorage || !this._userThinInstanceBuffersStorage.strides[kind])) {
        return;
    }
    const stride = kindIsMatrix ? 16 : this._userThinInstanceBuffersStorage.strides[kind];
    const currentSize = kindIsMatrix ? this._thinInstanceDataStorage.matrixBufferSize : this._userThinInstanceBuffersStorage.sizes[kind];
    let data = kindIsMatrix ? this._thinInstanceDataStorage.matrixData : this._userThinInstanceBuffersStorage.data[kind];
    const bufferSize = (this._thinInstanceDataStorage.instancesCount + numInstances) * stride;
    let newSize = currentSize;
    while (newSize < bufferSize) {
        newSize *= 2;
    }
    if (!data || currentSize != newSize) {
        if (!data) {
            data = new Float32Array(newSize);
        }
        else {
            const newData = new Float32Array(newSize);
            newData.set(data, 0);
            data = newData;
        }
        if (kindIsMatrix) {
            (_a = this._thinInstanceDataStorage.matrixBuffer) === null || _a === void 0 ? void 0 : _a.dispose();
            this._thinInstanceDataStorage.matrixBuffer = this._thinInstanceCreateMatrixBuffer("world", data, false);
            this._thinInstanceDataStorage.matrixData = data;
            this._thinInstanceDataStorage.matrixBufferSize = newSize;
            if (this._scene.needsPreviousWorldMatrices && !this._thinInstanceDataStorage.previousMatrixData) {
                (_b = this._thinInstanceDataStorage.previousMatrixBuffer) === null || _b === void 0 ? void 0 : _b.dispose();
                this._thinInstanceDataStorage.previousMatrixBuffer = this._thinInstanceCreateMatrixBuffer("previousWorld", data, false);
            }
        }
        else {
            (_c = this._userThinInstanceBuffersStorage.vertexBuffers[kind]) === null || _c === void 0 ? void 0 : _c.dispose();
            this._userThinInstanceBuffersStorage.data[kind] = data;
            this._userThinInstanceBuffersStorage.sizes[kind] = newSize;
            this._userThinInstanceBuffersStorage.vertexBuffers[kind] = new VertexBuffer(this.getEngine(), data, kind, true, false, stride, true);
            this.setVerticesBuffer(this._userThinInstanceBuffersStorage.vertexBuffers[kind]);
        }
    }
};
Mesh.prototype._thinInstanceInitializeUserStorage = function () {
    if (!this._userThinInstanceBuffersStorage) {
        this._userThinInstanceBuffersStorage = {
            data: {},
            sizes: {},
            vertexBuffers: {},
            strides: {},
        };
    }
};
Mesh.prototype._disposeThinInstanceSpecificData = function () {
    var _a;
    if ((_a = this._thinInstanceDataStorage) === null || _a === void 0 ? void 0 : _a.matrixBuffer) {
        this._thinInstanceDataStorage.matrixBuffer.dispose();
        this._thinInstanceDataStorage.matrixBuffer = null;
    }
};
//# sourceMappingURL=thinInstanceMesh.js.map