// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/clipPlaneFragmentDeclaration.js";
import "./ShadersInclude/mrtFragmentDeclaration.js";
import "./ShadersInclude/bumpFragmentMainFunctions.js";
import "./ShadersInclude/bumpFragmentFunctions.js";
import "./ShadersInclude/helperFunctions.js";
import "./ShadersInclude/clipPlaneFragment.js";
import "./ShadersInclude/bumpFragment.js";
const name = "geometryPixelShader";
const shader = `#extension GL_EXT_draw_buffers : require
#if defined(BUMP) || !defined(NORMAL)
#extension GL_OES_standard_derivatives : enable
#endif
precision highp float;
varying mat4 vWorldView;
varying vec3 vNormalV;
varying vec4 vViewPos;
varying vec3 vPositionW;
#ifdef VELOCITY
varying vec4 vCurrentPosition;
#ifdef NEED_UV
varying vec2 vUV;
#ifdef BUMP
uniform vec3 vBumpInfos;
#if defined(REFLECTIVITY)
#if defined(ORMTEXTURE) || defined(SPECULARGLOSSINESSTEXTURE) || defined(REFLECTIVITYTEXTURE)
uniform sampler2D reflectivitySampler;
#ifdef ALBEDOTEXTURE
varying vec2 vAlbedoUV;
#ifdef REFLECTIVITYCOLOR
uniform vec3 reflectivityColor;
#ifdef ALBEDOCOLOR
uniform vec3 albedoColor;
#ifdef METALLIC
uniform float metallic;
#if defined(ROUGHNESS) || defined(GLOSSINESS)
uniform float glossiness;
#endif
#if defined(ALPHATEST) && defined(NEED_UV)
uniform sampler2D diffuseSampler;
#include<clipPlaneFragmentDeclaration>
#include<mrtFragmentDeclaration>[RENDER_TARGET_COUNT]
#include<bumpFragmentMainFunctions>
#include<bumpFragmentFunctions>
#include<helperFunctions>
void main() {
#ifdef ALPHATEST
if (texture2D(diffuseSampler,vUV).a<0.4)
vec3 normalOutput;
vec3 normalW=normalize(vNormalW);
normalOutput=normalize(vec3(vWorldView*vec4(normalW,0.0)));
normalOutput=normalize(vNormalV);
#ifdef PREPASS
#ifdef PREPASS_DEPTH
gl_FragData[DEPTH_INDEX]=vec4(vViewPos.z/vViewPos.w,0.0,0.0,1.0);
#ifdef PREPASS_NORMAL
gl_FragData[NORMAL_INDEX]=vec4(normalOutput,1.0);
#else
gl_FragData[0]=vec4(vViewPos.z/vViewPos.w,0.0,0.0,1.0);
#ifdef POSITION
gl_FragData[POSITION_INDEX]=vec4(vPositionW,1.0);
#ifdef VELOCITY
vec2 a=(vCurrentPosition.xy/vCurrentPosition.w)*0.5+0.5;
#ifdef REFLECTIVITY
vec4 reflectivity=vec4(0.0,0.0,0.0,1.0);
float metal=1.0;
metal*=texture2D(reflectivitySampler,vReflectivityUV).b;
#ifdef METALLIC
metal*=metallic;
#ifdef ROUGHNESS
roughness*=(1.0-glossiness); 
reflectivity.a-=roughness;
color=texture2D(albedoSampler,vAlbedoUV).rgb;
color=toLinearSpace(color);
#endif
#ifdef ALBEDOCOLOR
color*=albedoColor.xyz;
reflectivity.rgb=mix(vec3(0.04),color,metal);
#if defined(SPECULARGLOSSINESSTEXTURE) || defined(REFLECTIVITYTEXTURE)
reflectivity=texture2D(reflectivitySampler,vReflectivityUV);
reflectivity.rgb=toLinearSpace(reflectivity.rgb);
#else 
#ifdef REFLECTIVITYCOLOR
reflectivity.rgb=toLinearSpace(reflectivityColor.xyz);
#endif
#ifdef GLOSSINESSS
reflectivity.a*=glossiness; 
#endif
gl_FragData[REFLECTIVITY_INDEX]=reflectivity;
}
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const geometryPixelShader = { name, shader };
//# sourceMappingURL=geometry.fragment.js.map