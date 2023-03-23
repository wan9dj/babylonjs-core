// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "instancesVertex";
const shader = `#ifdef INSTANCES
mat4 finalWorld=mat4(world0,world1,world2,world3);
mat4 finalPreviousWorld=mat4(previousWorld0,previousWorld1,previousWorld2,previousWorld3);
#ifdef THIN_INSTANCES
finalWorld=world*finalWorld;
finalPreviousWorld=previousWorld*finalPreviousWorld;
#endif
#else
mat4 finalWorld=world;
mat4 finalPreviousWorld=previousWorld;
#endif
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const instancesVertex = { name, shader };
//# sourceMappingURL=instancesVertex.js.map