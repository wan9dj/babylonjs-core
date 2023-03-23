// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pbrBlockAlphaFresnel";
const shader = `#ifdef ALPHAFRESNEL
#if defined(ALPHATEST) || defined(ALPHABLEND)
struct alphaFresnelOutParams
void alphaFresnelBlock(
float opacity0=opacityPerceptual;
float opacity0=opacityPerceptual*opacityPerceptual;
float opacity90=fresnelGrazingReflectance(opacity0);
if (outParams.alpha<ALPHATESTVALUE)
outParams.alpha=1.0;
#endif
}
#endif
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const pbrBlockAlphaFresnel = { name, shader };
//# sourceMappingURL=pbrBlockAlphaFresnel.js.map