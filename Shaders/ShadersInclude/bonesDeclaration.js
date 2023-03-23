// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "bonesDeclaration";
const shader = `#if NUM_BONE_INFLUENCERS>0
attribute vec4 matricesIndices;
attribute vec4 matricesIndicesExtra;
#ifndef BAKED_VERTEX_ANIMATION_TEXTURE
#ifdef BONETEXTURE
uniform sampler2D boneSampler;
uniform mat4 mBones[BonesPerMesh];
uniform mat4 mPreviousBones[BonesPerMesh];
#endif
#ifdef BONETEXTURE
#define inline
mat4 readMatrixFromRawSampler(sampler2D smp,float index)
#endif
#endif
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const bonesDeclaration = { name, shader };
//# sourceMappingURL=bonesDeclaration.js.map