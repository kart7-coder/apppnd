// Cena 3D: braço do violão + mão articulada (modelo aberto do WebXR Input Profiles, MIT).
// As juntas do modelo são independentes (como no rastreamento de mãos em RV): aqui
// calculamos a posição de cada junta e orientamos os ossos ao longo dos dedos.
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import type { ChordShape } from '../../music/types'

// ---------- medidas reais (metros) ----------
const SCALE_LEN = 0.65
const fretPos = (n: number) => SCALE_LEN - SCALE_LEN / Math.pow(2, n / 12)
const NECK_HALF = 0.0235
const STRING_SPAN = 0.0185 // da corda 6 ao centro
const stringY = (str: number) => STRING_SPAN - ((6 - str) * (2 * STRING_SPAN)) / 5 // 6 em cima (+y), 1 embaixo
const STRING_Z = 0.0045

const FINGERS = ['index', 'middle', 'ring', 'pinky'] as const
const JOINTS = ['metacarpal', 'phalanx-proximal', 'phalanx-intermediate', 'phalanx-distal', 'tip'] as const
const THUMB = ['thumb-metacarpal', 'thumb-phalanx-proximal', 'thumb-phalanx-distal', 'thumb-tip']

type V = THREE.Vector3

interface BoneRest {
  bone: THREE.Object3D
  localDir: V
  localSide: V
}

export interface HandScene {
  setShape(shape: ChordShape | undefined, firstFret: number): void
  resize(w: number, h: number): void
  /** Posições na tela (px) das pontas usadas, para os números dos dedos. */
  tipScreen(): { finger: number; x: number; y: number }[]
  /** Posição na tela de cada corda na pestana (para X / O). */
  stringScreen(): { str: number; x: number; y: number }[]
  dispose(): void
}

function basis(dir: V, side: V) {
  const y = dir.clone().normalize()
  const x = side.clone().sub(y.clone().multiplyScalar(side.dot(y))).normalize()
  const z = new THREE.Vector3().crossVectors(x, y).normalize()
  return new THREE.Matrix4().makeBasis(x, y, z)
}

