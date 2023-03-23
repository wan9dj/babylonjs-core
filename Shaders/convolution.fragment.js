// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "convolutionPixelShader";
const shader = `varying vec2 vUV;
void main(void)
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const convolutionPixelShader = { name, shader };
//# sourceMappingURL=convolution.fragment.js.map