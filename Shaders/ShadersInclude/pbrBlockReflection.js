// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pbrBlockReflection";
const shader = `#ifdef REFLECTION
struct reflectionOutParams
vec3 reflectionCoords;
vec2 reflectionCoords;
#ifdef SS_TRANSLUCENCY
#ifdef USESPHERICALFROMREFLECTIONMAP
#if !defined(NORMAL) || !defined(USESPHERICALINVERTEX)
vec3 irradianceVector;
#endif
#endif
};
void createReflectionCoords(
in anisotropicOutParams anisotropicOut,
#ifdef REFLECTIONMAP_3D
out vec3 reflectionCoords
out vec2 reflectionCoords
)
vec3 reflectionVector=computeReflectionCoords(vec4(vPositionW,1.0),anisotropicOut.anisotropicNormal);
vec3 reflectionVector=computeReflectionCoords(vec4(vPositionW,1.0),normalW);
#ifdef REFLECTIONMAP_OPPOSITEZ
reflectionVector.z*=-1.0;
#ifdef REFLECTIONMAP_3D
reflectionCoords=reflectionVector;
reflectionCoords=reflectionVector.xy;
reflectionCoords/=reflectionVector.z;
reflectionCoords.y=1.0-reflectionCoords.y;
}
#define inline
void sampleReflectionTexture(
in float NdotVUnclamped,
#ifdef LINEARSPECULARREFLECTION
in float roughness,
#ifdef REFLECTIONMAP_3D
in samplerCube reflectionSampler,
in sampler2D reflectionSampler,
#ifndef LODBASEDMICROSFURACE
#ifdef REFLECTIONMAP_3D
in samplerCube reflectionSamplerLow,
in sampler2D reflectionSamplerLow,
#endif
#ifdef REALTIME_FILTERING
in vec2 vReflectionFilteringInfo,
out vec4 environmentRadiance
float reflectionLOD=getLodFromAlphaG(vReflectionMicrosurfaceInfos.x,alphaG,NdotVUnclamped);
float reflectionLOD=getLinearLodFromRoughness(vReflectionMicrosurfaceInfos.x,roughness);
float reflectionLOD=getLodFromAlphaG(vReflectionMicrosurfaceInfos.x,alphaG);
#ifdef LODBASEDMICROSFURACE
reflectionLOD=reflectionLOD*vReflectionMicrosurfaceInfos.y+vReflectionMicrosurfaceInfos.z;
float automaticReflectionLOD=UNPACK_LOD(sampleReflection(reflectionSampler,reflectionCoords).a);
float requestedReflectionLOD=reflectionLOD;
#ifdef REALTIME_FILTERING
environmentRadiance=vec4(radiance(alphaG,reflectionSampler,reflectionCoords,vReflectionFilteringInfo),1.0);
environmentRadiance=sampleReflectionLod(reflectionSampler,reflectionCoords,reflectionLOD);
#else
float lodReflectionNormalized=saturate(reflectionLOD/log2(vReflectionMicrosurfaceInfos.x));
#ifdef RGBDREFLECTION
environmentRadiance.rgb=fromRGBD(environmentRadiance);
#ifdef GAMMAREFLECTION
environmentRadiance.rgb=toLinearSpace(environmentRadiance.rgb);
environmentRadiance.rgb*=vReflectionInfos.x;
#define inline
void reflectionBlock(
in anisotropicOutParams anisotropicOut,
#if defined(LODINREFLECTIONALPHA) && !defined(REFLECTIONMAP_SKYBOX)
in float NdotVUnclamped,
#ifdef LINEARSPECULARREFLECTION
in float roughness,
#ifdef REFLECTIONMAP_3D
in samplerCube reflectionSampler,
in sampler2D reflectionSampler,
#if defined(NORMAL) && defined(USESPHERICALINVERTEX)
in vec3 vEnvironmentIrradiance,
#ifdef USESPHERICALFROMREFLECTIONMAP
#if !defined(NORMAL) || !defined(USESPHERICALINVERTEX)
in mat4 reflectionMatrix,
#endif
#ifdef USEIRRADIANCEMAP
#ifdef REFLECTIONMAP_3D
in samplerCube irradianceSampler,
in sampler2D irradianceSampler,
#endif
#ifndef LODBASEDMICROSFURACE
#ifdef REFLECTIONMAP_3D
in samplerCube reflectionSamplerLow,
in sampler2D reflectionSamplerLow,
#endif
#ifdef REALTIME_FILTERING
in vec2 vReflectionFilteringInfo,
out reflectionOutParams outParams
vec3 reflectionCoords=vec3(0.);
vec2 reflectionCoords=vec2(0.);
createReflectionCoords(
anisotropicOut,
reflectionCoords
NdotVUnclamped,
#ifdef LINEARSPECULARREFLECTION
roughness,
#ifdef REFLECTIONMAP_3D
reflectionSampler,
reflectionSampler,
#ifndef LODBASEDMICROSFURACE
reflectionSamplerLow,
#ifdef REALTIME_FILTERING
vReflectionFilteringInfo,
environmentRadiance
#if defined(NORMAL) && defined(USESPHERICALINVERTEX)
environmentIrradiance=vEnvironmentIrradiance;
#ifdef ANISOTROPIC
vec3 irradianceVector=vec3(reflectionMatrix*vec4(anisotropicOut.anisotropicNormal,0)).xyz;
vec3 irradianceVector=vec3(reflectionMatrix*vec4(normalW,0)).xyz;
#ifdef REFLECTIONMAP_OPPOSITEZ
irradianceVector.z*=-1.0;
#ifdef INVERTCUBICMAP
irradianceVector.y*=-1.0;
#if defined(REALTIME_FILTERING)
environmentIrradiance=irradiance(reflectionSampler,irradianceVector,vReflectionFilteringInfo);
environmentIrradiance=computeEnvironmentIrradiance(irradianceVector);
#ifdef SS_TRANSLUCENCY
outParams.irradianceVector=irradianceVector;
#endif
#elif defined(USEIRRADIANCEMAP)
vec4 environmentIrradiance4=sampleReflection(irradianceSampler,reflectionCoords);
environmentIrradiance.rgb=fromRGBD(environmentIrradiance4);
#ifdef GAMMAREFLECTION
environmentIrradiance.rgb=toLinearSpace(environmentIrradiance.rgb);
#endif
environmentIrradiance*=vReflectionColor.rgb;
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const pbrBlockReflection = { name, shader };
//# sourceMappingURL=pbrBlockReflection.js.map