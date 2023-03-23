// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "volumetricLightScatteringPassPixelShader";
const shader = `#if defined(ALPHATEST) || defined(NEED_UV)
varying vec2 vUV;
#if defined(ALPHATEST)
uniform sampler2D diffuseSampler;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void)
vec4 diffuseColor=texture2D(diffuseSampler,vUV);
gl_FragColor=vec4(0.0,0.0,0.0,1.0);
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const volumetricLightScatteringPassPixelShader = { name, shader };
//# sourceMappingURL=volumetricLightScatteringPass.fragment.js.map