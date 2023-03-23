// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
import "./decalVertexDeclaration.js";
const name = "pbrVertexDeclaration";
const shader = `uniform mat4 view;
uniform mat4 albedoMatrix;
#ifdef AMBIENT
uniform mat4 ambientMatrix;
#ifdef OPACITY
uniform mat4 opacityMatrix;
#ifdef EMISSIVE
uniform vec2 vEmissiveInfos;
#ifdef LIGHTMAP
uniform vec2 vLightmapInfos;
#ifdef REFLECTIVITY 
uniform vec3 vReflectivityInfos;
#ifdef METALLIC_REFLECTANCE
uniform vec2 vMetallicReflectanceInfos;
#ifdef REFLECTANCE
uniform vec2 vReflectanceInfos;
#ifdef MICROSURFACEMAP
uniform vec2 vMicroSurfaceSamplerInfos;
#ifdef BUMP
uniform vec3 vBumpInfos;
#ifdef POINTSIZE
uniform float pointSize;
#ifdef REFLECTION
uniform vec2 vReflectionInfos;
#ifdef CLEARCOAT
#if defined(CLEARCOAT_TEXTURE) || defined(CLEARCOAT_TEXTURE_ROUGHNESS)
uniform vec4 vClearCoatInfos;
#ifdef CLEARCOAT_TEXTURE
uniform mat4 clearCoatMatrix;
#ifdef CLEARCOAT_TEXTURE_ROUGHNESS
uniform mat4 clearCoatRoughnessMatrix;
#ifdef CLEARCOAT_BUMP
uniform vec2 vClearCoatBumpInfos;
#ifdef CLEARCOAT_TINT_TEXTURE
uniform vec2 vClearCoatTintInfos;
#endif
#ifdef IRIDESCENCE
#if defined(IRIDESCENCE_TEXTURE) || defined(IRIDESCENCE_THICKNESS_TEXTURE)
uniform vec4 vIridescenceInfos;
#ifdef IRIDESCENCE_TEXTURE
uniform mat4 iridescenceMatrix;
#ifdef IRIDESCENCE_THICKNESS_TEXTURE
uniform mat4 iridescenceThicknessMatrix;
#endif
#ifdef ANISOTROPIC
#ifdef ANISOTROPIC_TEXTURE
uniform vec2 vAnisotropyInfos;
#endif
#ifdef SHEEN
#if defined(SHEEN_TEXTURE) || defined(SHEEN_TEXTURE_ROUGHNESS)
uniform vec4 vSheenInfos;
#ifdef SHEEN_TEXTURE
uniform mat4 sheenMatrix;
#ifdef SHEEN_TEXTURE_ROUGHNESS
uniform mat4 sheenRoughnessMatrix;
#endif
#ifdef SUBSURFACE
#ifdef SS_REFRACTION
uniform vec4 vRefractionInfos;
#ifdef SS_THICKNESSANDMASK_TEXTURE
uniform vec2 vThicknessInfos;
#ifdef SS_REFRACTIONINTENSITY_TEXTURE
uniform vec2 vRefractionIntensityInfos;
#ifdef SS_TRANSLUCENCYINTENSITY_TEXTURE
uniform vec2 vTranslucencyIntensityInfos;
#endif
#ifdef NORMAL
#if defined(USESPHERICALFROMREFLECTIONMAP) && defined(USESPHERICALINVERTEX)
#ifdef USESPHERICALFROMREFLECTIONMAP
#ifdef SPHERICAL_HARMONICS
uniform vec3 vSphericalL00;
uniform vec3 vSphericalX;
#endif
#endif
#endif
#ifdef DETAIL
uniform vec4 vDetailInfos;
#include<decalVertexDeclaration>
#define ADDITIONAL_VERTEX_DECLARATION
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const pbrVertexDeclaration = { name, shader };
//# sourceMappingURL=pbrVertexDeclaration.js.map