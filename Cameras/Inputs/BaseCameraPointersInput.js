import { __decorate } from "../../tslib.es6.js";
import { serialize } from "../../Misc/decorators.js";
import { Tools } from "../../Misc/tools.js";
import { PointerEventTypes } from "../../Events/pointerEvents.js";
/**
 * Base class for Camera Pointer Inputs.
 * See FollowCameraPointersInput in src/Cameras/Inputs/followCameraPointersInput.ts
 * for example usage.
 */
export class BaseCameraPointersInput {
    constructor() {
        this._currentActiveButton = -1;
        /**
         * Defines the buttons associated with the input to handle camera move.
         */
        this.buttons = [0, 1, 2];
    }
    /**
     * Attach the input controls to a specific dom element to get the input from.
     * @param noPreventDefault Defines whether event caught by the controls should call preventdefault() (https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault)
     */
    attachControl(noPreventDefault) {
        // eslint-disable-next-line prefer-rest-params
        noPreventDefault = Tools.BackCompatCameraNoPreventDefault(arguments);
        const engine = this.camera.getEngine();
        const element = engine.getInputElement();
        let previousPinchSquaredDistance = 0;
        let previousMultiTouchPanPosition = null;
        this._pointA = null;
        this._pointB = null;
        this._altKey = false;
        this._ctrlKey = false;
        this._metaKey = false;
        this._shiftKey = false;
        this._buttonsPressed = 0;
        this._pointerInput = (p) => {
            var _a, _b;
            const evt = p.event;
            const isTouch = evt.pointerType === "touch";
            if (engine.isInVRExclusivePointerMode) {
                return;
            }
            if (p.type !== PointerEventTypes.POINTERMOVE && this.buttons.indexOf(evt.button) === -1) {
                return;
            }
            const srcElement = evt.target;
            this._altKey = evt.altKey;
            this._ctrlKey = evt.ctrlKey;
            this._metaKey = evt.metaKey;
            this._shiftKey = evt.shiftKey;
            this._buttonsPressed = evt.buttons;
            if (engine.isPointerLock) {
                const offsetX = evt.movementX;
                const offsetY = evt.movementY;
                this.onTouch(null, offsetX, offsetY);
                this._pointA = null;
                this._pointB = null;
            }
            else if (p.type !== PointerEventTypes.POINTERDOWN && isTouch && ((_a = this._pointA) === null || _a === void 0 ? void 0 : _a.pointerId) !== evt.pointerId && ((_b = this._pointB) === null || _b === void 0 ? void 0 : _b.pointerId) !== evt.pointerId) {
                return; // If we get a non-down event for a touch that we're not tracking, ignore it
            }
            else if (p.type === PointerEventTypes.POINTERDOWN && (this._currentActiveButton === -1 || isTouch)) {
                try {
                    srcElement === null || srcElement === void 0 ? void 0 : srcElement.setPointerCapture(evt.pointerId);
                }
                catch (e) {
                    //Nothing to do with the error. Execution will continue.
                }
                if (this._pointA === null) {
                    this._pointA = {
                        x: evt.clientX,
                        y: evt.clientY,
                        pointerId: evt.pointerId,
                        type: evt.pointerType,
                    };
                }
                else if (this._pointB === null) {
                    this._pointB = {
                        x: evt.clientX,
                        y: evt.clientY,
                        pointerId: evt.pointerId,
                        type: evt.pointerType,
                    };
                }
                else {
                    return; // We are already tracking two pointers so ignore this one
                }
                if (this._currentActiveButton === -1 && !isTouch) {
                    this._currentActiveButton = evt.button;
                }
                this.onButtonDown(evt);
                if (!noPreventDefault) {
                    evt.preventDefault();
                    element && element.focus();
                }
            }
            else if (p.type === PointerEventTypes.POINTERDOUBLETAP) {
                this.onDoubleTap(evt.pointerType);
            }
            else if (p.type === PointerEventTypes.POINTERUP && (this._currentActiveButton === evt.button || isTouch)) {
                try {
                    srcElement === null || srcElement === void 0 ? void 0 : srcElement.releasePointerCapture(evt.pointerId);
                }
                catch (e) {
                    //Nothing to do with the error.
                }
                if (!isTouch) {
                    this._pointB = null; // Mouse and pen are mono pointer
                }
                //would be better to use pointers.remove(evt.pointerId) for multitouch gestures,
                //but emptying completely pointers collection is required to fix a bug on iPhone :
                //when changing orientation while pinching camera,
                //one pointer stay pressed forever if we don't release all pointers
                //will be ok to put back pointers.remove(evt.pointerId); when iPhone bug corrected
                if (engine._badOS) {
                    this._pointA = this._pointB = null;
                }
                else {
                    //only remove the impacted pointer in case of multitouch allowing on most
                    //platforms switching from rotate to zoom and pan seamlessly.
                    if (this._pointB && this._pointA && this._pointA.pointerId == evt.pointerId) {
                        this._pointA = this._pointB;
                        this._pointB = null;
                    }
                    else if (this._pointA && this._pointB && this._pointB.pointerId == evt.pointerId) {
                        this._pointB = null;
                    }
                    else {
                        this._pointA = this._pointB = null;
                    }
                }
                if (previousPinchSquaredDistance !== 0 || previousMultiTouchPanPosition) {
                    // Previous pinch data is populated but a button has been lifted
                    // so pinch has ended.
                    this.onMultiTouch(this._pointA, this._pointB, previousPinchSquaredDistance, 0, // pinchSquaredDistance
                    previousMultiTouchPanPosition, null // multiTouchPanPosition
                    );
                    previousPinchSquaredDistance = 0;
                    previousMultiTouchPanPosition = null;
                }
                this._currentActiveButton = -1;
                this.onButtonUp(evt);
                if (!noPreventDefault) {
                    evt.preventDefault();
                }
            }
            else if (p.type === PointerEventTypes.POINTERMOVE) {
                if (!noPreventDefault) {
                    evt.preventDefault();
                }
                // One button down
                if (this._pointA && this._pointB === null) {
                    const offsetX = evt.clientX - this._pointA.x;
                    const offsetY = evt.clientY - this._pointA.y;
                    this.onTouch(this._pointA, offsetX, offsetY);
                    this._pointA.x = evt.clientX;
                    this._pointA.y = evt.clientY;
                }
                // Two buttons down: pinch
                else if (this._pointA && this._pointB) {
                    const ed = this._pointA.pointerId === evt.pointerId ? this._pointA : this._pointB;
                    ed.x = evt.clientX;
                    ed.y = evt.clientY;
                    const distX = this._pointA.x - this._pointB.x;
                    const distY = this._pointA.y - this._pointB.y;
                    const pinchSquaredDistance = distX * distX + distY * distY;
                    const multiTouchPanPosition = {
                        x: (this._pointA.x + this._pointB.x) / 2,
                        y: (this._pointA.y + this._pointB.y) / 2,
                        pointerId: evt.pointerId,
                        type: p.type,
                    };
                    this.onMultiTouch(this._pointA, this._pointB, previousPinchSquaredDistance, pinchSquaredDistance, previousMultiTouchPanPosition, multiTouchPanPosition);
                    previousMultiTouchPanPosition = multiTouchPanPosition;
                    previousPinchSquaredDistance = pinchSquaredDistance;
                }
            }
        };
        this._observer = this.camera
            .getScene()
            ._inputManager._addCameraPointerObserver(this._pointerInput, PointerEventTypes.POINTERDOWN | PointerEventTypes.POINTERUP | PointerEventTypes.POINTERMOVE | PointerEventTypes.POINTERDOUBLETAP);
        this._onLostFocus = () => {
            this._pointA = this._pointB = null;
            previousPinchSquaredDistance = 0;
            previousMultiTouchPanPosition = null;
            this.onLostFocus();
        };
        this._contextMenuBind = this.onContextMenu.bind(this);
        element && element.addEventListener("contextmenu", this._contextMenuBind, false);
        const hostWindow = this.camera.getScene().getEngine().getHostWindow();
        if (hostWindow) {
            Tools.RegisterTopRootEvents(hostWindow, [{ name: "blur", handler: this._onLostFocus }]);
        }
    }
    /**
     * Detach the current controls from the specified dom element.
     */
    detachControl() {
        if (this._onLostFocus) {
            const hostWindow = this.camera.getScene().getEngine().getHostWindow();
            if (hostWindow) {
                Tools.UnregisterTopRootEvents(hostWindow, [{ name: "blur", handler: this._onLostFocus }]);
            }
        }
        if (this._observer) {
            this.camera.getScene()._inputManager._removeCameraPointerObserver(this._observer);
            this._observer = null;
            if (this._contextMenuBind) {
                const inputElement = this.camera.getScene().getEngine().getInputElement();
                inputElement && inputElement.removeEventListener("contextmenu", this._contextMenuBind);
            }
            this._onLostFocus = null;
        }
        this._altKey = false;
        this._ctrlKey = false;
        this._metaKey = false;
        this._shiftKey = false;
        this._buttonsPressed = 0;
        this._currentActiveButton = -1;
    }
    /**
     * Gets the class name of the current input.
     * @returns the class name
     */
    getClassName() {
        return "BaseCameraPointersInput";
    }
    /**
     * Get the friendly name associated with the input class.
     * @returns the input friendly name
     */
    getSimpleName() {
        return "pointers";
    }
    /**
     * Called on pointer POINTERDOUBLETAP event.
     * Override this method to provide functionality on POINTERDOUBLETAP event.
     * @param type
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onDoubleTap(type) { }
    /**
     * Called on pointer POINTERMOVE event if only a single touch is active.
     * Override this method to provide functionality.
     * @param point
     * @param offsetX
     * @param offsetY
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onTouch(point, offsetX, offsetY) { }
    /**
     * Called on pointer POINTERMOVE event if multiple touches are active.
     * Override this method to provide functionality.
     * @param _pointA
     * @param _pointB
     * @param previousPinchSquaredDistance
     * @param pinchSquaredDistance
     * @param previousMultiTouchPanPosition
     * @param multiTouchPanPosition
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onMultiTouch(_pointA, _pointB, previousPinchSquaredDistance, pinchSquaredDistance, previousMultiTouchPanPosition, multiTouchPanPosition) { }
    /**
     * Called on JS contextmenu event.
     * Override this method to provide functionality.
     * @param evt
     */
    onContextMenu(evt) {
        evt.preventDefault();
    }
    /**
     * Called each time a new POINTERDOWN event occurs. Ie, for each button
     * press.
     * Override this method to provide functionality.
     * @param evt
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onButtonDown(evt) { }
    /**
     * Called each time a new POINTERUP event occurs. Ie, for each button
     * release.
     * Override this method to provide functionality.
     * @param evt
     */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onButtonUp(evt) { }
    /**
     * Called when window becomes inactive.
     * Override this method to provide functionality.
     */
    onLostFocus() { }
}
__decorate([
    serialize()
], BaseCameraPointersInput.prototype, "buttons", void 0);
//# sourceMappingURL=BaseCameraPointersInput.js.map