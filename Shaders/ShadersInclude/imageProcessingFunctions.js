// Do not edit.
import { ShaderStore } from "../../Engines/shaderStore.js";
const name = "imageProcessingFunctions";
const shader = `#if defined(COLORGRADING) && !defined(COLORGRADING3D)
/** 
vec3 sampleTexture3D(sampler2D colorTransform,vec3 color,vec2 sampler3dSetting)
float sliceContinuous=(color.g-sampler3dSetting.x)*sampler3dSetting.y;
float sliceContinuous=(color.b-sampler3dSetting.x)*sampler3dSetting.y;
float sliceInteger=floor(sliceContinuous);
vec2 sliceUV=color.rb;
vec2 sliceUV=color.rg;
sliceUV.x*=sliceSize;
color.rgb=result.rgb;
color.rgb=result.bgr;
return color;
#ifdef TONEMAPPING_ACES
const mat3 ACESInputMat=mat3(
#define CUSTOM_IMAGEPROCESSINGFUNCTIONS_DEFINITIONS
vec4 applyImageProcessing(vec4 result) {
#ifdef EXPOSURE
result.rgb*=exposureLinear;
#ifdef VIGNETTE
vec2 viewportXY=gl_FragCoord.xy*vInverseScreenSize;
vec3 vignetteColorMultiplier=mix(vignetteColor,vec3(1,1,1),vignette);
#ifdef VIGNETTEBLENDMODEOPAQUE
result.rgb=mix(vignetteColor,result.rgb,vignette);
#endif
#ifdef TONEMAPPING
#ifdef TONEMAPPING_ACES
result.rgb=ACESFitted(result.rgb);
const float tonemappingCalibration=1.590579;
#endif
result.rgb=toGammaSpace(result.rgb);
vec3 resultHighContrast=result.rgb*result.rgb*(3.0-2.0*result.rgb);
#ifdef COLORGRADING
vec3 colorTransformInput=result.rgb*colorTransformSettings.xxx+colorTransformSettings.yyy;
vec3 colorTransformOutput=texture(txColorTransform,colorTransformInput).rgb;
vec3 colorTransformOutput=sampleTexture3D(txColorTransform,colorTransformInput,colorTransformSettings.yz).rgb;
result.rgb=mix(result.rgb,colorTransformOutput,colorTransformSettings.www);
#ifdef COLORCURVES
float luma=getLuminance(result.rgb);
#ifdef DITHER
float rand=getRand(gl_FragCoord.xy*vInverseScreenSize);
#define CUSTOM_IMAGEPROCESSINGFUNCTIONS_UPDATERESULT_ATEND
return result;
// Sideeffect
ShaderStore.IncludesShadersStore[name] = shader;
/** @internal */
export const imageProcessingFunctions = { name, shader };
//# sourceMappingURL=imageProcessingFunctions.js.map