
/**
 * This class is a small wrapper around a native buffer that can be read and/or written
 */
export class StorageBuffer {
    /**
     * Creates a new storage buffer instance
     * @param engine The engine the buffer will be created inside
     * @param size The size of the buffer in bytes
     * @param creationFlags flags to use when creating the buffer (see undefined). The BUFFER_CREATIONFLAG_STORAGE flag will be automatically added.
     */
    constructor(engine, size, creationFlags = 3) {
        this._engine = engine;
        this._engine._storageBuffers.push(this);
        this._create(size, creationFlags);
    }
    _create(size, creationFlags) {
        this._bufferSize = size;
        this._creationFlags = creationFlags;
        this._buffer = this._engine.createStorageBuffer(size, creationFlags);
    }
    /** @internal */
    _rebuild() {
        this._create(this._bufferSize, this._creationFlags);
    }
    /**
     * Gets underlying native buffer
     * @returns underlying native buffer
     */
    getBuffer() {
        return this._buffer;
    }
    /**
     * Updates the storage buffer
     * @param data the data used to update the storage buffer
     * @param byteOffset the byte offset of the data (optional)
     * @param byteLength the byte length of the data (optional)
     */
    update(data, byteOffset, byteLength) {
        if (!this._buffer) {
            return;
        }
        this._engine.updateStorageBuffer(this._buffer, data, byteOffset, byteLength);
    }
    /**
     * Reads data from the storage buffer
     * @param offset The offset in the storage buffer to start reading from (default: 0)
     * @param size  The number of bytes to read from the storage buffer (default: capacity of the buffer)
     * @param buffer The buffer to write the data we have read from the storage buffer to (optional)
     * @returns If not undefined, returns the (promise) buffer (as provided by the 4th parameter) filled with the data, else it returns a (promise) Uint8Array with the data read from the storage buffer
     */
    read(offset, size, buffer) {
        return this._engine.readFromStorageBuffer(this._buffer, offset, size, buffer);
    }
    /**
     * Disposes the storage buffer
     */
    dispose() {
        const storageBuffers = this._engine._storageBuffers;
        const index = storageBuffers.indexOf(this);
        if (index !== -1) {
            storageBuffers[index] = storageBuffers[storageBuffers.length - 1];
            storageBuffers.pop();
        }
        this._engine._releaseBuffer(this._buffer);
        this._buffer = null;
    }
}
//# sourceMappingURL=storageBuffer.js.map