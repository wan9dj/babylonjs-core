import type { MassProperties } from "./IPhysicsEnginePlugin";
import type { PhysicsShape } from "./physicsShape";
import { Vector3, Quaternion } from "../../Maths/math.vector";
import type { Scene } from "../../scene";
import type { Nullable } from "../../types.js";
import type { PhysicsConstraint } from "./physicsConstraint";
import type { Bone } from "../../Bones/bone.js";
import type { TransformNode } from "../../Meshes/transformNode.js";
import type { AbstractMesh } from "../../Meshes/abstractMesh.js";
/**
 * PhysicsBody is useful for creating a physics body that can be used in a physics engine. It allows
 * the user to set the mass and velocity of the body, which can then be used to calculate the
 * motion of the body in the physics engine.
 */
export declare class PhysicsBody {
    /**
     * V2 Physics plugin private data for single Transform
     */
    _pluginData: any;
    /**
     * V2 Physics plugin private data for instances
     */
    _pluginDataInstances: Array<any>;
    /**
     * The V2 plugin used to create and manage this Physics Body
     */
    private _physicsPlugin;
    /**
     * The engine used to create and manage this Physics Body
     */
    private _physicsEngine;
    /**
     * The transform node associated with this Physics Body
     */
    transformNode: TransformNode;
    /**
     * Disable pre-step that consists in updating Physics Body from Transform Node Translation/Orientation.
     * True by default for maximum performance.
     */
    disablePreStep: boolean;
    private static _DEFAULT_OBJECT_SIZE;
    private static _IDENTITY_QUATERNION;
    /**
     * Constructs a new physics body for the given node.
     * @param transformNode - The Transform Node to construct the physics body for.
     * @param scene - The scene containing the physics engine.
     *
     * This code is useful for creating a physics body for a given Transform Node in a scene.
     * It checks the version of the physics engine and the physics plugin, and initializes the body accordingly.
     * It also sets the node's rotation quaternion if it is not already set. Finally, it adds the body to the physics engine.
     */
    constructor(transformNode: TransformNode, scene: Scene);
    /**
     * If a physics body is connected to an instanced node, update the number physic instances to match the number of node instances.
     */
    updateBodyInstances(): void;
    /**
     * Sets the shape of the physics body.
     * @param shape - The shape of the physics body.
     *
     * This method is useful for setting the shape of the physics body, which is necessary for the physics engine to accurately simulate the body's behavior.
     * The shape is used to calculate the body's mass, inertia, and other properties.
     */
    setShape(shape: PhysicsShape): void;
    /**
     * Retrieves the physics shape associated with this object.
     *
     * @returns The physics shape associated with this object, or `undefined` if no
     * shape is associated.
     *
     * This method is useful for retrieving the physics shape associated with this object,
     * which can be used to apply physical forces to the object or to detect collisions.
     */
    getShape(): PhysicsShape | undefined;
    /**
     * Sets the filter group of the physics body.
     * @param group - The filter group of the physics body.
     *
     * This method is useful for setting the filter group of the physics body.
     * The filter group is used to determine which bodies should collide with each other.
     * This allows for more control over the physics engine and can be used to create more realistic simulations.
     */
    setFilterGroup(group: number): void;
    /**
     * Gets the filter group of the physics engine.
     *
     * @returns The filter group of the physics engine.
     *
     * This method is useful for getting the filter group of the physics engine,
     * which is used to determine which objects will interact with each other.
     * This is important for creating realistic physics simulations.
     */
    getFilterGroup(): number;
    /**
     * Sets the event mask for the physics engine.
     *
     * @param eventMask - A bitmask that determines which events will be sent to the physics engine.
     *
     * This method is useful for setting the event mask for the physics engine, which determines which events
     * will be sent to the physics engine. This allows the user to control which events the physics engine will respond to.
     */
    setEventMask(eventMask: number): void;
    /**
     * Gets the event mask of the physics engine.
     *
     * @returns The event mask of the physics engine.
     *
     * This method is useful for getting the event mask of the physics engine,
     * which is used to determine which events the engine will respond to.
     * This is important for ensuring that the engine is responding to the correct events and not
     * wasting resources on unnecessary events.
     */
    getEventMask(): number;
    /**
     * Sets the mass properties of the physics object.
     *
     * @param massProps - The mass properties to set.
     *
     * This method is useful for setting the mass properties of a physics object, such as its mass,
     * inertia, and center of mass. This is important for accurately simulating the physics of the object in the physics engine.
     */
    setMassProperties(massProps: MassProperties): void;
    /**
     * Retrieves the mass properties of the object.
     *
     * @returns The mass properties of the object, or `undefined` if the physics
     * plugin does not support mass properties.
     *
     * This method is useful for physics simulations, as it allows the user to
     * retrieve the mass properties of the object, such as its mass, center of mass,
     * and moment of inertia. This information is necessary for accurate physics
     * simulations.
     */
    getMassProperties(): MassProperties | undefined;
    /**
     * Sets the linear damping of the physics body.
     *
     * @param damping - The linear damping value.
     *
     * This method is useful for controlling the linear damping of the physics body,
     * which is the rate at which the body's velocity decreases over time. This is useful for simulating
     * the effects of air resistance or other forms of friction.
     */
    setLinearDamping(damping: number): void;
    /**
     * Gets the linear damping of the physics body.
     * @returns The linear damping of the physics body.
     *
     * This method is useful for retrieving the linear damping of the physics body, which is the amount of
     * resistance the body has to linear motion. This is useful for simulating realistic physics behavior
     * in a game.
     */
    getLinearDamping(): number;
    /**
     * Sets the angular damping of the physics body.
     * @param damping The angular damping of the body.
     *
     * This method is useful for controlling the angular velocity of a physics body.
     * By setting the damping, the body's angular velocity will be reduced over time, simulating the effect of friction.
     * This can be used to create realistic physical behavior in a physics engine.
     */
    setAngularDamping(damping: number): void;
    /**
     * Gets the angular damping of the physics body.
     *
     * @returns The angular damping of the physics body.
     *
     * This method is useful for getting the angular damping of the physics body,
     * which is the rate of reduction of the angular velocity over time.
     * This is important for simulating realistic physics behavior in a game.
     */
    getAngularDamping(): number;
    /**
     * Sets the linear velocity of the physics object.
     * @param linVel - The linear velocity to set.
     *
     * This method is useful for setting the linear velocity of a physics object,
     * which is necessary for simulating realistic physics in a game engine.
     * By setting the linear velocity, the physics object will move in the direction and speed specified by the vector.
     * This allows for realistic physics simulations, such as simulating the motion of a ball rolling down a hill.
     */
    setLinearVelocity(linVel: Vector3): void;
    /**
     * Gets the linear velocity of the physics body and stores it in the given vector3.
     * @param linVel - The vector3 to store the linear velocity in.
     *
     * This method is useful for getting the linear velocity of a physics body in a physics engine.
     * This can be used to determine the speed and direction of the body, which can be used to calculate the motion of the body.*/
    getLinearVelocityToRef(linVel: Vector3): void;
    /**
     * Sets the angular velocity of the physics object.
     * @param angVel - The angular velocity to set.
     *
     * This method is useful for setting the angular velocity of a physics object, which is necessary for
     * simulating realistic physics behavior. The angular velocity is used to determine the rate of rotation of the object,
     * which is important for simulating realistic motion.
     */
    setAngularVelocity(angVel: Vector3): void;
    /**
     * Gets the angular velocity of the physics body and stores it in the given vector3.
     * @param angVel - The vector3 to store the angular velocity in.
     *
     * This method is useful for getting the angular velocity of a physics body, which can be used to determine the body's
     * rotational speed. This information can be used to create realistic physics simulations.
     */
    getAngularVelocityToRef(angVel: Vector3): void;
    /**
     * Applies an impulse to the physics object.
     *
     * @param impulse The impulse vector.
     * @param location The location of the impulse.
     *
     * This method is useful for applying an impulse to a physics object, which can be used to simulate physical forces such as gravity,
     * collisions, and explosions. This can be used to create realistic physics simulations in a game or other application.
     */
    applyImpulse(impulse: Vector3, location: Vector3): void;
    /**
     * Applies a force to the physics object.
     *
     * @param force The force vector.
     * @param location The location of the force.
     *
     * This method is useful for applying a force to a physics object, which can be used to simulate physical forces such as gravity,
     * collisions, and explosions. This can be used to create realistic physics simulations in a game or other application.
     */
    applyForce(force: Vector3, location: Vector3): void;
    /**
     * Retrieves the geometry of the body from the physics plugin.
     *
     * @returns The geometry of the body.
     *
     * This method is useful for retrieving the geometry of the body from the physics plugin, which can be used for various physics calculations.
     */
    getGeometry(): {};
    /**
     * Register a collision callback that is called when the body collides
     * Filtering by body is inefficient. It's more preferable to register a collision callback for the entire world
     * and do the filtering on the user side.
     */
    registerOnCollide(func: (collider: PhysicsBody, collidedAgainst: PhysicsBody, point: Nullable<Vector3>) => void): void;
    /**
     * Unregister a collision callback that is called when the body collides
     */
    unregisterOnCollide(func: (collider: PhysicsBody, collidedAgainst: PhysicsBody, point: Nullable<Vector3>) => void): void;
    /**
     * Enable or disable collision callback for this PhysicsBody.
     * `registerOnCollide` method will enable collision callback and `unregisterOnCollide` will disable them.
     * Registering a collision callback on the plugin and enabling collision per body is faster than
     * registering callback per PhysicsBody.
     * @param enabled true if PhysicsBody's collision will rise a collision event and call the callback
     */
    setCollisionCallbackEnabled(enabled: boolean): void;
    /**
     * Gets the object extents
     * @returns the object extents
     */
    getObjectExtents(): Vector3;
    /**
     * returns the delta between the object bounding box center and the mesh origin
     * @returns delta between object bounding box center and origin
     */
    getObjectCenterDelta(): Vector3;
    /**
     * @returns geometric center of the associated mesh
     */
    getObjectCenter(): Vector3;
    /**
     * Adds a constraint to the physics engine.
     *
     * @param childBody - The body to which the constraint will be applied.
     * @param constraint - The constraint to be applied.
     *
     */
    addConstraint(childBody: PhysicsBody, constraint: PhysicsConstraint): void;
    /**
     * Sync with a bone
     * @param bone The bone that the impostor will be synced to.
     * @param boneMesh The mesh that the bone is influencing.
     * @param jointPivot The pivot of the joint / bone in local space.
     * @param distToJoint Optional distance from the impostor to the joint.
     * @param adjustRotation Optional quaternion for adjusting the local rotation of the bone.
     * @param boneAxis Optional vector3 axis the bone is aligned with
     */
    syncWithBone(bone: Bone, boneMesh: AbstractMesh, jointPivot: Vector3, distToJoint?: number, adjustRotation?: Quaternion, boneAxis?: Vector3): void;
    /**
     * Disposes the body from the physics engine.
     *
     * This method is useful for cleaning up the physics engine when a body is no longer needed. Disposing the body will free up resources and prevent memory leaks.
     */
    dispose(): void;
}
