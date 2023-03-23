// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "proceduralVertexShader";
const shader = `attribute vec2 position;
void main(void) {
vPosition=position;
}`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const proceduralVertexShader = { name, shader };
//# sourceMappingURL=procedural.vertex.js.map