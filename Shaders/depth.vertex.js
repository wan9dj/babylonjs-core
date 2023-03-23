// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/bonesDeclaration.js";
import "./ShadersInclude/bakedVertexAnimationDeclaration.js";
import "./ShadersInclude/morphTargetsVertexGlobalDeclaration.js";
import "./ShadersInclude/morphTargetsVertexDeclaration.js";
import "./ShadersInclude/clipPlaneVertexDeclaration.js";
import "./ShadersInclude/instancesDeclaration.js";
import "./ShadersInclude/morphTargetsVertexGlobal.js";
import "./ShadersInclude/morphTargetsVertex.js";
import "./ShadersInclude/instancesVertex.js";
import "./ShadersInclude/bonesVertex.js";
import "./ShadersInclude/bakedVertexAnimation.js";
import "./ShadersInclude/clipPlaneVertex.js";
const name = "depthVertexShader";
const shader = `attribute vec3 position;
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<clipPlaneVertexDeclaration>
#include<instancesDeclaration>
uniform mat4 viewProjection;
varying vec2 vUV;
attribute vec2 uv;
#ifdef UV2
attribute vec2 uv2;
#endif
#ifdef STORE_CAMERASPACE_Z
uniform mat4 view;
varying float vDepthMetric;
void main(void)
vec2 uvUpdated=uv;
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
vec4 worldPos=finalWorld*vec4(positionUpdated,1.0);
gl_Position=viewProjection*worldPos;
vViewPos=view*worldPos;
#ifdef USE_REVERSE_DEPTHBUFFER
vDepthMetric=((-gl_Position.z+depthValues.x)/(depthValues.y));
vDepthMetric=((gl_Position.z+depthValues.x)/(depthValues.y));
#endif
#if defined(ALPHATEST) || defined(BASIC_RENDER)
#ifdef UV1
vUV=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));
#ifdef UV2
vUV=vec2(diffuseMatrix*vec4(uv2,1.0,0.0));
#endif
}
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const depthVertexShader = { name, shader };
//# sourceMappingURL=depth.vertex.js.map