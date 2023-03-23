// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
import "./decalFragmentDeclaration.js";
const name = "defaultFragmentDeclaration";
const shader = `uniform vec4 vEyePosition;
uniform vec4 vSpecularColor;
uniform vec3 vEmissiveColor;
uniform vec2 vDiffuseInfos;
#ifdef AMBIENT
uniform vec2 vAmbientInfos;
#ifdef OPACITY 
uniform vec2 vOpacityInfos;
#ifdef EMISSIVE
uniform vec2 vEmissiveInfos;
#ifdef LIGHTMAP
uniform vec2 vLightmapInfos;
#ifdef BUMP
uniform vec3 vBumpInfos;
#ifdef ALPHATEST
uniform float alphaCutOff;
#if defined(REFLECTIONMAP_SPHERICAL) || defined(REFLECTIONMAP_PROJECTION) || defined(REFRACTION) || defined(PREPASS)
uniform mat4 view;
#ifdef REFRACTION
uniform vec4 vRefractionInfos;
uniform mat4 refractionMatrix;
#ifdef REFRACTIONFRESNEL
uniform vec4 refractionLeftColor;
#if defined(USE_LOCAL_REFRACTIONMAP_CUBIC) && defined(REFRACTIONMAP_3D)
uniform vec3 vRefractionPosition;
#endif
#if defined(SPECULAR) && defined(SPECULARTERM)
uniform vec2 vSpecularInfos;
#ifdef DIFFUSEFRESNEL
uniform vec4 diffuseLeftColor;
#ifdef OPACITYFRESNEL
uniform vec4 opacityParts;
#ifdef EMISSIVEFRESNEL
uniform vec4 emissiveLeftColor;
#ifdef REFLECTION
uniform vec2 vReflectionInfos;
uniform mat4 reflectionMatrix;
#ifndef REFLECTIONMAP_SKYBOX
#if defined(USE_LOCAL_REFLECTIONMAP_CUBIC) && defined(REFLECTIONMAP_CUBIC)
uniform vec3 vReflectionPosition;
#endif
#ifdef REFLECTIONFRESNEL
uniform vec4 reflectionLeftColor;
#endif
#ifdef DETAIL
uniform vec4 vDetailInfos;
#include<decalFragmentDeclaration>
#define ADDITIONAL_FRAGMENT_DECLARATION
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const defaultFragmentDeclaration = { name, shader };
//# sourceMappingURL=defaultFragmentDeclaration.js.map