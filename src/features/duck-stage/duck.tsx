import { useFrame, useLoader } from "@react-three/fiber";
import { type RefObject, useLayoutEffect, useMemo, useRef } from "react";
import { Box3, type Group, type Mesh, Vector2, Vector3 } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { animateDuck, type Input, newMemory } from "./duck-animation";
import { addPlushSway } from "./plush-sway";

const DUCK_URL = "/models/duck.glb";
/** Height of the toy in scene units, whatever the model was authored in. */
const HEIGHT = 3.2;

/**
 * "Duck Plush" by SunnyBuns (CC BY 4.0), a knitted duck. The file is one rigid mesh, so the toy is
 * brought to life around it: it turns toward the pointer, its head swings on a spring through the
 * vertex shader, a press squeezes it, and it breathes. Credits live in the footer.
 */
export function Duck({ input }: { input: RefObject<Input> }) {
  const gltf = useLoader(GLTFLoader, DUCK_URL);
  const root = useRef<Group>(null);
  const body = useRef<Group>(null);
  const memory = useRef(newMemory());
  const sway = useMemo(() => ({ value: new Vector2() }), []);

  // Stand the model on the ground, centred, at a known height, and make its mesh sway.
  const { scene, base, top } = useMemo(() => {
    const model = gltf.scene;
    model.updateWorldMatrix(true, true);
    const box = new Box3().setFromObject(model);
    const size = box.getSize(new Vector3());
    const scale = HEIGHT / size.y;
    model.scale.setScalar(scale);
    model.updateWorldMatrix(true, true);
    const fitted = new Box3().setFromObject(model);
    const centre = fitted.getCenter(new Vector3());
    model.position.set(-centre.x, -fitted.min.y, -centre.z);
    return { scene: model, base: 10, top: 56 };
  }, [gltf]);

  useLayoutEffect(() => {
    scene.traverse((object) => {
      const { material } = object as Mesh;
      for (const each of Array.isArray(material) ? material : [material]) {
        if (each) addPlushSway(each, sway, base, top);
      }
    });
  }, [scene, sway, base, top]);

  useFrame((_state, delta) => {
    animateDuck(
      { root, body, sway: sway.value },
      input.current,
      memory.current,
      performance.now() / 1000,
      Math.min(delta, 0.05),
    );
  });

  return (
    <group ref={root}>
      <group ref={body}>
        <primitive object={scene} />
      </group>
    </group>
  );
}
