// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "logDepthVertex";
const shader = `#ifdef LOGARITHMICDEPTH
vFragmentDepth=1.0+gl_Position.w;
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const logDepthVertex = { name, shader };
//# sourceMappingURL=logDepthVertex.js.map