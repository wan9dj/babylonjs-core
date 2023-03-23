import type { Nullable } from "../../types.js";
import { DecalMapConfiguration } from "../material.decalMapConfiguration";
declare module "./pbrBaseMaterial" {
    interface PBRBaseMaterial {
        /** @internal */
        _decalMap: Nullable<DecalMapConfiguration>;
        /**
         * Defines the decal map parameters for the material.
         */
        decalMap: Nullable<DecalMapConfiguration>;
    }
}
