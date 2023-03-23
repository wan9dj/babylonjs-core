// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "passCubePixelShader";
const shader = `varying vec2 vUV;
void main(void) 
gl_FragColor=textureCube(textureSampler,vec3(1.001,uv.y,uv.x));
#ifdef NEGATIVEX
gl_FragColor=textureCube(textureSampler,vec3(-1.001,uv.y,uv.x));
#ifdef POSITIVEY
gl_FragColor=textureCube(textureSampler,vec3(uv.y,1.001,uv.x));
#ifdef NEGATIVEY
gl_FragColor=textureCube(textureSampler,vec3(uv.y,-1.001,uv.x));
#ifdef POSITIVEZ
gl_FragColor=textureCube(textureSampler,vec3(uv,1.001));
#ifdef NEGATIVEZ
gl_FragColor=textureCube(textureSampler,vec3(uv,-1.001));
}`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const passCubePixelShader = { name, shader };
//# sourceMappingURL=passCube.fragment.js.map