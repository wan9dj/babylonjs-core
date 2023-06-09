import type { Scene } from "../../scene";
import type { AbstractMesh } from "../../Meshes/abstractMesh";
import { WebVRController } from "./webVRController";
import type { ExtendedGamepadButton } from "./poseEnabledController";
/**
 * Google Daydream controller
 */
export declare class DaydreamController extends WebVRController {
    /**
     * Base Url for the controller model.
     */
    static MODEL_BASE_URL: string;
    /**
     * File name for the controller model.
     */
    static MODEL_FILENAME: string;
    /**
     * Gamepad Id prefix used to identify Daydream Controller.
     */
    static readonly GAMEPAD_ID_PREFIX: string;
    /**
     * Creates a new DaydreamController from a gamepad
     * @param vrGamepad the gamepad that the controller should be created from
     */
    constructor(vrGamepad: any);
    /**
     * Implements abstract method on WebVRController class, loading controller meshes and calling this.attachToMesh if successful.
     * @param scene scene in which to add meshes
     * @param meshLoaded optional callback function that will be called if the mesh loads successfully.
     */
    initControllerMesh(scene: Scene, meshLoaded?: (mesh: AbstractMesh) => void): void;
    /**
     * Called once for each button that changed state since the last frame
     * @param buttonIdx Which button index changed
     * @param state New state of the button
     */
    protected _handleButtonChange(buttonIdx: number, state: ExtendedGamepadButton): void;
}
