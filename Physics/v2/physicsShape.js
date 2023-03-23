import { ShapeType } from "./IPhysicsEnginePlugin.js";
/**
 * PhysicsShape class.
 * This class is useful for creating a physics shape that can be used in a physics engine.
 * A Physic Shape determine how collision are computed. It must be attached to a body.
 */
export class PhysicsShape {
    /**
     * Constructs a new physics shape.
     * @param options The options for the physics shape. These are:
     *  * type: The type of the shape. This can be one of the following: SPHERE, BOX, CAPSULE, CYLINDER, CONVEX_HULL, MESH, HEIGHTFIELD, CONTAINER
     *  * parameters: The parameters of the shape.
     *  * pluginData: The plugin data of the shape. This is used if you already have a reference to the object on the plugin side.
     * You need to specify either type or pluginData.
     * @param scene The scene the shape belongs to.
     *
     * This code is useful for creating a new physics shape with the given type, options, and scene.
     * It also checks that the physics engine and plugin version are correct.
     * If not, it throws an error. This ensures that the shape is created with the correct parameters and is compatible with the physics engine.
     */
    constructor(options, scene) {
        var _a;
        /**
         * V2 Physics plugin private data for single shape
         */
        this._pluginData = undefined;
        if (!scene) {
            return;
        }
        const physicsEngine = scene.getPhysicsEngine();
        if (!physicsEngine) {
            throw new Error("No Physics Engine available.");
        }
        if (physicsEngine.getPluginVersion() != 2) {
            throw new Error("Plugin version is incorrect. Expected version 2.");
        }
        const physicsPlugin = physicsEngine.getPhysicsPlugin();
        if (!physicsPlugin) {
            throw new Error("No Physics Plugin available.");
        }
        this._physicsPlugin = physicsPlugin;
        if (options.pluginData !== undefined && options.pluginData !== null) {
            this._pluginData = options.pluginData;
            this._type = this._physicsPlugin.getShapeType(this);
        }
        else if (options.type !== undefined && options.type !== null) {
            this._type = options.type;
            const parameters = (_a = options.parameters) !== null && _a !== void 0 ? _a : {};
            this._physicsPlugin.initShape(this, options.type, parameters);
        }
    }
    /**
     *
     */
    get type() {
        return this._type;
    }
    /**
     *
     * @param layer
     */
    setFilterLayer(layer) {
        this._physicsPlugin.setFilterLayer(this, layer);
    }
    /**
     *
     * @returns
     */
    getFilterLayer() {
        return this._physicsPlugin.getFilterLayer(this);
    }
    /**
     *
     * @param materialId
     */
    setMaterial(material) {
        this._physicsPlugin.setMaterial(this, material);
    }
    /**
     *
     * @returns
     */
    getMaterial() {
        return this._physicsPlugin.getMaterial(this);
    }
    /**
     *
     * @param density
     */
    setDensity(density) {
        this._physicsPlugin.setDensity(this, density);
    }
    /**
     *
     */
    getDensity() {
        return this._physicsPlugin.getDensity(this);
    }
    /**
     *
     * @param newChild
     * @param childTransform
     */
    addChild(newChild, childTransform) {
        this._physicsPlugin.addChild(this, newChild, childTransform);
    }
    /**
     *
     * @param childIndex
     */
    removeChild(childIndex) {
        this._physicsPlugin.removeChild(this, childIndex);
    }
    /**
     *
     * @returns
     */
    getNumChildren() {
        return this._physicsPlugin.getNumChildren(this);
    }
    /**
     *
     */
    getBoundingBox() {
        return this._physicsPlugin.getBoundingBox(this);
    }
    /**
     *
     */
    dispose() {
        this._physicsPlugin.disposeShape(this);
    }
}
/**
 * Helper object to create a sphere shape
 */
export class PhysicsShapeSphere extends PhysicsShape {
    /** @internal */
    /**
     * Constructor for the Sphere Shape
     * @param center local center of the sphere
     * @param radius radius
     * @param scene scene to attach to
     */
    constructor(center, radius, scene) {
        super({ type: ShapeType.SPHERE, parameters: { center: center, radius: radius } }, scene);
    }
}
/**
 * Helper object to create a capsule shape
 */
export class PhysicsShapeCapsule extends PhysicsShape {
    /**
     *
     * @param pointA Starting point that defines the capsule segment
     * @param pointB ending point of that same segment
     * @param radius radius
     * @param scene scene to attach to
     */
    constructor(pointA, pointB, radius, scene) {
        super({ type: ShapeType.CAPSULE, parameters: { pointA: pointA, pointB: pointB, radius: radius } }, scene);
    }
}
/**
 * Helper object to create a cylinder shape
 */
export class PhysicsShapeCylinder extends PhysicsShape {
    /**
     *
     * @param pointA Starting point that defines the cylinder segment
     * @param pointB ending point of that same segment
     * @param radius radius
     * @param scene scene to attach to
     */
    constructor(pointA, pointB, radius, scene) {
        super({ type: ShapeType.CYLINDER, parameters: { pointA: pointA, pointB: pointB, radius: radius } }, scene);
    }
}
/**
 * Helper object to create a box shape
 */
export class PhysicsShapeBox extends PhysicsShape {
    /**
     *
     * @param center local center of the sphere
     * @param rotation local orientation
     * @param extents size of the box in each direction
     * @param scene scene to attach to
     */
    constructor(center, rotation, extents, scene) {
        super({ type: ShapeType.BOX, parameters: { center: center, rotation: rotation, extents: extents } }, scene);
    }
}
/**
 * Helper object to create a convex hull shape
 */
export class PhysicsShapeConvexHull extends PhysicsShape {
    /**
     *
     * @param mesh the mesh to be used as topology infos for the convex hull
     * @param scene scene to attach to
     */
    constructor(mesh, scene) {
        super({ type: ShapeType.CONVEX_HULL, parameters: { mesh: mesh } }, scene);
    }
}
/**
 * Helper object to create a mesh shape
 */
export class PhysicsShapeMesh extends PhysicsShape {
    /**
     *
     * @param mesh the mesh topology that will be used to create the shape
     * @param scene scene to attach to
     */
    constructor(mesh, scene) {
        super({ type: ShapeType.MESH, parameters: { mesh: mesh } }, scene);
    }
}
/**
 * A shape container holds a variable number of shapes. Use AddChild to append to newly created parent container.
 */
export class PhysicsShapeContainer extends PhysicsShape {
    /**
     * Constructor of the Shape container
     * @param scene scene to attach to
     */
    constructor(scene) {
        super({ type: ShapeType.CONTAINER, parameters: {} }, scene);
    }
}
//# sourceMappingURL=physicsShape.js.map