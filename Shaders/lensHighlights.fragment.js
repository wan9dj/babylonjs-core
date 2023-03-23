// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "lensHighlightsPixelShader";
const shader = `uniform sampler2D textureSampler; 
void main(void)
blurred+=highlightColor(texture2D(textureSampler,vUV+vec2(-0.84*w,0.43*h)));
blurred+=highlightColor(texture2D(textureSampler,vUV+vec2(-0.85*w,0.36*h)));
blurred/=39.0;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const lensHighlightsPixelShader = { name, shader };
//# sourceMappingURL=lensHighlights.fragment.js.map