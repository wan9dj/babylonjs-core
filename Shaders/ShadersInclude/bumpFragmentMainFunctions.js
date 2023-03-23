// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "bumpFragmentMainFunctions";
const shader = `#if defined(BUMP) || defined(CLEARCOAT_BUMP) || defined(ANISOTROPIC) || defined(DETAIL)
#if defined(TANGENT) && defined(NORMAL) 
varying mat3 vTBN;
#ifdef OBJECTSPACE_NORMALMAP
uniform mat4 normalMatrix;
mat4 toNormalMatrix(mat4 wMatrix)
mat4 toNormalMatrix(mat4 m)
#endif
vec3 perturbNormalBase(mat3 cotangentFrame,vec3 normal,float scale)
normal=normalize(normal*vec3(scale,scale,1.0));
return normalize(cotangentFrame*normal);
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const bumpFragmentMainFunctions = { name, shader };
//# sourceMappingURL=bumpFragmentMainFunctions.js.map