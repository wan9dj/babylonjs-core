// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/fogFragmentDeclaration.js";
import "./ShadersInclude/fogFragment.js";
import "./ShadersInclude/imageProcessingCompatibility.js";
const name = "spritesPixelShader";
const shader = `uniform bool alphaTest;varying vec4 vColor;varying vec2 vUV;uniform sampler2D diffuseSampler;#include<fogFragmentDeclaration>
#define CUSTOM_FRAGMENT_DEFINITIONS
void main(void) {#define CUSTOM_FRAGMENT_MAIN_BEGIN
vec4 color=texture2D(diffuseSampler,vUV);float fAlphaTest=float(alphaTest);if (fAlphaTest != 0.){if (color.a<0.95)discard;}color*=vColor;#include<fogFragment>
gl_FragColor=color;#include<imageProcessingCompatibility>
#define CUSTOM_FRAGMENT_MAIN_END
}`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const spritesPixelShader = { name, shader };
//# sourceMappingURL=sprites.fragment.js.map