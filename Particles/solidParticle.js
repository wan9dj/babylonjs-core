import { Vector3, TmpVectors, Quaternion, Vector4, Vector2 } from "../Maths/math.vector.js";
import { Color4 } from "../Maths/math.color.js";
import { BoundingInfo } from "../Culling/boundingInfo.js";
import { BoundingSphere } from "../Culling/boundingSphere.js";
import { AbstractMesh } from "../Meshes/abstractMesh.js";
/**
 * Represents one particle of a solid particle system.
 */
export class SolidParticle {
    /**
     * Particle BoundingInfo object
     * @returns a BoundingInfo
     */
    getBoundingInfo() {
        return this._boundingInfo;
    }
    /**
     * Returns true if there is already a bounding info
     */
    get hasBoundingInfo() {
        return this._boundingInfo !== null;
    }
    /**
     * Creates a Solid Particle object.
     * Don't create particles manually, use instead the Solid Particle System internal tools like _addParticle()
     * @param particleIndex (integer) is the particle index in the Solid Particle System pool.
     * @param particleId (integer) is the particle identifier. Unless some particles are removed from the SPS, it's the same value than the particle idx.
     * @param positionIndex (integer) is the starting index of the particle vertices in the SPS "positions" array.
     * @param indiceIndex (integer) is the starting index of the particle indices in the SPS "indices" array.
     * @param model (ModelShape) is a reference to the model shape on what the particle is designed.
     * @param shapeId (integer) is the model shape identifier in the SPS.
     * @param idxInShape (integer) is the index of the particle in the current model (ex: the 10th box of addShape(box, 30))
     * @param sps defines the sps it is associated to
     * @param modelBoundingInfo is the reference to the model BoundingInfo used for intersection computations.
     * @param materialIndex is the particle material identifier (integer) when the MultiMaterials are enabled in the SPS.
     */
    constructor(particleIndex, particleId, positionIndex, indiceIndex, model, shapeId, idxInShape, sps, modelBoundingInfo = null, materialIndex = null) {
        /**
         * particle global index
         */
        this.idx = 0;
        /**
         * particle identifier
         */
        this.id = 0;
        /**
         * The color of the particle
         */
        this.color = new Color4(1.0, 1.0, 1.0, 1.0);
        /**
         * The world space position of the particle.
         */
        this.position = Vector3.Zero();
        /**
         * The world space rotation of the particle. (Not use if rotationQuaternion is set)
         */
        this.rotation = Vector3.Zero();
        /**
         * The scaling of the particle.
         */
        this.scaling = Vector3.One();
        /**
         * The uvs of the particle.
         */
        this.uvs = new Vector4(0.0, 0.0, 1.0, 1.0);
        /**
         * The current speed of the particle.
         */
        this.velocity = Vector3.Zero();
        /**
         * The pivot point in the particle local space.
         */
        this.pivot = Vector3.Zero();
        /**
         * Must the particle be translated from its pivot point in its local space ?
         * In this case, the pivot point is set at the origin of the particle local space and the particle is translated.
         * Default : false
         */
        this.translateFromPivot = false;
        /**
         * Is the particle active or not ?
         */
        this.alive = true;
        /**
         * Is the particle visible or not ?
         */
        this.isVisible = true;
        /**
         * Index of this particle in the global "positions" array (Internal use)
         * @internal
         */
        this._pos = 0;
        /**
         * @internal Index of this particle in the global "indices" array (Internal use)
         */
        this._ind = 0;
        /**
         * ModelShape id of this particle
         */
        this.shapeId = 0;
        /**
         * Index of the particle in its shape id
         */
        this.idxInShape = 0;
        /**
         * @internal Still set as invisible in order to skip useless computations (Internal use)
         */
        this._stillInvisible = false;
        /**
         * @internal Last computed particle rotation matrix
         */
        this._rotationMatrix = [1.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 1.0];
        /**
         * Parent particle Id, if any.
         * Default null.
         */
        this.parentId = null;
        /**
         * The particle material identifier (integer) when MultiMaterials are enabled in the SPS.
         */
        this.materialIndex = null;
        /**
         * Custom object or properties.
         */
        this.props = null;
        /**
         * The culling strategy to use to check whether the solid particle must be culled or not when using isInFrustum().
         * The possible values are :
         * - AbstractMesh.CULLINGSTRATEGY_STANDARD
         * - AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY
         * - AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION
         * - AbstractMesh.CULLINGSTRATEGY_OPTIMISTIC_INCLUSION_THEN_BSPHERE_ONLY
         * The default value for solid particles is AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY
         * Please read each static variable documentation in the class AbstractMesh to get details about the culling process.
         * */
        this.cullingStrategy = AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY;
        /**
         * @internal Internal global position in the SPS.
         */
        this._globalPosition = Vector3.Zero();
        this.idx = particleIndex;
        this.id = particleId;
        this._pos = positionIndex;
        this._ind = indiceIndex;
        this._model = model;
        this.shapeId = shapeId;
        this.idxInShape = idxInShape;
        this._sps = sps;
        if (modelBoundingInfo) {
            this._modelBoundingInfo = modelBoundingInfo;
            this._boundingInfo = new BoundingInfo(modelBoundingInfo.minimum, modelBoundingInfo.maximum);
        }
        if (materialIndex !== null) {
            this.materialIndex = materialIndex;
        }
    }
    /**
     * Copies the particle property values into the existing target : position, rotation, scaling, uvs, colors, pivot, parent, visibility, alive
     * @param target the particle target
     * @returns the current particle
     */
    copyToRef(target) {
        target.position.copyFrom(this.position);
        target.rotation.copyFrom(this.rotation);
        if (this.rotationQuaternion) {
            if (target.rotationQuaternion) {
                target.rotationQuaternion.copyFrom(this.rotationQuaternion);
            }
            else {
                target.rotationQuaternion = this.rotationQuaternion.clone();
            }
        }
        target.scaling.copyFrom(this.scaling);
        if (this.color) {
            if (target.color) {
                target.color.copyFrom(this.color);
            }
            else {
                target.color = this.color.clone();
            }
        }
        target.uvs.copyFrom(this.uvs);
        target.velocity.copyFrom(this.velocity);
        target.pivot.copyFrom(this.pivot);
        target.translateFromPivot = this.translateFromPivot;
        target.alive = this.alive;
        target.isVisible = this.isVisible;
        target.parentId = this.parentId;
        target.cullingStrategy = this.cullingStrategy;
        if (this.materialIndex !== null) {
            target.materialIndex = this.materialIndex;
        }
        return this;
    }
    /**
     * Legacy support, changed scale to scaling
     */
    get scale() {
        return this.scaling;
    }
    /**
     * Legacy support, changed scale to scaling
     */
    set scale(scale) {
        this.scaling = scale;
    }
    /**
     * Legacy support, changed quaternion to rotationQuaternion
     */
    get quaternion() {
        return this.rotationQuaternion;
    }
    /**
     * Legacy support, changed quaternion to rotationQuaternion
     */
    set quaternion(q) {
        this.rotationQuaternion = q;
    }
    /**
     * Returns a boolean. True if the particle intersects another particle or another mesh, else false.
     * The intersection is computed on the particle bounding sphere and Axis Aligned Bounding Box (AABB)
     * @param target is the object (solid particle or mesh) what the intersection is computed against.
     * @returns true if it intersects
     */
    intersectsMesh(target) {
        if (!this._boundingInfo || !target.hasBoundingInfo) {
            return false;
        }
        if (this._sps._bSphereOnly) {
            return BoundingSphere.Intersects(this._boundingInfo.boundingSphere, target.getBoundingInfo().boundingSphere);
        }
        return this._boundingInfo.intersects(target.getBoundingInfo(), false);
    }
    /**
     * Returns `true` if the solid particle is within the frustum defined by the passed array of planes.
     * A particle is in the frustum if its bounding box intersects the frustum
     * @param frustumPlanes defines the frustum to test
     * @returns true if the particle is in the frustum planes
     */
    isInFrustum(frustumPlanes) {
        return this._boundingInfo !== null && this._boundingInfo.isInFrustum(frustumPlanes, this.cullingStrategy);
    }
    /**
     * get the rotation matrix of the particle
     * @internal
     */
    getRotationMatrix(m) {
        let quaternion;
        if (this.rotationQuaternion) {
            quaternion = this.rotationQuaternion;
        }
        else {
            quaternion = TmpVectors.Quaternion[0];
            const rotation = this.rotation;
            Quaternion.RotationYawPitchRollToRef(rotation.y, rotation.x, rotation.z, quaternion);
        }
        quaternion.toRotationMatrix(m);
    }
}
/**
 * Represents the shape of the model used by one particle of a solid particle system.
 * SPS internal tool, don't use it manually.
 */
