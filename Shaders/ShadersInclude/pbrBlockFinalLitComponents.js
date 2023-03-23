// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "pbrBlockFinalLitComponents";
const shader = `#if defined(ENVIRONMENTBRDF)
#ifdef MS_BRDF_ENERGY_CONSERVATION
vec3 energyConservationFactor=getEnergyConservationFactor(clearcoatOut.specularEnvironmentR0,environmentBrdf);
#endif
#ifndef METALLICWORKFLOW
#ifdef SPECULAR_GLOSSINESS_ENERGY_CONSERVATION
surfaceAlbedo.rgb=(1.-reflectance)*surfaceAlbedo.rgb;
#endif
#if defined(SHEEN) && defined(SHEEN_ALBEDOSCALING) && defined(ENVIRONMENTBRDF)
surfaceAlbedo.rgb=sheenOut.sheenAlbedoScaling*surfaceAlbedo.rgb;
#ifdef REFLECTION
vec3 finalIrradiance=reflectionOut.environmentIrradiance;
finalIrradiance*=clearcoatOut.conservationFactor;
finalIrradiance*=clearcoatOut.absorption;
#endif
#if defined(SS_REFRACTION)
finalIrradiance*=subSurfaceOut.refractionFactorForIrradiance;
#if defined(SS_TRANSLUCENCY)
finalIrradiance*=(1.0-subSurfaceOut.translucencyIntensity);
finalIrradiance*=surfaceAlbedo.rgb;
#ifdef SPECULARTERM
vec3 finalSpecular=specularBase;
finalSpecularScaled*=energyConservationFactor;
#if defined(SHEEN) && defined(ENVIRONMENTBRDF) && defined(SHEEN_ALBEDOSCALING)
finalSpecularScaled*=sheenOut.sheenAlbedoScaling;
#endif
#ifdef REFLECTION
vec3 finalRadiance=reflectionOut.environmentRadiance.rgb;
finalRadianceScaled*=energyConservationFactor;
#if defined(SHEEN) && defined(ENVIRONMENTBRDF) && defined(SHEEN_ALBEDOSCALING)
finalRadianceScaled*=sheenOut.sheenAlbedoScaling;
#endif
#ifdef SHEEN
vec3 finalSheen=sheenBase*sheenOut.sheenColor;
sheenOut.finalSheenRadianceScaled*=clearcoatOut.conservationFactor;
sheenOut.finalSheenRadianceScaled*=clearcoatOut.absorption;
#endif
#endif
#ifdef CLEARCOAT
vec3 finalClearCoat=clearCoatBase;
finalClearCoatScaled*=clearcoatOut.energyConservationFactorClearCoat;
#ifdef SS_REFRACTION
subSurfaceOut.finalRefraction*=clearcoatOut.conservationFactor;
subSurfaceOut.finalRefraction*=clearcoatOut.absorption;
#endif
#endif
#ifdef ALPHABLEND
float luminanceOverAlpha=0.0;
luminanceOverAlpha+=getLuminance(finalRadianceScaled);
luminanceOverAlpha+=getLuminance(clearcoatOut.finalClearCoatRadianceScaled);
#endif
#if defined(SPECULARTERM) && defined(SPECULAROVERALPHA)
luminanceOverAlpha+=getLuminance(finalSpecularScaled);
#if defined(CLEARCOAT) && defined(CLEARCOATOVERALPHA)
luminanceOverAlpha+=getLuminance(finalClearCoatScaled);
#if defined(RADIANCEOVERALPHA) || defined(SPECULAROVERALPHA) || defined(CLEARCOATOVERALPHA)
alpha=saturate(alpha+luminanceOverAlpha*luminanceOverAlpha);
#endif
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const pbrBlockFinalLitComponents = { name, shader };
//# sourceMappingURL=pbrBlockFinalLitComponents.js.map