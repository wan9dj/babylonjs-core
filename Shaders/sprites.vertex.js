// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/fogVertexDeclaration.js";
const name = "spritesVertexShader";
const shader = `attribute vec4 position;
#define CUSTOM_VERTEX_DEFINITIONS
void main(void) {
vec3 viewPos=(view*vec4(position.xyz,1.0)).xyz; 
vFogDistance=viewPos;
#define CUSTOM_VERTEX_MAIN_END
}`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const spritesVertexShader = { name, shader };
//# sourceMappingURL=sprites.vertex.js.map