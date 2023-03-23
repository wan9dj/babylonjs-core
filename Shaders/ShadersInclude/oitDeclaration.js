// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "oitDeclaration";
const shader = `#ifdef ORDER_INDEPENDENT_TRANSPARENCY
#extension GL_EXT_draw_buffers : require
layout(location=0) out vec2 depth; 
highp vec4 gl_FragColor;
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const oitDeclaration = { name, shader };
//# sourceMappingURL=oitDeclaration.js.map