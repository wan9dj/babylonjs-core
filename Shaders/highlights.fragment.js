// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "highlightsPixelShader";
const shader = `varying vec2 vUV;
void main(void) 
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const highlightsPixelShader = { name, shader };
//# sourceMappingURL=highlights.fragment.js.map