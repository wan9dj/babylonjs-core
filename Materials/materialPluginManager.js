import { Material } from "./material.js";
import { MaterialPluginEvent } from "./materialPluginEvent.js";
const rxOption = new RegExp("^([gimus]+)!");
/**
 * Class that manages the plugins of a material
 * @since 5.0
 */
export class MaterialPluginManager {
    /**
     * Creates a new instance of the plugin manager
     * @param material material that this manager will manage the plugins for
     */
    constructor(material) {
        this._plugins = [];
        this._activePlugins = [];
        this._activePluginsForExtraEvents = [];
        this._material = material;
        this._scene = material.getScene();
        this._engine = this._scene.getEngine();
    }
    /**
     * @internal
     */
    _addPlugin(plugin) {
        for (let i = 0; i < this._plugins.length; ++i) {
            if (this._plugins[i].name === plugin.name) {
                throw `Plugin "${plugin.name}" already added to the material "${this._material.name}"!`;
            }
        }
        if (this._material._uniformBufferLayoutBuilt) {
            throw `The plugin "${plugin.name}" can't be added to the material "${this._material.name}" because this material has already been used for rendering! Please add plugins to materials before any rendering with this material occurs.`;
        }
        const pluginClassName = plugin.getClassName();
        if (!MaterialPluginManager._MaterialPluginClassToMainDefine[pluginClassName]) {
            MaterialPluginManager._MaterialPluginClassToMainDefine[pluginClassName] = "MATERIALPLUGIN_" + ++MaterialPluginManager._MaterialPluginCounter;
        }
        this._material._callbackPluginEventGeneric = this._handlePluginEvent.bind(this);
        this._plugins.push(plugin);
        this._plugins.sort((a, b) => a.priority - b.priority);
        this._codeInjectionPoints = {};
        const defineNamesFromPlugins = {};
        defineNamesFromPlugins[MaterialPluginManager._MaterialPluginClassToMainDefine[pluginClassName]] = {
            type: "boolean",
            default: true,
        };
        for (const plugin of this._plugins) {
            plugin.collectDefines(defineNamesFromPlugins);
            this._collectPointNames("vertex", plugin.getCustomCode("vertex"));
            this._collectPointNames("fragment", plugin.getCustomCode("fragment"));
        }
        this._defineNamesFromPlugins = defineNamesFromPlugins;
    }
    /**
     * @internal
     */
    _activatePlugin(plugin) {
        if (this._activePlugins.indexOf(plugin) === -1) {
            this._activePlugins.push(plugin);
            this._activePlugins.sort((a, b) => a.priority - b.priority);
            this._material._callbackPluginEventIsReadyForSubMesh = this._handlePluginEventIsReadyForSubMesh.bind(this);
            this._material._callbackPluginEventPrepareDefinesBeforeAttributes = this._handlePluginEventPrepareDefinesBeforeAttributes.bind(this);
            this._material._callbackPluginEventPrepareDefines = this._handlePluginEventPrepareDefines.bind(this);
            this._material._callbackPluginEventBindForSubMesh = this._handlePluginEventBindForSubMesh.bind(this);
            if (plugin.registerForExtraEvents) {
                this._activePluginsForExtraEvents.push(plugin);
                this._activePluginsForExtraEvents.sort((a, b) => a.priority - b.priority);
                this._material._callbackPluginEventHasRenderTargetTextures = this._handlePluginEventHasRenderTargetTextures.bind(this);
                this._material._callbackPluginEventFillRenderTargetTextures = this._handlePluginEventFillRenderTargetTextures.bind(this);
                this._material._callbackPluginEventHardBindForSubMesh = this._handlePluginEventHardBindForSubMesh.bind(this);
            }
        }
    }
    /**
     * Gets a plugin from the list of plugins managed by this manager
     * @param name name of the plugin
     * @returns the plugin if found, else null
     */
    getPlugin(name) {
        for (let i = 0; i < this._plugins.length; ++i) {
            if (this._plugins[i].name === name) {
                return this._plugins[i];
            }
        }
        return null;
    }
    _handlePluginEventIsReadyForSubMesh(eventData) {
        let isReady = true;
        for (const plugin of this._activePlugins) {
            isReady = isReady && plugin.isReadyForSubMesh(eventData.defines, this._scene, this._engine, eventData.subMesh);
        }
        eventData.isReadyForSubMesh = isReady;
    }
    _handlePluginEventPrepareDefinesBeforeAttributes(eventData) {
        for (const plugin of this._activePlugins) {
            plugin.prepareDefinesBeforeAttributes(eventData.defines, this._scene, eventData.mesh);
        }
    }
    _handlePluginEventPrepareDefines(eventData) {
        for (const plugin of this._activePlugins) {
            plugin.prepareDefines(eventData.defines, this._scene, eventData.mesh);
        }
    }
    _handlePluginEventHardBindForSubMesh(eventData) {
        for (const plugin of this._activePluginsForExtraEvents) {
            plugin.hardBindForSubMesh(this._material._uniformBuffer, this._scene, this._engine, eventData.subMesh);
        }
    }
    _handlePluginEventBindForSubMesh(eventData) {
        for (const plugin of this._activePlugins) {
            plugin.bindForSubMesh(this._material._uniformBuffer, this._scene, this._engine, eventData.subMesh);
        }
    }
    _handlePluginEventHasRenderTargetTextures(eventData) {
        let hasRenderTargetTextures = false;
        for (const plugin of this._activePluginsForExtraEvents) {
            hasRenderTargetTextures = plugin.hasRenderTargetTextures();
            if (hasRenderTargetTextures) {
                break;
            }
        }
        eventData.hasRenderTargetTextures = hasRenderTargetTextures;
    }
    _handlePluginEventFillRenderTargetTextures(eventData) {
        for (const plugin of this._activePluginsForExtraEvents) {
            plugin.fillRenderTargetTextures(eventData.renderTargets);
        }
    }
    _handlePluginEvent(id, info) {
        switch (id) {
            case MaterialPluginEvent.GetActiveTextures: {
                const eventData = info;
                for (const plugin of this._activePlugins) {
                    plugin.getActiveTextures(eventData.activeTextures);
                }
                break;
            }
            case MaterialPluginEvent.GetAnimatables: {
                const eventData = info;
                for (const plugin of this._activePlugins) {
                    plugin.getAnimatables(eventData.animatables);
                }
                break;
            }
            case MaterialPluginEvent.HasTexture: {
                const eventData = info;
                let hasTexture = false;
                for (const plugin of this._activePlugins) {
                    hasTexture = plugin.hasTexture(eventData.texture);
                    if (hasTexture) {
                        break;
                    }
                }
                eventData.hasTexture = hasTexture;
                break;
            }
            case MaterialPluginEvent.Disposed: {
                const eventData = info;
                for (const plugin of this._plugins) {
                    plugin.dispose(eventData.forceDisposeTextures);
                }
                break;
            }
            case MaterialPluginEvent.GetDefineNames: {
                const eventData = info;
                eventData.defineNames = this._defineNamesFromPlugins;
                break;
            }
            case MaterialPluginEvent.PrepareEffect: {
                const eventData = info;
                for (const plugin of this._activePlugins) {
                    eventData.fallbackRank = plugin.addFallbacks(eventData.defines, eventData.fallbacks, eventData.fallbackRank);
                    plugin.getAttributes(eventData.attributes, this._scene, eventData.mesh);
                }
                if (this._uniformList.length > 0) {
                    eventData.uniforms.push(...this._uniformList);
                }
                if (this._samplerList.length > 0) {
                    eventData.samplers.push(...this._samplerList);
                }
                if (this._uboList.length > 0) {
                    eventData.uniformBuffersNames.push(...this._uboList);
                }
                eventData.customCode = this._injectCustomCode(eventData.customCode);
                break;
            }
            case MaterialPluginEvent.PrepareUniformBuffer: {
                const eventData = info;
                this._uboDeclaration = "";
                this._vertexDeclaration = "";
                this._fragmentDeclaration = "";
                this._uniformList = [];
                this._samplerList = [];
                this._uboList = [];
                for (const plugin of this._plugins) {
                    const uniforms = plugin.getUniforms();
                    if (uniforms) {
                        if (uniforms.ubo) {
                            for (const uniform of uniforms.ubo) {
                                eventData.ubo.addUniform(uniform.name, uniform.size);
                                this._uboDeclaration += `${uniform.type} ${uniform.name};\r\n`;
                                this._uniformList.push(uniform.name);
                            }
                        }
                        if (uniforms.vertex) {
                            this._vertexDeclaration += uniforms.vertex + "\r\n";
                        }
                        if (uniforms.fragment) {
                            this._fragmentDeclaration += uniforms.fragment + "\r\n";
                        }
                    }
                    plugin.getSamplers(this._samplerList);
                    plugin.getUniformBuffersNames(this._uboList);
                }
                break;
            }
        }
    }
    _collectPointNames(shaderType, customCode) {
        if (!customCode) {
            return;
        }
        for (const pointName in customCode) {
            if (!this._codeInjectionPoints[shaderType]) {
                this._codeInjectionPoints[shaderType] = {};
            }
            this._codeInjectionPoints[shaderType][pointName] = true;
        }
    }
    _injectCustomCode(existingCallback) {
        return (shaderType, code) => {
            var _a;
            if (existingCallback) {
                code = existingCallback(shaderType, code);
            }
            if (this._uboDeclaration) {
                code = code.replace("#define ADDITIONAL_UBO_DECLARATION", this._uboDeclaration);
            }
            if (this._vertexDeclaration) {
                code = code.replace("#define ADDITIONAL_VERTEX_DECLARATION", this._vertexDeclaration);
            }
            if (this._fragmentDeclaration) {
                code = code.replace("#define ADDITIONAL_FRAGMENT_DECLARATION", this._fragmentDeclaration);
            }
            const points = (_a = this._codeInjectionPoints) === null || _a === void 0 ? void 0 : _a[shaderType];
            if (!points) {
                return code;
            }
            for (let pointName in points) {
                let injectedCode = "";
                for (const plugin of this._activePlugins) {
                    const customCode = plugin.getCustomCode(shaderType);
                    if (customCode === null || customCode === void 0 ? void 0 : customCode[pointName]) {
                        injectedCode += customCode[pointName] + "\r\n";
                    }
                }
                if (injectedCode.length > 0) {
                    if (pointName.charAt(0) === "!") {
                        // pointName is a regular expression
                        pointName = pointName.substring(1);
                        let regexFlags = "g";
                        if (pointName.charAt(0) === "!") {
                            // no flags
                            regexFlags = "";
                            pointName = pointName.substring(1);
                        }
                        else {
                            // get the flag(s)
                            const matchOption = rxOption.exec(pointName);
                            if (matchOption && matchOption.length >= 2) {
                                regexFlags = matchOption[1];
                                pointName = pointName.substring(regexFlags.length + 1);
                            }
                        }
                        if (regexFlags.indexOf("g") < 0) {
                            // we force the "g" flag so that the regexp object is stateful!
                            regexFlags += "g";
                        }
                        const sourceCode = code;
                        const rx = new RegExp(pointName, regexFlags);
                        let match = rx.exec(sourceCode);
                        while (match !== null) {
                            let newCode = injectedCode;
                            for (let i = 0; i < match.length; ++i) {
                                newCode = newCode.replace("$" + i, match[i]);
                            }
                            code = code.replace(match[0], newCode);
                            match = rx.exec(sourceCode);
                        }
                    }
                    else {
                        const fullPointName = "#define " + pointName;
                        code = code.replace(fullPointName, "\r\n" + injectedCode + "\r\n" + fullPointName);
                    }
                }
            }
            return code;
        };
    }
}
/** Map a plugin class name to a #define name (used in the vertex/fragment shaders as a marker of the plugin usage) */
MaterialPluginManager._MaterialPluginClassToMainDefine = {};
MaterialPluginManager._MaterialPluginCounter = 0;
const plugins = [];
let inited = false;
/**
 * Registers a new material plugin through a factory, or updates it. This makes the plugin available to all materials instantiated after its registration.
 * @param pluginName The plugin name
 * @param factory The factory function which allows to create the plugin
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function RegisterMaterialPlugin(pluginName, factory) {
    if (!inited) {
        Material.OnEventObservable.add((material) => {
            for (const [, factory] of plugins) {
                factory(material);
            }
        }, MaterialPluginEvent.Created);
        inited = true;
    }
    const existing = plugins.filter(([name, _factory]) => name === pluginName);
    if (existing.length > 0) {
        existing[0][1] = factory;
    }
    else {
        plugins.push([pluginName, factory]);
    }
}
/**
 * Removes a material plugin from the list of global plugins.
 * @param pluginName The plugin name
 * @returns true if the plugin has been removed, else false
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function UnregisterMaterialPlugin(pluginName) {
    for (let i = 0; i < plugins.length; ++i) {
        if (plugins[i][0] === pluginName) {
            plugins.splice(i, 1);
            return true;
        }
    }
    return false;
}
/**
 * Clear the list of global material plugins
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function UnregisterAllMaterialPlugins() {
    plugins.length = 0;
}
//# sourceMappingURL=materialPluginManager.js.map