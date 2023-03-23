// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pbrBlockClearcoat";
const shader = `struct clearcoatOutParams
vec3 finalClearCoatRadianceScaled;
#ifdef CLEARCOAT_TINT
vec3 absorption;
#if defined(ENVIRONMENTBRDF) && defined(MS_BRDF_ENERGY_CONSERVATION)
vec3 energyConservationFactorClearCoat;
#if DEBUGMODE>0
mat3 TBNClearCoat;
};
#define pbr_inline
#define inline
void clearcoatBlock(
in vec4 clearCoatMapRoughnessData,
in vec3 specularEnvironmentR0,
in vec2 clearCoatMapData,
#ifdef CLEARCOAT_TINT
in vec4 vClearCoatTintParams,
in vec4 clearCoatTintMapData,
#endif
#ifdef CLEARCOAT_BUMP
in vec2 vClearCoatBumpInfos,
in mat3 vTBN,
in vec2 vClearCoatTangentSpaceParams,
#ifdef OBJECTSPACE_NORMALMAP
in mat4 normalMatrix,
#endif
#if defined(FORCENORMALFORWARD) && defined(NORMAL)
in vec3 faceNormal,
#ifdef REFLECTION
in vec3 vReflectionMicrosurfaceInfos,
in samplerCube reflectionSampler,
in sampler2D reflectionSampler,
#ifndef LODBASEDMICROSFURACE
#ifdef REFLECTIONMAP_3D
in samplerCube reflectionSamplerLow,
in sampler2D reflectionSamplerLow,
#endif
#ifdef REALTIME_FILTERING
in vec2 vReflectionFilteringInfo,
#endif
#if defined(ENVIRONMENTBRDF) && !defined(REFLECTIONMAP_SKYBOX)
#ifdef RADIANCEOCCLUSION
in float ambientMonochrome,
#endif
#if defined(CLEARCOAT_BUMP) || defined(TWOSIDEDLIGHTING)
in float frontFacingMultiplier,
out clearcoatOutParams outParams
clearCoatIntensity*=clearCoatMapData.x;
clearCoatRoughness*=clearCoatMapData.y;
#if DEBUGMODE>0
outParams.clearCoatMapData=clearCoatMapData;
#endif
#if defined(CLEARCOAT_TEXTURE_ROUGHNESS) && !defined(CLEARCOAT_USE_ROUGHNESS_FROM_MAINTEXTURE)
#ifdef CLEARCOAT_TEXTURE_ROUGHNESS_IDENTICAL
clearCoatRoughness*=clearCoatMapData.y;
clearCoatRoughness*=clearCoatMapRoughnessData.y;
#endif
outParams.clearCoatIntensity=clearCoatIntensity;
vec3 clearCoatColor=vClearCoatTintParams.rgb;
#ifdef CLEARCOAT_TINT_GAMMATEXTURE
clearCoatColor*=toLinearSpace(clearCoatTintMapData.rgb);
clearCoatColor*=clearCoatTintMapData.rgb;
clearCoatThickness*=clearCoatTintMapData.a;
outParams.clearCoatTintMapData=clearCoatTintMapData;
#endif
outParams.clearCoatColor=computeColorAtDistanceInMedia(clearCoatColor,clearCoatColorAtDistance);
#ifdef CLEARCOAT_REMAP_F0
vec3 specularEnvironmentR0Updated=getR0RemappedForClearCoat(specularEnvironmentR0);
vec3 specularEnvironmentR0Updated=specularEnvironmentR0;
outParams.specularEnvironmentR0=mix(specularEnvironmentR0,specularEnvironmentR0Updated,clearCoatIntensity);
#ifdef NORMALXYSCALE
float clearCoatNormalScale=1.0;
float clearCoatNormalScale=vClearCoatBumpInfos.y;
#if defined(TANGENT) && defined(NORMAL)
mat3 TBNClearCoat=vTBN;
vec2 TBNClearCoatUV=vClearCoatBumpUV*frontFacingMultiplier;
#if DEBUGMODE>0
outParams.TBNClearCoat=TBNClearCoat;
#ifdef OBJECTSPACE_NORMALMAP
clearCoatNormalW=normalize(clearCoatBumpMapData.xyz *2.0-1.0);
clearCoatNormalW=perturbNormal(TBNClearCoat,clearCoatBumpMapData.xyz,vClearCoatBumpInfos.y);
#endif
#if defined(FORCENORMALFORWARD) && defined(NORMAL)
clearCoatNormalW*=sign(dot(clearCoatNormalW,faceNormal));
#if defined(TWOSIDEDLIGHTING) && defined(NORMAL)
clearCoatNormalW=clearCoatNormalW*frontFacingMultiplier;
outParams.clearCoatNormalW=clearCoatNormalW;
outParams.clearCoatNdotV=clearCoatNdotV;
#ifdef CLEARCOAT_TINT
vec3 clearCoatVRefract=refract(-viewDirectionW,clearCoatNormalW,vClearCoatRefractionParams.y);
#if defined(ENVIRONMENTBRDF) && (!defined(REFLECTIONMAP_SKYBOX) || defined(MS_BRDF_ENERGY_CONSERVATION))
vec3 environmentClearCoatBrdf=getBRDFLookup(clearCoatNdotV,clearCoatRoughness);
#if defined(REFLECTION)
float clearCoatAlphaG=convertRoughnessToAverageSlope(clearCoatRoughness);
clearCoatAlphaG+=outParams.clearCoatAARoughnessFactors.y;
vec4 environmentClearCoatRadiance=vec4(0.,0.,0.,0.);
clearCoatReflectionVector.z*=-1.0;
#ifdef REFLECTIONMAP_3D
vec3 clearCoatReflectionCoords=clearCoatReflectionVector;
vec2 clearCoatReflectionCoords=clearCoatReflectionVector.xy;
clearCoatReflectionCoords/=clearCoatReflectionVector.z;
clearCoatReflectionCoords.y=1.0-clearCoatReflectionCoords.y;
sampleReflectionTexture(
clearCoatNdotVUnclamped,
#ifdef LINEARSPECULARREFLECTION
clearCoatRoughness,
reflectionSampler,
reflectionSamplerLow,
#ifdef REALTIME_FILTERING
vReflectionFilteringInfo,
environmentClearCoatRadiance
outParams.environmentClearCoatRadiance=environmentClearCoatRadiance;
#if defined(ENVIRONMENTBRDF) && !defined(REFLECTIONMAP_SKYBOX)
vec3 clearCoatEnvironmentReflectance=getReflectanceFromBRDFLookup(vec3(vClearCoatRefractionParams.x),environmentClearCoatBrdf);
#ifdef BUMP
#ifdef REFLECTIONMAP_3D
float clearCoatEho=environmentHorizonOcclusion(-viewDirectionW,clearCoatNormalW,geometricNormalW);
#endif
#endif
#else
vec3 clearCoatEnvironmentReflectance=getReflectanceFromAnalyticalBRDFLookup_Jones(clearCoatNdotV,vec3(1.),vec3(1.),sqrt(1.-clearCoatRoughness));
clearCoatEnvironmentReflectance*=clearCoatIntensity;
outParams.clearCoatEnvironmentReflectance=clearCoatEnvironmentReflectance;
outParams.finalClearCoatRadianceScaled=
#if defined(CLEARCOAT_TINT)
outParams.absorption=computeClearCoatAbsorption(outParams.clearCoatNdotVRefract,outParams.clearCoatNdotVRefract,outParams.clearCoatColor,clearCoatThickness,clearCoatIntensity);
float fresnelIBLClearCoat=fresnelSchlickGGX(clearCoatNdotV,vClearCoatRefractionParams.x,CLEARCOATREFLECTANCE90);
outParams.energyConservationFactorClearCoat=getEnergyConservationFactor(outParams.specularEnvironmentR0,environmentClearCoatBrdf);
}
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const pbrBlockClearcoat = { name, shader };
//# sourceMappingURL=pbrBlockClearcoat.js.map