// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pbrBlockAnisotropic";
const shader = `#ifdef ANISOTROPIC
struct anisotropicOutParams
vec3 anisotropyMapData;
};
void anisotropicBlock(
in vec3 anisotropyMapData,
in mat3 TBN,
anisotropy*=anisotropyMapData.b;
outParams.anisotropyMapData=anisotropyMapData;
#endif
mat3 anisoTBN=mat3(normalize(TBN[0]),normalize(TBN[1]),normalize(TBN[2]));
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const pbrBlockAnisotropic = { name, shader };
//# sourceMappingURL=pbrBlockAnisotropic.js.map