export async function createHandScene(canvas: HTMLCanvasElement, modelUrl: string): Promise<HandScene> {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.toneMapping = THREE.ACESFilmicToneMapping

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(30, 1, 0.01, 2)

  scene.add(new THREE.HemisphereLight(0xfff4e8, 0x2a2440, 1.1))
  const sun = new THREE.DirectionalLight(0xffffff, 2.2)
  sun.position.set(-0.08, 0.12, 0.35)
  sun.castShadow = true
  sun.shadow.mapSize.set(1024, 1024)
  sun.shadow.camera.left = -0.15
  sun.shadow.camera.right = 0.15
  sun.shadow.camera.top = 0.12
  sun.shadow.camera.bottom = -0.12
  sun.shadow.bias = -0.0005
  sun.shadow.radius = 4
  scene.add(sun)

  // ---------- braço ----------
  const neck = new THREE.Group()
  scene.add(neck)
  let neckFirst = -1
  function buildNeck(first: number) {
    if (first === neckFirst) return
    neckFirst = first
    neck.clear()
    const x0 = fretPos(first - 1)
    const x1 = fretPos(first + 4) + 0.012
    const len = x1 - x0 + 0.03
    const board = new THREE.Mesh(
      new THREE.BoxGeometry(len, NECK_HALF * 2, 0.006),
      new THREE.MeshStandardMaterial({ color: 0x3b2316, roughness: 0.85 }),
    )
    board.position.set((x0 + x1) / 2 - 0.006, 0, -0.003)
    board.receiveShadow = true
    neck.add(board)
    // cabeça/pestana
    if (first === 1) {
      const nut = new THREE.Mesh(new THREE.BoxGeometry(0.005, NECK_HALF * 2, 0.008), new THREE.MeshStandardMaterial({ color: 0xf1e8d0, roughness: 0.4 }))
      nut.position.set(fretPos(0) - 0.0025, 0, 0.001)
      nut.castShadow = true
      neck.add(nut)
      const head = new THREE.Mesh(new THREE.BoxGeometry(0.05, NECK_HALF * 2.3, 0.012), new THREE.MeshStandardMaterial({ color: 0x24150d, roughness: 0.6 }))
      head.position.set(fretPos(0) - 0.03, 0, -0.004)
      neck.add(head)
    }
    const metal = new THREE.MeshStandardMaterial({ color: 0xd8dbe2, metalness: 0.9, roughness: 0.25 })
    for (let n = Math.max(1, first); n <= first + 4; n++) {
      const fret = new THREE.Mesh(new THREE.CylinderGeometry(0.0009, 0.0009, NECK_HALF * 2, 10), metal)
      fret.position.set(fretPos(n), 0, 0.0005)
      fret.castShadow = true
      neck.add(fret)
    }
    const inlay = new THREE.MeshStandardMaterial({ color: 0xe8dcc4, roughness: 0.5 })
    for (const m of [3, 5, 7, 9]) {
      if (m < first || m > first + 4) continue
      const dot = new THREE.Mesh(new THREE.CylinderGeometry(0.0028, 0.0028, 0.0005, 24), inlay)
      dot.rotation.x = Math.PI / 2
      dot.position.set((fretPos(m - 1) + fretPos(m)) / 2, 0, 0.0001)
      neck.add(dot)
    }
    for (let s = 1; s <= 6; s++) {
      const r = 0.00025 + s * 0.00009
      const str = new THREE.Mesh(
        new THREE.CylinderGeometry(r, r, len + 0.06, 8),
        new THREE.MeshStandardMaterial({ color: s >= 4 ? 0xd2ad6b : 0xe4e6ec, metalness: 0.85, roughness: 0.3 }),
      )
      str.rotation.z = Math.PI / 2
      str.position.set((x0 + x1) / 2, stringY(s), STRING_Z)
      str.castShadow = true
      neck.add(str)
    }
  }

  // ---------- mão ----------
  const gltf = await new GLTFLoader().loadAsync(modelUrl)
  const root = gltf.scene
  scene.add(root)
  const bones = new Map<string, THREE.Object3D>()
  root.traverse((o) => {
    if ((o as THREE.Bone).isBone || /finger|thumb|wrist/.test(o.name)) bones.set(o.name, o)
    const mesh = o as THREE.SkinnedMesh
    if (mesh.isSkinnedMesh) {
      mesh.material = new THREE.MeshStandardMaterial({ color: 0xe0a985, roughness: 0.55, metalness: 0 })
      mesh.castShadow = true
      mesh.frustumCulled = false
    }
  })

  // direção de cada osso (para o próximo) e um vetor lateral, no referencial do próprio osso
  const rest = new Map<string, BoneRest>()
  const restPos = new Map<string, V>()
  bones.forEach((b, name) => restPos.set(name, b.position.clone()))
  const chains: string[][] = [...FINGERS.map((f) => JOINTS.map((j) => `${f}-finger-${j}`)), THUMB]
  const spreadRest = restPos.get('pinky-finger-metacarpal')!.clone().sub(restPos.get('index-finger-metacarpal')!).normalize()
  for (const chain of chains) {
    for (let i = 0; i < chain.length; i++) {
      const b = bones.get(chain[i])
      if (!b) continue
      const next = restPos.get(chain[Math.min(i + 1, chain.length - 1)])!
      const prev = restPos.get(chain[Math.max(i - 1, 0)])!
      const dir = i < chain.length - 1 ? next.clone().sub(restPos.get(chain[i])!) : restPos.get(chain[i])!.clone().sub(prev)
      const inv = b.quaternion.clone().invert()
      rest.set(chain[i], { bone: b, localDir: dir.normalize().applyQuaternion(inv), localSide: spreadRest.clone().applyQuaternion(inv) })
    }
  }
  const segLen = (chain: string[], i: number) => restPos.get(chain[i + 1])!.distanceTo(restPos.get(chain[i])!)
  const wristRest = rest.get('wrist') ?? null
  const wristBone = bones.get('wrist')!
  const wristRestQ = wristBone.quaternion.clone()

  function orient(name: string, pos: V, next: V, side: V) {
    const r = rest.get(name)
    if (!r) return
    r.bone.position.copy(pos)
    const mWorld = basis(next.clone().sub(pos), side)
    const mLocal = basis(r.localDir, r.localSide)
    const q = new THREE.Quaternion().setFromRotationMatrix(mWorld.multiply(mLocal.clone().invert()))
    r.bone.quaternion.copy(q)
  }

  /** 2 elos (a, b) do ponto P até D, dobrando para "up". */
  function twoLink(P: V, D: V, a: number, b: number, up: V): V {
    const d = Math.min(P.distanceTo(D), a + b - 1e-4)
    const dir = D.clone().sub(P).normalize()
    const cos = (a * a + d * d - b * b) / (2 * a * d)
    const ang = Math.acos(Math.max(-1, Math.min(1, cos)))
    const n = up.clone().sub(dir.clone().multiplyScalar(up.dot(dir))).normalize()
    return P.clone().add(dir.clone().multiplyScalar(Math.cos(ang) * a)).add(n.multiplyScalar(Math.sin(ang) * a))
  }

  // pose atual e alvo (para animar a troca de acorde)
  let current: Map<string, V> | null = null
  let target: Map<string, V> = new Map()
  let used: { finger: number; tip: V }[] = []
  let anim = 0

  function computePose(shape: ChordShape | undefined, first: number) {
    const pose = new Map<string, V>()
    const press = (fret: number, str: number) => new THREE.Vector3(fretPos(fret) - (fretPos(fret) - fretPos(fret - 1)) * 0.3, stringY(str), STRING_Z + 0.0065)
    const tips = new Map<number, { tip: V; barre?: { from: number; to: number } }>()
    if (shape) {
      for (const b of shape.barres ?? []) tips.set(b.finger, { tip: press(b.fret, b.toString), barre: { from: b.fromString, to: b.toString } })
      shape.frets.forEach((fret, i) => {
        const f = shape.fingers[i]
        if (fret > 0 && f && !tips.has(f)) tips.set(f, { tip: press(fret, 6 - i) })
      })
    }
    used = [...tips.entries()].map(([finger, t]) => ({ finger, tip: t.barre ? press(0, 0).set(t.tip.x, (stringY(t.barre.from) + stringY(t.barre.to)) / 2, t.tip.z) : t.tip }))
    const xs = [...tips.values()].map((t) => t.tip.x)
    const center = xs.length ? (Math.min(...xs) + Math.max(...xs)) / 2 : (fretPos(first) + fretPos(first + 1)) / 2
    // nós dos dedos: abaixo da borda da corda 1, um pouco acima da madeira
    const KNUCKLE_GAP = 0.0185
    const baseX = center - KNUCKLE_GAP * 1.2
    const up = new THREE.Vector3(0, 0, 1)
    FINGERS.forEach((fname, fi) => {
      const f = fi + 1
      const chain = JOINTS.map((j) => `${fname}-finger-${j}`)
      const K = new THREE.Vector3(baseX + fi * KNUCKLE_GAP, -NECK_HALF - 0.012 - fi * 0.002, 0.016 - fi * 0.001)
      const meta = K.clone().add(new THREE.Vector3(0.012 + fi * 0.004, -0.055, -0.012))
      const lp = segLen(chain, 1)
      const li = segLen(chain, 2)
      const ld = segLen(chain, 3)
      const t = tips.get(f)
      let I: V, D: V, T: V
      if (t?.barre) {
        // pestana: dedo deitado sobre as cordas, ao longo da casa
        T = t.tip.clone().setY(stringY(t.barre.from) - 0.002).setZ(STRING_Z + 0.006)
        D = T.clone().setY(T.y - ld)
        I = D.clone().setY(D.y - li)
        I.z += 0.001
      } else if (t) {
        T = t.tip.clone()
        // ponta desce quase reta na corda (dedo arqueado), inclinada em direção ao nó
        const toK = K.clone().sub(T).setZ(0).normalize()
        D = T.clone().add(new THREE.Vector3(0, 0, ld * 0.82)).add(toK.multiplyScalar(ld * 0.55))
        I = twoLink(K, D, lp, li, up)
      } else {
        // dedo livre: recolhido, acima da borda do braço
        I = K.clone().add(new THREE.Vector3(0.001, 0.016, 0.02))
        D = I.clone().add(new THREE.Vector3(0, 0.005, -0.013))
        T = D.clone().add(new THREE.Vector3(0, -0.002, -0.007))
      }
      pose.set(chain[0], meta)
      pose.set(chain[1], K)
      pose.set(chain[2], I)
      pose.set(chain[3], D)
      pose.set(chain[4], T)
    })
    // polegar atrás do braço (escondido pela madeira)
    const idxMeta = pose.get('index-finger-metacarpal')!
    const tb = idxMeta.clone().add(new THREE.Vector3(-0.022, 0.012, -0.02))
    pose.set('thumb-metacarpal', tb)
    pose.set('thumb-phalanx-proximal', tb.clone().add(new THREE.Vector3(-0.012, 0.025, -0.006)))
    pose.set('thumb-phalanx-distal', tb.clone().add(new THREE.Vector3(-0.016, 0.05, -0.01)))
    pose.set('thumb-tip', tb.clone().add(new THREE.Vector3(-0.017, 0.07, -0.012)))
    const wrist = idxMeta.clone().add(pose.get('pinky-finger-metacarpal')!).multiplyScalar(0.5).add(new THREE.Vector3(0.008, -0.03, -0.004))
    pose.set('wrist', wrist)
    return pose
  }

  function applyPose(pose: Map<string, V>) {
    const side = pose.get('pinky-finger-phalanx-proximal')!.clone().sub(pose.get('index-finger-phalanx-proximal')!).normalize()
    for (const chain of chains) {
      for (let i = 0; i < chain.length; i++) {
        const p = pose.get(chain[i])
        if (!p) continue
        const next = i < chain.length - 1 ? pose.get(chain[i + 1])! : p.clone().add(p.clone().sub(pose.get(chain[i - 1])!))
        orient(chain[i], p, next, side)
      }
    }
    const w = pose.get('wrist')!
    wristBone.position.copy(w)
    if (wristRest) {
      const mid = pose.get('middle-finger-metacarpal')!
      orient('wrist', w, mid, side)
    } else wristBone.quaternion.copy(wristRestQ)
  }

  function lerpPose(a: Map<string, V>, b: Map<string, V>, t: number) {
    const out = new Map<string, V>()
    b.forEach((v, k) => out.set(k, (a.get(k) ?? v).clone().lerp(v, t)))
    return out
  }

  function frameCamera() {
    // enquadra o braço (5 casas) na largura e a mão na altura, para qualquer proporção
    const x0 = fretPos(neckFirst - 1) - (neckFirst === 1 ? 0.02 : 0.006)
    const x1 = fretPos(neckFirst + 4) + 0.004
    const cx = (x0 + x1) / 2
    const halfW = (x1 - x0) / 2
    const top = NECK_HALF + 0.006
    const bottom = -0.085
    const cy = (top + bottom) / 2
    const halfH = (top - bottom) / 2
    const t = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))
    const dist = Math.max(halfH / t, halfW / (t * camera.aspect)) * 1.02
    camera.position.set(cx, cy - dist * 0.08, dist)
    camera.up.set(0, 1, 0)
    camera.lookAt(cx, cy, 0)
  }

  let raf = 0
  function render() {
    renderer.render(scene, camera)
  }
  function tick() {
    anim = Math.min(1, anim + 0.09)
    const e = 1 - Math.pow(1 - anim, 3)
    applyPose(current ? lerpPose(current, target, e) : target)
    render()
    if (anim < 1) raf = requestAnimationFrame(tick)
    else current = target
  }

  return {
    setShape(shape, firstFret) {
      buildNeck(firstFret)
      frameCamera()
      const next = computePose(shape, firstFret)
      if (current) {
        // começa a animação a partir da pose em que está agora
        current = target.size ? lerpPose(current, target, 1 - Math.pow(1 - anim, 3)) : current
      }
      target = next
      if (!current) current = next
      anim = 0
      cancelAnimationFrame(raf)
      tick()
    },
    resize(w, h) {
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.fov = 30
      camera.updateProjectionMatrix()
      if (neckFirst > 0) frameCamera()
      render()
    },
    tipScreen() {
      const size = renderer.getSize(new THREE.Vector2())
      return used.map((u) => {
        const p = u.tip.clone().project(camera)
        return { finger: u.finger, x: ((p.x + 1) / 2) * size.x, y: ((1 - p.y) / 2) * size.y }
      })
    },
    stringScreen() {
      const size = renderer.getSize(new THREE.Vector2())
      const x = fretPos(neckFirst - 1) - (neckFirst === 1 ? 0.012 : 0.004)
      return [6, 5, 4, 3, 2, 1].map((str) => {
        const p = new THREE.Vector3(x, stringY(str), STRING_Z).project(camera)
        return { str, x: ((p.x + 1) / 2) * size.x, y: ((1 - p.y) / 2) * size.y }
      })
    },
    dispose() {
      cancelAnimationFrame(raf)
      renderer.dispose()
    },
  }
}
