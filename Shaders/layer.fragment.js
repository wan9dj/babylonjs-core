// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/helperFunctions.js";
const name = "layerPixelShader";
const shader = `varying vec2 vUV;
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {
vec4 baseColor=texture2D(textureSampler,vUV);
baseColor.rgb=toGammaSpace(baseColor.rgb);
#ifdef ALPHATEST
if (baseColor.a<0.4)
gl_FragColor=baseColor*color;
}`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const layerPixelShader = { name, shader };
//# sourceMappingURL=layer.fragment.js.map