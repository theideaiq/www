'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment, OrbitControls, PerspectiveCamera, Float, Text } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import * as THREE from 'three';
import * as Tone from 'tone';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { Loader2, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/Button';

// --- Configuration ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// An Iraqi Maqam-inspired scale (approximated for Western synth) for harmonious sounds
const SCALE = ['C3', 'D3', 'Eb3', 'F3', 'G3', 'Ab3', 'B3', 'C4', 'D4', 'Eb4', 'F4', 'G4'];
const BRAND_COLORS = ['#E91E63', '#FFD600', '#FFD600', '#E91E63']; // Pink & Yellow

interface SonicNode {
  id: string;
  position: [number, number, number];
  color: string;
  note: string;
  timestamp: number;
}

// --- 3D Components ---

// The glowing orb representing a user's click
function Node({ position, color }: { position: [number, number, number], color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  useFrame((state) => {
    if (ref.current) {
        // Slight breathing animation
        const t = state.clock.getElapsedTime();
        ref.current.scale.setScalar(1 + Math.sin(t * 2 + position[0]) * 0.05);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh 
        ref={ref} 
        position={position} 
        onPointerOver={() => setHover(true)} 
        onPointerOut={() => setHover(false)}
      >
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color} 
          emissiveIntensity={hovered ? 4 : 2} // Glow brighter on hover
          toneMapped={false} 
        />
      </mesh>
      {/* Subtle point light radiating from the node */}
      <pointLight position={position} intensity={0.5} distance={2} color={color} />
    </Float>
  );
}

// Lines connecting nearby nodes to form constellations
function Connections({ nodes }: { nodes: SonicNode[] }) {
    const lineRef = useRef<any>(null);
    // Don't draw lines if too many nodes (performance)
    if (nodes.length > 50 || nodes.length < 2) return null;

    const points: THREE.Vector3[] = [];
    // Simple logic: connect each node to the next one in the array
    for (let i = 0; i < nodes.length - 1; i++) {
        points.push(new THREE.Vector3(...nodes[i].position));
        points.push(new THREE.Vector3(...nodes[i+1].position));
    }

    if(points.length === 0) return null;

    return (
        <lineSegments>
            <bufferGeometry onUpdate={self => self.setFromPoints(points)} />
            <lineBasicMaterial color="#ffffff" opacity={0.1} transparent />
        </lineSegments>
    )
}

// The invisible plane that detects clicks/touches
function ClickPlane({ onPlaceNode }: { onPlaceNode: (pos: THREE.Vector3) => void }) {
  return (
    <mesh 
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -2, 0]} 
      // FIX: Use onPointerDown for instant mobile response
      onPointerDown={(e) => {
        e.stopPropagation(); // Stop camera from stealing the touch
        onPlaceNode(e.point);
      }}
    >
      <planeGeometry args={[100, 100]} />
      {/* FIX: Must be transparent (not visible=false) to detect raycasts */}
      <meshBasicMaterial color="black" transparent opacity={0} />
    </mesh>
  );
}

// --- Main Page Component ---

export default function SonicEcosystemPage() {
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [muted, setMuted] = useState(false);
  const [nodes, setNodes] = useState<SonicNode[]>([]);
  
  // Tone.js Synths Refs
  const synthRef = useRef<Tone.PolySynth | null>(null);
  const reverbRef = useRef<Tone.Reverb | null>(null);

  // 1. Initialize Audio & Fetch Initial Data
  useEffect(() => {
    async function init() {
        // Setup Synth
        reverbRef.current = new Tone.Reverb({ decay: 5, wet: 0.3 }).toDestination();
        synthRef.current = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: 'sine' },
            envelope: { attack: 0.01, decay: 0.5, sustain: 0.1, release: 2 }
        }).connect(reverbRef.current);
        synthRef.current.volume.value = -6;

        // Fetch existing nodes
        const { data, error } = await supabase
            .from('sonic_nodes')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(100);

        if (!error && data) {
            const formattedNodes = data.map((dbNode: any) => ({
                id: dbNode.id,
                // FIX: TypeScript Tuple Casting
                position: [dbNode.position.x, dbNode.position.y, dbNode.position.z] as [number, number, number],
                color: BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)],
                note: dbNode.note,
                timestamp: Date.parse(dbNode.created_at)
            }));
            // FIX: Ensure reverse() doesn't cause type issues
            setNodes(formattedNodes.reverse()); 
        }
        setLoading(false);
    }
    init();

    return () => {
        synthRef.current?.dispose();
        reverbRef.current?.dispose();
    };
  }, []);


  // 2. Handle User Interaction (Start Experience)
  const handleStart = async () => {
    try {
        await Tone.start();
        Tone.Transport.start();
    } catch (e) {
        console.warn("Audio Context failed to start (normal in some browsers)", e);
    }
    
    setStarted(true);
    // Play a welcoming chord
    synthRef.current?.triggerAttackRelease(['C3', 'G3', 'C4'], '2n');
  };

  // 3. Handle Placing a New Node
  const handlePlaceNode = async (point: THREE.Vector3) => {
    if (muted) return;

    // Calculate note based on X position
    const noteIndex = Math.floor(((point.x + 10) / 20) * SCALE.length);
    const clampedIndex = Math.max(0, Math.min(SCALE.length - 1, noteIndex));
    const note = SCALE[clampedIndex];
    const color = BRAND_COLORS[clampedIndex % BRAND_COLORS.length];

    // Play sound
    synthRef.current?.triggerAttackRelease(note, '8n');

    const newNode: SonicNode = {
      id: uuidv4(),
      position: [point.x, point.y + Math.random() * 2, point.z], // Add slight Y variation
      color: color,
      note: note,
      timestamp: Date.now()
    };

    // Optimistic UI update
    setNodes((prev) => [...prev, newNode]);

    // Save to database
    await supabase.from('sonic_nodes').insert({
        id: newNode.id,
        position: { x: newNode.position[0], y: newNode.position[1], z: newNode.position[2] },
        note: newNode.note
    });
  };

  return (
    <div className="h-screen w-full bg-[#05070a] overflow-hidden relative cursor-crosshair">
        
        {/* 1. THE 3D CANVAS */}
        <Canvas shadows gl={{ antialias: false }} dpr={[1, 2]}>
            <color attach="background" args={['#05070a']} />
            <fog attach="fog" args={['#05070a', 10, 50]} />
            <PerspectiveCamera makeDefault position={[0, 2, 15]} fov={50} />
            
            <Suspense fallback={null}>
                <Environment preset="night" />
                <ambientLight intensity={0.2} />
                
                {/* The Interactive Elements */}
                <group>
                    {nodes.map((node) => (
                        <Node key={node.id} position={node.position} color={node.color} />
                    ))}
                    <Connections nodes={nodes} />
                    {started && <ClickPlane onPlaceNode={handlePlaceNode} />}
                </group>

                 {/* Floating Brand Text */}
                <Float speed={1} rotationIntensity={0.1} floatIntensity={0.2} position={[0, 6, -10]}>
                    <Text
                        font="/fonts/Inter-Bold.woff" // Ensure this font exists or remove this line
                        fontSize={2}
                        color="#ffffff"
                        anchorX="center"
                        anchorY="middle"
                        maxWidth={10}
                        textAlign="center"
                    >
                        THE IDEA ECOSYSTEM
                        <meshStandardMaterial 
                            color="white" 
                            emissive="#E91E63"
                            emissiveIntensity={0.5}
                            toneMapped={false}
                        />
                    </Text>
                </Float>

                {/* FIX: Removed disableNormalPass */}
                <EffectComposer>
                    <Bloom luminanceThreshold={1} intensity={1.5} levels={9} mipmapBlur />
                    <Noise opacity={0.05} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                </EffectComposer>

                <OrbitControls 
                    enabled={started}
                    enableZoom={true} 
                    enablePan={false}
                    maxPolarAngle={Math.PI / 1.8} 
                    minPolarAngle={Math.PI / 3}
                    maxDistance={30}
                    minDistance={5}
                    autoRotate={!started}
                    autoRotateSpeed={0.5}
                />
            </Suspense>
        </Canvas>
        
        {/* 2. UI OVERLAYS */}
        <AnimatePresence>
            {/* Loading Screen */}
            {loading && (
                <motion.div 
                    initial={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 bg-[#05070a] flex items-center justify-center"
                >
                    <Loader2 className="text-brand-pink animate-spin" size={40} />
                </motion.div>
            )}

            {/* Start Screen */}
            {!started && !loading && (
                <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, pointerEvents: 'none' }}
                    className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm text-white p-4 text-center"
                >
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-yellow">
                            SONIC ECOSYSTEM
                        </span>
                    </h1>
                    <p className="text-slate-300 max-w-md text-lg mb-10 leading-relaxed">
                        Every idea is a frequency. Every connection is a harmony. <br/>
                        Enter the collective digital soundscape of Iraq.
                    </p>
                    <Button 
                        onClick={handleStart} 
                        className="h-16 px-12 text-xl rounded-full bg-white text-black hover:bg-brand-yellow transition-transform hover:scale-105"
                    >
                        Enter Experience <Volume2 className="ml-4" />
                    </Button>
                    <p className="text-slate-500 text-sm mt-6">Recommended: Headphones</p>
                </motion.div>
            )}
        </AnimatePresence>

        {/* Minimal HUD */}
        {started && (
             <motion.div 
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-4"
            >
                <p className="text-slate-400 text-sm uppercase tracking-widest pointer-events-none">Tap to contribute your sound</p>
                 <button onClick={() => setMuted(!muted)} className="text-slate-400 hover:text-white transition">
                    {muted ? <VolumeX /> : <Volume2 />}
                 </button>
            </motion.div>
        )}

        {/* Persistent Brand Mark */}
        <div className="absolute top-8 left-8 z-30 pointer-events-none mix-blend-difference">
            <span className="text-2xl font-black tracking-tighter text-white">
              IDEA<span className="text-brand-yellow">.</span>
            </span>
        </div>
    </div>
  );
}
