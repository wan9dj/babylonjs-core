// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "decalFragment";
const shader = `#ifdef DECAL
#ifdef GAMMADECAL
decalColor.rgb=toLinearSpace(decalColor.rgb);
#ifdef DECAL_SMOOTHALPHA
decalColor.a*=decalColor.a;
surfaceAlbedo.rgb=mix(surfaceAlbedo.rgb,decalColor.rgb,decalColor.a);
`;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const decalFragment = { name, shader };
//# sourceMappingURL=decalFragment.js.map