// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "fluidRenderingParticleDepthPixelShader";
const shader = `uniform mat4 projection;
varying float velocityNorm;
void main(void) {
normal.z=-normal.z;
vec4 realViewPos=vec4(viewPos+normal*sphereRadius,1.0);
gl_FragDepth=clipSpacePos.z/clipSpacePos.w;
gl_FragDepth=(clipSpacePos.z/clipSpacePos.w)*0.5+0.5;
#ifdef FLUIDRENDERING_RHS
realViewPos.z=-realViewPos.z;
#ifdef FLUIDRENDERING_VELOCITY
glFragColor=vec4(realViewPos.z,velocityNorm,0.,1.);
glFragColor=vec4(realViewPos.z,0.,0.,1.);
}
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const fluidRenderingParticleDepthPixelShader = { name, shader };
//# sourceMappingURL=fluidRenderingParticleDepth.fragment.js.map