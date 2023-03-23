// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "vrDistortionCorrectionPixelShader";
const shader = `varying vec2 vUV;
void main(void)
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const vrDistortionCorrectionPixelShader = { name, shader };
//# sourceMappingURL=vrDistortionCorrection.fragment.js.map