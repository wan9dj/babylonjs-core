// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pointCloudVertexDeclaration";
const shader = `#ifdef POINTSIZE
uniform float pointSize;
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const pointCloudVertexDeclaration = { name, shader };
//# sourceMappingURL=pointCloudVertexDeclaration.js.map