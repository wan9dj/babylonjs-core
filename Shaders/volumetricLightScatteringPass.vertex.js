// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/bonesDeclaration.js";
import "./ShadersInclude/bakedVertexAnimationDeclaration.js";
import "./ShadersInclude/morphTargetsVertexGlobalDeclaration.js";
import "./ShadersInclude/morphTargetsVertexDeclaration.js";
import "./ShadersInclude/instancesDeclaration.js";
import "./ShadersInclude/morphTargetsVertexGlobal.js";
import "./ShadersInclude/morphTargetsVertex.js";
import "./ShadersInclude/instancesVertex.js";
import "./ShadersInclude/bonesVertex.js";
import "./ShadersInclude/bakedVertexAnimation.js";
const name = "volumetricLightScatteringPassVertexShader";
const shader = `attribute vec3 position;
#include<bakedVertexAnimationDeclaration>
#include<morphTargetsVertexGlobalDeclaration>
#include<morphTargetsVertexDeclaration>[0..maxSimultaneousMorphTargets]
#include<instancesDeclaration>
uniform mat4 viewProjection;
varying vec2 vUV;
attribute vec2 uv;
#ifdef UV2
attribute vec2 uv2;
#endif
#define CUSTOM_VERTEX_DEFINITIONS
void main(void)
vec2 uvUpdated=uv;
#include<morphTargetsVertexGlobal>
#include<morphTargetsVertex>[0..maxSimultaneousMorphTargets]
#include<instancesVertex>
#include<bonesVertex>
#include<bakedVertexAnimation>
gl_Position=viewProjection*finalWorld*vec4(positionUpdated,1.0);
#ifdef UV1
vUV=vec2(diffuseMatrix*vec4(uvUpdated,1.0,0.0));
#ifdef UV2
vUV=vec2(diffuseMatrix*vec4(uv2,1.0,0.0));
#endif
}
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const volumetricLightScatteringPassVertexShader = { name, shader };
//# sourceMappingURL=volumetricLightScatteringPass.vertex.js.map