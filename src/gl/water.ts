// Live water for the tide section: a sum of travelling waves plus cursor ripples, posterised into hard
// flat bands (no gradients). Colours come from tokens.css so the palette stays in one place.
import { Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, Vector2, Vector3, WebGLRenderer } from 'three';
import { gsap, RM, token, whileVisible } from '../lib/motion';

const N = 10;

const glslColour = (name: string) => {
  const n = parseInt(token(name).slice(1), 16);
  return `vec3(${((n >> 16) & 255) / 255},${((n >> 8) & 255) / 255},${(n & 255) / 255})`;
};

export type Water = { drop: (x: number, y: number, big?: boolean) => void; dispose: () => void };

/** `progress` is the tide timeline's progress; it raises the swell and fires the koi's splash at 42%. */
export function createWater(canvas: HTMLCanvasElement, progress: () => number): Water | null {
  let renderer: WebGLRenderer;
  try { renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false }); } catch { return null; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));

  const rips = Array.from({ length: N }, () => new Vector3(0, 0, -999));
  const uniforms = { uTime: { value: 0 }, uRes: { value: new Vector2(1, 1) }, uStorm: { value: 0 }, uRip: { value: rips } };
  const material = new ShaderMaterial({
    uniforms,
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0., 1.); }',
    fragmentShader: /* glsl */ `
      uniform float uTime, uStorm; uniform vec2 uRes; uniform vec3 uRip[${N}];
      varying vec2 vUv;
      const vec3 C0 = ${glslColour('--w0')}, C1 = ${glslColour('--w1')}, C2 = ${glslColour('--w2')},
                 C3 = ${glslColour('--w3')}, C4 = ${glslColour('--w4')}, CP = ${glslColour('--paper')};
      float field(vec2 p){
        float t = uTime, h = 0.;
        h += sin(dot(p, vec2(.0042, .0019)) + t * .62) * .5;
        h += sin(dot(p, vec2(-.0031, .0047)) - t * .48) * .36;
        h += sin(dot(p, vec2(.0068, -.0016)) + t * 1.05) * .22;
        h *= .5 + uStorm * .75;
        for (int i = 0; i < ${N}; i++) {
          vec3 r = uRip[i]; float age = t - r.z; float d = length(p - r.xy);
          float env = exp(-abs(d - age * 300.) / 110.) * exp(-age * .7) * step(0., age);
          h += sin(d * .042 - age * 8.) * env * 1.9;
        }
        return h;
      }
      void main(){
        float f = field(vUv * uRes) * 1.55 + 1.5;
        float lv = clamp(floor(f), 0., 4.);
        vec3 c = mix(C0, C1, step(1., lv)); c = mix(c, C2, step(2., lv)); c = mix(c, C3, step(3., lv)); c = mix(c, C4, step(4., lv));
        float w = fwidth(f); float dist = abs(fract(f + .5) - .5);
        float line = (1. - smoothstep(w * .6, w * 1.6, dist)) * step(2., f);
        c = mix(c, mix(C3, CP, step(3.5, f)), line);
        gl_FragColor = vec4(c, 1.);
      }`,
  });

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const geometry = new PlaneGeometry(2, 2);
  scene.add(new Mesh(geometry, material));

  const start = performance.now();
  let live = false, lastP = 0, idx = 0;

  const size = () => {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    uniforms.uRes.value.set(w, h);
  };
  size();
  addEventListener('resize', size);

  const drop = (x: number, y: number, big = false) => {
    rips[idx++ % N].set(x, canvas.clientHeight - y, uniforms.uTime.value - (big ? 0 : 0.15));
    if (RM) frame();
  };

  function frame() {
    if (!RM) uniforms.uTime.value = (performance.now() - start) / 1000;
    const p = progress();
    uniforms.uStorm.value = p;
    if (lastP < 0.42 && p >= 0.42) drop(canvas.clientWidth / 2, canvas.clientHeight * 0.46, true);
    lastP = p;
    renderer.render(scene, camera);
  }

  const tick = () => { if (live) frame(); };
  gsap.ticker.add(tick);
  const unwatch = whileVisible(canvas, v => { live = v; if (v) frame(); });

  return {
    drop,
    dispose() {
      unwatch(); gsap.ticker.remove(tick); removeEventListener('resize', size);
      geometry.dispose(); material.dispose(); renderer.dispose();
    },
  };
}