export class ModelShape {
    /**
     * Get or set the shapeId
     * @deprecated Please use shapeId instead
     */
    get shapeID() {
        return this.shapeId;
    }
    set shapeID(shapeID) {
        this.shapeId = shapeID;
    }
    /**
     * Creates a ModelShape object. This is an internal simplified reference to a mesh used as for a model to replicate particles from by the SPS.
     * SPS internal tool, don't use it manually.
     * @internal
     */
    constructor(id, shape, indices, normals, colors, shapeUV, posFunction, vtxFunction, material) {
        /**
         * length of the shape in the model indices array (internal use)
         * @internal
         */
        this._indicesLength = 0;
        this.shapeId = id;
        this._shape = shape;
        this._indices = indices;
        this._indicesLength = indices.length;
        this._shapeUV = shapeUV;
        this._shapeColors = colors;
        this._normals = normals;
        this._positionFunction = posFunction;
        this._vertexFunction = vtxFunction;
        this._material = material;
    }
}
/**
 * Represents a Depth Sorted Particle in the solid particle system.
 * @internal
 */
export class DepthSortedParticle {
    /**
     * Creates a new sorted particle
     * @param idx
     * @param ind
     * @param indLength
     * @param materialIndex
     */
    constructor(idx, ind, indLength, materialIndex) {
        /**
         * Particle index
         */
        this.idx = 0;
        /**
         * Index of the particle in the "indices" array
         */
        this.ind = 0;
        /**
         * Length of the particle shape in the "indices" array
         */
        this.indicesLength = 0;
        /**
         * Squared distance from the particle to the camera
         */
        this.sqDistance = 0.0;
        /**
         * Material index when used with MultiMaterials
         */
        this.materialIndex = 0;
        this.idx = idx;
        this.ind = ind;
        this.indicesLength = indLength;
        this.materialIndex = materialIndex;
    }
}
/**
 * Represents a solid particle vertex
 */
export class SolidParticleVertex {
    /**
     * Creates a new solid particle vertex
     */
    constructor() {
        this.position = Vector3.Zero();
        this.color = new Color4(1.0, 1.0, 1.0, 1.0);
        this.uv = Vector2.Zero();
    }
    // Getters and Setters for back-compatibility
    /** Vertex x coordinate */
    get x() {
        return this.position.x;
    }
    set x(val) {
        this.position.x = val;
    }
    /** Vertex y coordinate */
    get y() {
        return this.position.y;
    }
    set y(val) {
        this.position.y = val;
    }
    /** Vertex z coordinate */
    get z() {
        return this.position.z;
    }
    set z(val) {
        this.position.z = val;
    }
}
//# sourceMappingURL=solidParticle.js.map