// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "glowMapMergeVertexShader";
const shader = `attribute vec2 position;
void main(void) {
vUV=position*madd+madd;
}`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const glowMapMergeVertexShader = { name, shader };
//# sourceMappingURL=glowMapMerge.vertex.js.map