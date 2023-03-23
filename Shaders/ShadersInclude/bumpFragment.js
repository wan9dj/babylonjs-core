// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "bumpFragment";
const shader = `vec2 uvOffset=vec2(0.0,0.0);
#ifdef NORMALXYSCALE
float normalScale=1.0;
float normalScale=vBumpInfos.y;
float normalScale=1.0;
#if defined(TANGENT) && defined(NORMAL)
mat3 TBN=vTBN;
vec2 TBNUV=gl_FrontFacing ? vBumpUV : -vBumpUV;
vec2 TBNUV=gl_FrontFacing ? vDetailUV : -vDetailUV;
#elif defined(ANISOTROPIC)
#if defined(TANGENT) && defined(NORMAL)
mat3 TBN=vTBN;
vec2 TBNUV=gl_FrontFacing ? vMainUV1 : -vMainUV1;
#endif
#ifdef PARALLAX
mat3 invTBN=transposeMat3(TBN);
uvOffset=parallaxOcclusion(invTBN*-viewDirectionW,invTBN*normalW,vBumpUV,vBumpInfos.z);
uvOffset=parallaxOffset(invTBN*viewDirectionW,vBumpInfos.z);
#endif
#ifdef DETAIL
vec4 detailColor=texture2D(detailSampler,vDetailUV+uvOffset);
#ifdef BUMP
#ifdef OBJECTSPACE_NORMALMAP
#define CUSTOM_FRAGMENT_BUMP_FRAGMENT
normalW=normalize(texture2D(bumpSampler,vBumpUV).xyz *2.0-1.0);
normalW=perturbNormal(TBN,texture2D(bumpSampler,vBumpUV+uvOffset).xyz,vBumpInfos.y);
vec3 bumpNormal=texture2D(bumpSampler,vBumpUV+uvOffset).xyz*2.0-1.0;
detailNormal.xy*=vDetailInfos.z;
detailNormal.xy*=vDetailInfos.z;
normalW=perturbNormalBase(TBN,blendedNormal,vBumpInfos.y);
#elif defined(DETAIL)
detailNormal.xy*=vDetailInfos.z;
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const bumpFragment = { name, shader };
//# sourceMappingURL=bumpFragment.js.map