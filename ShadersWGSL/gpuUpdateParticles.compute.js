// Do not edit.
import { ShaderStore } from "../Engines/shaderStore.js";
const name = "gpuUpdateParticlesComputeShader";
const shader = `struct Particle {
initialPosition : vec3<f32>,
#ifndef COLORGRADIENTS
color : vec4<f32>,
#ifndef BILLBOARD
initialDirection : vec3<f32>,
#ifdef NOISE
noiseCoordinates1 : vec3<f32>,
#ifdef ANGULARSPEEDGRADIENTS
angle : f32,
angle : vec2<f32>,
#ifdef ANIMATESHEET
cellIndex : f32,
cellStartOffset : f32,
#endif
};
color1 : vec4<f32>,
sizeRange : vec2<f32>,
limitVelocityDamping : f32,
#ifdef ANIMATESHEET
cellInfos : vec4<f32>,
#ifdef NOISE
noiseStrength : vec3<f32>,
#ifndef LOCAL
emitterWM : mat4x4<f32>,
#ifdef BOXEMITTER
direction1 : vec3<f32>,
#ifdef CONEEMITTER
radius : vec2<f32>,
#ifdef CYLINDEREMITTER
radius : f32,
direction1 : vec3<f32>,
directionRandomizer : f32,
#endif
#ifdef HEMISPHERICEMITTER
radius : f32,
#ifdef POINTEMITTER
direction1 : vec3<f32>,
#ifdef SPHEREEMITTER
radius : f32,
direction1 : vec3<f32>,
directionRandomizer : f32,
#endif
};
@binding(0) @group(1) var sizeGradientSampler : sampler;
#ifdef ANGULARSPEEDGRADIENTS
@binding(2) @group(1) var angularSpeedGradientSampler : sampler;
#ifdef VELOCITYGRADIENTS
@binding(4) @group(1) var velocityGradientSampler : sampler;
#ifdef LIMITVELOCITYGRADIENTS
@binding(6) @group(1) var limitVelocityGradientSampler : sampler;
#ifdef DRAGGRADIENTS
@binding(8) @group(1) var dragGradientSampler : sampler;
#ifdef NOISE
@binding(10) @group(1) var noiseSampler : sampler;
fn getRandomVec3(offset : f32,vertexID : f32)->vec3<f32> {
sizex=textureSampleLevel(sizeGradientTexture,sizeGradientSampler,vec2<f32>(0.,0.),0.).r;
sizex=params.sizeRange.x+(params.sizeRange.y-params.sizeRange.x)*randoms.g;
particlesOut.particles[index].size=vec3<f32>(
particlesOut.particles[index].color=params.color1+(params.color2-params.color1)*randoms.b;
#ifndef ANGULARSPEEDGRADIENTS 
particlesOut.particles[index].angle=vec2<f32>(
particlesOut.particles[index].angle=params.angleRange.z+(params.angleRange.w-params.angleRange.z)*randoms.r;
#if defined(POINTEMITTER)
let randoms2 : vec3<f32>=getRandomVec3(seed.y,vertexID);
let randoms2 : vec3<f32>=getRandomVec3(seed.y,vertexID);
let randoms2 : vec3<f32>=getRandomVec3(seed.y,vertexID);
let randoms2 : vec3<f32>=getRandomVec3(seed.y,vertexID);
newDirection=normalize(params.direction1+(params.direction2-params.direction1)*randoms3);
newDirection=normalize(newPosition+params.directionRandomizer*randoms3);
#elif defined(CYLINDEREMITTER)
let randoms2 : vec3<f32>=getRandomVec3(seed.y,vertexID);
newDirection=params.direction1+(params.direction2-params.direction1)*randoms3;
angle=angle+(-0.5+randoms3.x)*PI*params.directionRandomizer;
#elif defined(CONEEMITTER)
let randoms2 : vec3<f32>=getRandomVec3(seed.y,vertexID);
let h : f32=0.0001;
var h : f32=randoms2.y*params.height.y;
var lRadius : f32=params.radius.x-params.radius.x*randoms2.z*params.radius.y;
newPosition=particlesIn.particles[index].initialPosition;
newPosition=vec3<f32>(0.,0.,0.);
let power : f32=params.emitPower.x+(params.emitPower.y-params.emitPower.x)*randoms.a;
particlesOut.particles[index].position=newPosition;
particlesOut.particles[index].position=(params.emitterWM*vec4<f32>(newPosition,1.)).xyz;
#ifdef CUSTOMEMITTER
particlesOut.particles[index].direction=direction;
particlesOut.particles[index].initialDirection=direction;
#else
#ifdef LOCAL
let initial : vec3<f32>=newDirection;
let initial : vec3<f32>=(params.emitterWM*vec4<f32>(newDirection,0.)).xyz;
particlesOut.particles[index].direction=initial*power;
particlesOut.particles[index].initialDirection=initial;
#endif
#ifdef ANIMATESHEET 
particlesOut.particles[index].cellIndex=params.cellInfos.x;
particlesOut.particles[index].cellStartOffset=randoms.a*outLife;
#endif
#ifdef NOISE
particlesOut.particles[index].noiseCoordinates1=particlesIn.particles[index].noiseCoordinates1;
} else {
directionScale=directionScale*textureSampleLevel(velocityGradientTexture,velocityGradientSampler,vec2<f32>(ageGradient,0.),0.).r;
#ifdef DRAGGRADIENTS
directionScale=directionScale*(1.0-textureSampleLevel(dragGradientTexture,dragGradientSampler,vec2<f32>(ageGradient,0.),0.).r);
let position : vec3<f32>=particlesIn.particles[index].position;
particlesOut.particles[index].position=position+(direction-position)*ageGradient; 
particlesOut.particles[index].position=position+direction*directionScale;
particlesOut.particles[index].life=life;
particlesOut.particles[index].color=particlesIn.particles[index].color;
#ifdef SIZEGRADIENTS
particlesOut.particles[index].size=vec3<f32>(
particlesOut.particles[index].size=particlesIn.particles[index].size;
#ifndef BILLBOARD 
particlesOut.particles[index].initialDirection=particlesIn.particles[index].initialDirection;
#ifdef CUSTOMEMITTER
particlesOut.particles[index].direction=direction;
var updatedDirection : vec3<f32>=direction+params.gravity*timeDelta;
let limitVelocity : f32=textureSampleLevel(limitVelocityGradientTexture,limitVelocityGradientSampler,vec2<f32>(ageGradient,0.),0.).r;
particlesOut.particles[index].direction=updatedDirection;
let noiseCoordinates1 : vec3<f32>=particlesIn.particles[index].noiseCoordinates1;
#endif 
#ifdef ANGULARSPEEDGRADIENTS
let angularSpeed : f32=textureSampleLevel(angularSpeedGradientTexture,angularSpeedGradientSampler,vec2<f32>(ageGradient,0.),0.).r;
let angle : vec2<f32>=particlesIn.particles[index].angle;
#ifdef ANIMATESHEET 
var offsetAge : f32=particlesOut.particles[index].age;
let cellStartOffset : f32=particlesIn.particles[index].cellStartOffset;
let cellStartOffset : f32=0.;
var ratio : f32;
}
// Sideeffect
ShaderStore.ShadersStoreWGSL[name] = shader;
/** @internal */
export const gpuUpdateParticlesComputeShader = { name, shader };
//# sourceMappingURL=gpuUpdateParticles.compute.js.map