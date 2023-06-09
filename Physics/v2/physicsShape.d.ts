import type { TransformNode } from "../../Meshes/transformNode";
import type { BoundingBox } from "../../Culling/boundingBox";
import { ShapeType } from "./IPhysicsEnginePlugin";
import type { PhysicsShapeParameters } from "./IPhysicsEnginePlugin";
import type { PhysicsMaterial } from "./physicsMaterial";
import type { Vector3 } from "../../Maths/math.vector";
import type { Quaternion } from "../../Maths/math.vector";
import type { Mesh } from "../../Meshes/mesh";
import type { Scene } from "../../scene";
/**
 * Options for creating a physics shape
 */
export interface PhysicShapeOptions {
    /**
     * The type of the shape. This can be one of the following: SPHERE, BOX, CAPSULE, CYLINDER, CONVEX_HULL, MESH, HEIGHTFIELD, CONTAINER
     */
    type?: ShapeType;
    /**
     * The parameters of the shape. Varies depending of the shape type.
     */
    parameters?: PhysicsShapeParameters;
    /**
     * Reference to an already existing physics shape in the plugin.
     */
    pluginData?: any;
}
/**
 * PhysicsShape class.
 * This class is useful for creating a physics shape that can be used in a physics engine.
 * A Physic Shape determine how collision are computed. It must be attached to a body.
 */
export declare class PhysicsShape {
    /**
     * V2 Physics plugin private data for single shape
     */
    _pluginData: any;
    /**
     * The V2 plugin used to create and manage this Physics Body
     */
    private _physicsPlugin;
    private _type;
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
    constructor(options: PhysicShapeOptions, scene: Scene);
    /**
     *
     */
    get type(): ShapeType;
    /**
     *
     * @param layer
     */
    setFilterLayer(layer: number): void;
    /**
     *
     * @returns
     */
    getFilterLayer(): number;
    /**
     *
     * @param materialId
     */
    setMaterial(material: PhysicsMaterial): void;
    /**
     *
     * @returns
     */
    getMaterial(): PhysicsMaterial | undefined;
    /**
     *
     * @param density
     */
    setDensity(density: number): void;
    /**
     *
     */
    getDensity(): number;
    /**
     *
     * @param newChild
     * @param childTransform
     */
    addChild(newChild: PhysicsShape, childTransform: TransformNode): void;
    /**
     *
     * @param childIndex
     */
    removeChild(childIndex: number): void;
    /**
     *
     * @returns
     */
    getNumChildren(): number;
    /**
     *
     */
    getBoundingBox(): BoundingBox;
    /**
     *
     */
    dispose(): void;
}
/**
 * Helper object to create a sphere shape
 */
export declare class PhysicsShapeSphere extends PhysicsShape {
    /** @internal */
    /**
     * Constructor for the Sphere Shape
     * @param center local center of the sphere
     * @param radius radius
     * @param scene scene to attach to
     */
    constructor(center: Vector3, radius: number, scene: Scene);
}
/**
 * Helper object to create a capsule shape
 */
export declare class PhysicsShapeCapsule extends PhysicsShape {
    /**
     *
     * @param pointA Starting point that defines the capsule segment
     * @param pointB ending point of that same segment
     * @param radius radius
     * @param scene scene to attach to
     */
    constructor(pointA: Vector3, pointB: Vector3, radius: number, scene: Scene);
}
/**
 * Helper object to create a cylinder shape
 */
export declare class PhysicsShapeCylinder extends PhysicsShape {
    /**
     *
     * @param pointA Starting point that defines the cylinder segment
     * @param pointB ending point of that same segment
     * @param radius radius
     * @param scene scene to attach to
     */
    constructor(pointA: Vector3, pointB: Vector3, radius: number, scene: Scene);
}
/**
 * Helper object to create a box shape
 */
export declare class PhysicsShapeBox extends PhysicsShape {
    /**
     *
     * @param center local center of the sphere
     * @param rotation local orientation
     * @param extents size of the box in each direction
     * @param scene scene to attach to
     */
    constructor(center: Vector3, rotation: Quaternion, extents: Vector3, scene: Scene);
}
/**
 * Helper object to create a convex hull shape
 */
export declare class PhysicsShapeConvexHull extends PhysicsShape {
    /**
     *
     * @param mesh the mesh to be used as topology infos for the convex hull
     * @param scene scene to attach to
     */
    constructor(mesh: Mesh, scene: Scene);
}
/**
 * Helper object to create a mesh shape
 */
export declare class PhysicsShapeMesh extends PhysicsShape {
    /**
     *
     * @param mesh the mesh topology that will be used to create the shape
     * @param scene scene to attach to
     */
    constructor(mesh: Mesh, scene: Scene);
}
/**
 * A shape container holds a variable number of shapes. Use AddChild to append to newly created parent container.
 */
export declare class PhysicsShapeContainer extends PhysicsShape {
    /**
     * Constructor of the Shape container
     * @param scene scene to attach to
     */
    constructor(scene: Scene);
}
