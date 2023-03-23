// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
import "./ShadersInclude/helperFunctions.js";
const name = "screenSpaceReflection2BlurCombinerPixelShader";
const shader = `uniform sampler2D textureSampler; 
void main()
gl_FragColor=texture2D(textureSampler,vUV);
vec3 SSR=texture2D(textureSampler,vUV).rgb;
color=toLinearSpace(color);
vec3 reflectionMultiplier=clamp(pow(reflectivity.rgb*strength,vec3(reflectionSpecularFalloffExponent)),0.0,1.0);
finalColor=toGammaSpace(finalColor);
gl_FragColor=vec4(finalColor,color.a);
}
// Sideeffect
ShaderStore.ShadersStore[name] = shader;
/** @internal */
export const screenSpaceReflection2BlurCombinerPixelShader = { name, shader };
//# sourceMappingURL=screenSpaceReflection2BlurCombiner.fragment.js.map