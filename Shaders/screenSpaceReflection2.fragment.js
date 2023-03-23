// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/helperFunctions.js";
import "./ShadersInclude/screenSpaceRayTrace.js";
const name = "screenSpaceReflection2PixelShader";
const shader = `uniform sampler2D textureSampler;
uniform sampler2D reflectivitySampler;
uniform sampler2D backDepthSampler;
#ifdef SSR_USE_ENVIRONMENT_CUBE
uniform samplerCube envCubeSampler;
uniform vec3 vReflectionPosition;
#endif
uniform mat4 view;
#include<screenSpaceRayTrace>
vec3 fresnelSchlick(float cosTheta,vec3 F0)
ndc.z=-projection[2].z-projection[3].z/depth;
ndc.z=projection[2].z+projection[3].z/depth;
ndc.w=1.0;
vec2 dCoords=smoothstep(0.2,0.6,abs(vec2(0.5,0.5)-hitUV.xy));
#ifdef SSR_ATTENUATE_INTERSECTION_DISTANCE
attenuation*=1.0-clamp(distance(vsRayOrigin,vsHitPoint)/maxRayDistance,0.0,1.0);
#ifdef SSR_ATTENUATE_INTERSECTION_NUMITERATIONS
attenuation*=1.0-(numIterations/maxSteps);
#ifdef SSR_ATTENUATE_BACKFACE_REFLECTION
vec3 reflectionNormal=texelFetch(normalSampler,hitPixel,0).xyz;
return attenuation;
void main()
vec4 colorFull=texture2D(textureSampler,vUV);
gl_FragColor=vec4(0.);
gl_FragColor=colorFull;
return;
color=toLinearSpace(color);
vec2 texSize=vec2(textureSize(depthSampler,0));
vec3 wReflectedVector=vec3(invView*vec4(csReflectedVector,0.0));
vec4 worldPos=invView*vec4(csPosition,1.0);
#ifdef SSR_INVERTCUBICMAP
wReflectedVector.y*=-1.0;
#ifdef SSRAYTRACE_RIGHT_HANDED_SCENE
wReflectedVector.z*=-1.0;
vec3 envColor=textureCube(envCubeSampler,wReflectedVector).xyz;
envColor=toLinearSpace(envColor);
#else
vec3 envColor=color;
float reflectionAttenuation=1.0;
vec3 debugColor;
#ifdef SSR_ATTENUATE_FACING_CAMERA
reflectionAttenuation*=1.0-smoothstep(0.25,0.5,dot(-csViewDirection,csReflectedVector));
if (reflectionAttenuation>0.0) {
vec3 jitt=vec3(0.);
float roughness=1.0-reflectivity.a;
vec2 uv2=vUV*texSize;
backDepthSampler,
thickness,
,debugColor
);
gl_FragColor=vec4(debugColor,1.);
vec3 F0=reflectivity.rgb;
reflectedColor=toLinearSpace(reflectedColor);
reflectionAttenuation*=computeAttenuationForIntersection(ivec2(hitPixel),hitPixel/texSize,csPosition,hitPoint,csReflectedVector,maxDistance,numIterations);
float blur_radius=0.0;
vec3 reflectionMultiplier=clamp(pow(reflectivity.rgb*strength,vec3(reflectionSpecularFalloffExponent)),0.0,1.0);
finalColor=toGammaSpace(finalColor);
gl_FragColor=vec4(finalColor,colorFull.a);
#else
gl_FragColor=texture2D(textureSampler,vUV);
}
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const screenSpaceReflection2PixelShader = { name, shader };
//# sourceMappingURL=screenSpaceReflection2.fragment.js.map