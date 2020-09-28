import * as THREE from 'three'
import React, { useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from 'react-three-fiber'
import './App.css';

function Vert({w}) {
  const vertices = [[-w, 0, 0], [0, w, 0], [w, 0, 0], [0, -w, 0], [-w, 0, 0]]
  return (
    <line>
      <geometry attach="geometry" vertices={vertices.map(v => new THREE.Vector3(...v))} />
      <lineBasicMaterial attach="material" color="white" />
    </line>
  )
}

function Box(props) {
  // This reference will give us direct access to the mesh
  const mesh = useRef()

  // Rotate mesh every frame, this is outside of React without overhead
  //useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01))

  return (
    <mesh
      ref={mesh} >
      <boxBufferGeometry attach="geometry" args={[-10, 5, 5]} />
      <meshStandardMaterial attach="material" roughness={0.5} color="#575757" />
    </mesh>
  )
}

function Sphere(props) {
  // This reference will give us direct access to the mesh
  let count = 1;
  const mesh = useRef()
  let inc = 0;

  const { size, viewport } = useThree()
  //const aspect = size.width / viewport.width

  const dummy = useMemo(() => new THREE.Object3D(), [])
  //const geo = useMemo(() => new THREE.EdgesGeometry())

  const p = useMemo(() => {
    const temp = []

    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100
      const speed   = 0.01 + Math.random() / 200
      const factor  =  20  + Math.random() * 100
      const xFactor = -50  + Math.random() * 100
      const yFactor = -50  + Math.random() * 100
      //const zFactor = -50  + Math.random() * 100
      const zFactor = 0

      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 })
    }

      //test
      console.log(temp)
    return temp
  }, [count])
  //test
  console.log(p)

  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false)
  const [active, setActive] = useState(false)
  const [act, setAct]       = useState(false)

  // Rotate mesh every frame, this is outside of React without overhead

  useFrame(() => {
    inc += 0.02;
    p.forEach((p, i) => {
     let { t, factor, speed, xFactor, yFactor, zFactor } = p; // destruc
     t = p.t += speed / 2;
     const a = Math.cos(t) + Math.sin(t * 1) / 10 + (Math.cos(t * 2));
     const b = Math.sin(t) + Math.cos(t * 2) / 10;
     const s = Math.cos(t);

     // Update the dummy object
     dummy.position.set(
        (p.mx / 10) * t +  Math.sin(t * 2) * (Math.sin(inc) * 2),
        (p.mx / 10) * t +  Math.cos(t * 2) * (Math.sin(inc) * 2),
     )
     dummy.scale.set(.1, .1, .1);
     dummy.rotation.set(s * 5, s * 5, s * 5);
     dummy.updateMatrix();

     // And apply the matrix to the instanced item
     mesh.current.setMatrixAt(i, dummy.matrix);
    })

    //mesh.current.rotation.z += .01;
    mesh.current.instanceMatrix.needsUpdate = true;
  })

  return (
    <>
      <instancedMesh ref={mesh} args={[null, null, count]}>
        <dodecahedronBufferGeometry attach="geometry" args={[7]} />
        <meshPhongMaterial attach="material" color="white" />
      </instancedMesh>
    </>
  )
}

function Box2() {
  const ref = useRef();
  const count = 2;
  

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <boxBufferGeometry attach="geometry" args={[2, 2, 2]} />
      <meshStandardMaterial attach="material" roughness={0.5} color="#575757" />
    </mesh>
  )

}

function Obj() {
  let time = 0;
  const mesh = useRef();

  const dummy = useMemo(() => new THREE.Object3D(), [])
  
  const p = [
    { 
      mx: -2, my: 0, color: "green" 
    },
    { 
      mx: 0, my: 0, color: "red" 
    },
    {
      mx: 2, my: 0, color: "blue" 
    }
  ];

  useFrame(() => { 
    time += 0.01
    // i will inc to size of array
    p.forEach((p, i) => {
      dummy.position.set(
        p.mx, p.my
     )
     dummy.scale.set(.7, .7, .7);
     dummy.rotation.set(0, time, 0)
     dummy.updateMatrix();

     // And apply the matrix to the instanced item
     mesh.current.setMatrixAt(i, dummy.matrix)
    })
    mesh.current.instanceMatrix.needsUpdate = true
    mesh.current.rotation.y += 0.01 // this 
  })

  return (
    <instancedMesh ref={mesh} args={[null, null, 3]}>
      <sphereBufferGeometry attach="geometry" args={[1, 10, 10]} />
      <meshPhongMaterial attach="material" color="yellow" />
    </instancedMesh>
  )
}

export default function App() {
  return (
    <Canvas 
      colorManagement
      camera={{ fov: 75, position: [0, 5, 0] }}
    >
      <ambientLight intensity={3} />
      <pointLight color="white" position={[0, 0, 0]} intensity={2.2} />
      <Obj />
    </Canvas>
  )
}