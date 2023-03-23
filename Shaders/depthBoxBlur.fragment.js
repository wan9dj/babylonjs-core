// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "depthBoxBlurPixelShader";
const shader = `varying vec2 vUV;
void main(void)
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const depthBoxBlurPixelShader = { name, shader };
//# sourceMappingURL=depthBoxBlur.fragment.js.map