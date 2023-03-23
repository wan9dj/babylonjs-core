// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "tonemapPixelShader";
const shader = `varying vec2 vUV;
const float A=0.15;
float Luminance(vec3 c)
void main(void) 
float lum=Luminance(colour.rgb); 
colour*=_ExposureAdjustment;
colour*=_ExposureAdjustment;
colour= vec3(1.0,1.0,1.0)-exp2(-_ExposureAdjustment*colour);
gl_FragColor=vec4(colour.rgb,1.0);
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const tonemapPixelShader = { name, shader };
//# sourceMappingURL=tonemap.fragment.js.map