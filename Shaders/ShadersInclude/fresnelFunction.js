// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "fresnelFunction";
const shader = `#ifdef FRESNEL
float computeFresnelTerm(vec3 viewDirection,vec3 worldNormal,float bias,float power)
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const fresnelFunction = { name, shader };
//# sourceMappingURL=fresnelFunction.js.map