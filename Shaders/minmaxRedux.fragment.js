// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "minmaxReduxPixelShader";
const shader = `varying vec2 vUV;
uniform sampler2D sourceTexture;
float maxz=max(max(max(sign(1.0-f1)*f1,sign(1.0-f2)*f2),sign(1.0-f3)*f3),sign(1.0-f4)*f4);
float maxz=max(max(max(f1,f2),f3),f4);
glFragColor=vec4(minz,maxz,0.,0.);
uniform vec2 texSize;
uniform ivec2 texSize;
void main(void)
`;
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const minmaxReduxPixelShader = { name, shader };
//# sourceMappingURL=minmaxRedux.fragment.js.map