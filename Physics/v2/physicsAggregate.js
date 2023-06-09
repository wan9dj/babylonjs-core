import { PhysicsBody } from "./physicsBody.js";
import { PhysicsMaterial } from "./physicsMaterial.js";
import { PhysicsShape } from "./physicsShape.js";
import { Logger } from "../../Misc/logger.js";
import { Quaternion, Vector3 } from "../../Maths/math.vector.js";
import { Scalar } from "../../Maths/math.scalar.js";
import { ShapeType } from "./IPhysicsEnginePlugin.js";
/**
 * Helper class to create and interact with a PhysicsAggregate.
 * This is a transition object that works like Physics Plugin V1 Impostors.
 * This helper instanciate all mandatory physics objects to get a body/shape and material.
 * It's less efficient that handling body and shapes independently but for prototyping or
 * a small numbers of physics objects, it's good enough.
 */
export class PhysicsAggregate {
    constructor(
    /**
     * The physics-enabled object used as the physics aggregate
     */
    transformNode, 
    /**
     * The type of the physics aggregate
     */
    type, _options = { mass: 0 }, _scene) {
        var _a;
        this.transformNode = transformNode;
        this.type = type;
        this._options = _options;
        this._scene = _scene;
        //sanity check!
        if (!this.transformNode) {
            Logger.Error("No object was provided. A physics object is obligatory");
            return;
        }
        if (this.transformNode.parent && this._options.mass !== 0) {
            Logger.Warn("A physics impostor has been created for an object which has a parent. Babylon physics currently works in local space so unexpected issues may occur.");
        }
        // Legacy support for old syntax.
        if (!this._scene && transformNode.getScene) {
            this._scene = transformNode.getScene();
        }
        if (!this._scene) {
            return;
        }
        //default options params
        this._options.mass = _options.mass === void 0 ? 0 : _options.mass;
        this._options.friction = _options.friction === void 0 ? 0.2 : _options.friction;
        this._options.restitution = _options.restitution === void 0 ? 0.2 : _options.restitution;
        this.body = new PhysicsBody(transformNode, this._scene);
        this._addSizeOptions();
        this._options.center = (_a = _options.center) !== null && _a !== void 0 ? _a : this.body.getObjectCenterDelta();
        this.shape = new PhysicsShape({ type, parameters: this._options }, this._scene);
        this.material = new PhysicsMaterial(this._options.friction, this._options.restitution, this._scene);
        this.body.setShape(this.shape);
        this.shape.setMaterial(this.material);
        this.body.setMassProperties({ centerOfMass: new Vector3(0, 0, 0), mass: this._options.mass, inertia: new Vector3(1, 1, 1), inertiaOrientation: Quaternion.Identity() });
    }
    _addSizeOptions() {
        var _a, _b, _c;
        const impostorExtents = this.body.getObjectExtents();
        switch (this.type) {
            case ShapeType.SPHERE:
                if (Scalar.WithinEpsilon(impostorExtents.x, impostorExtents.y, 0.0001) && Scalar.WithinEpsilon(impostorExtents.x, impostorExtents.z, 0.0001)) {
                    this._options.radius = this._options.radius ? this._options.radius : impostorExtents.x / 2;
                }
                else {
                    Logger.Warn("Non uniform scaling is unsupported for sphere shapes.");
                }
                break;
            case ShapeType.CAPSULE:
                {
                    const capRadius = impostorExtents.x / 2;
                    this._options.radius = (_a = this._options.radius) !== null && _a !== void 0 ? _a : capRadius;
                    this._options.pointA = (_b = this._options.pointA) !== null && _b !== void 0 ? _b : new Vector3(0, -impostorExtents.y * 0.5 + capRadius, 0);
                    this._options.pointB = (_c = this._options.pointB) !== null && _c !== void 0 ? _c : new Vector3(0, impostorExtents.y * 0.5 - capRadius, 0);
                }
                break;
            case ShapeType.CYLINDER:
                {
                    const capRadius = impostorExtents.x / 2;
                    this._options.radius = this._options.radius ? this._options.radius : capRadius;
                    this._options.pointA = this._options.pointA ? this._options.pointA : new Vector3(0, -impostorExtents.y * 0.5, 0);
                    this._options.pointB = this._options.pointB ? this._options.pointB : new Vector3(0, impostorExtents.y * 0.5, 0);
                }
                break;
            case ShapeType.MESH:
            case ShapeType.CONVEX_HULL:
            case ShapeType.BOX:
                this._options.extents = this._options.extents ? this._options.extents : new Vector3(impostorExtents.x, impostorExtents.y, impostorExtents.z);
                break;
        }
    }
    /**
     * Releases the body, shape and material
     */
    dispose() {
        this.body.dispose();
        this.material.dispose();
        this.shape.dispose();
    }
}
//# sourceMappingURL=physicsAggregate.js.map