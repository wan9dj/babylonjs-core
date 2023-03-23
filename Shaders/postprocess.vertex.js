// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "postprocessVertexShader";
const shader = `attribute vec2 position;
void main(void) {
vUV=(position*madd+madd)*scale;
}`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const postprocessVertexShader = { name, shader };
//# sourceMappingURL=postprocess.vertex.js.map