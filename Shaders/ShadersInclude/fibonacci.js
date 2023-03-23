// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "fibonacci";
const shader = `#define rcp(x) 1./x
#define GOLDEN_RATIO 1.618033988749895
#define TWO_PI 6.2831855
vec2 Golden2dSeq(int i,float n)
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const fibonacci = { name, shader };
//# sourceMappingURL=fibonacci.js.map