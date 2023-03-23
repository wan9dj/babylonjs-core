// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "screenSpaceRayTrace";
const shader = `float distanceSquared(vec2 a,vec2 b) { a-=b; return dot(a,a); }
bool traceScreenSpaceRay1(
sampler2D csZBackBuffer,
float csZThickness,
,out vec3 debugColor
)
float rayLength=(csOrigin.z+csDirection.z*maxRayTraceDistance)>-nearPlaneZ ? (-nearPlaneZ-csOrigin.z)/csDirection.z : maxRayTraceDistance;
float rayLength=(csOrigin.z+csDirection.z*maxRayTraceDistance)<nearPlaneZ ? (nearPlaneZ-csOrigin.z)/csDirection.z : maxRayTraceDistance;
vec3 csEndPoint=csOrigin+csDirection*rayLength;
float xMax=csZBufferSize.x-0.5,xMin=0.5,yMax=csZBufferSize.y-0.5,yMin=0.5;
P1+=vec2((distanceSquared(P0,P1)<0.0001) ? 0.01 : 0.0);
#ifdef SSRAYTRACE_USE_BACK_DEPTHBUFFER
float sceneBackZ=texelFetch(csZBackBuffer,ivec2(hitPixel/csZBackSizeFactor),0).r;
hit=(rayZMax>=sceneZMax-csZThickness) && (rayZMin<=sceneZMax);
#else
#ifdef SSRAYTRACE_USE_BACK_DEPTHBUFFER
float sceneBackZ=texelFetch(csZBackBuffer,ivec2(hitPixel/csZBackSizeFactor),0).r;
hit=(rayZMin<=sceneZMax+csZThickness) && (rayZMax>=sceneZMax);
#endif
}
if (stride>1.0 && hit) {
Q0.xy+=dQ.xy*stepCount;
if (((pqk.x+dPQK.x)*stepDirection)>end) {
return hit;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const screenSpaceRayTrace = { name, shader };
//# sourceMappingURL=screenSpaceRayTrace.js.map