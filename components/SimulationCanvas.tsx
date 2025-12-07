import React, { useRef, useEffect } from 'react';
import { MoleculeType, Particle } from '../types';
import { COLORS, CANVAS_WIDTH, CANVAS_HEIGHT, PARTICLE_SCALE } from '../constants';

interface SimulationCanvasProps {
  n2: number;
  h2: number;
  nh3: number;
  temperature: number;
}

const SimulationCanvas: React.FC<SimulationCanvasProps> = ({ n2, h2, nh3, temperature }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const requestRef = useRef<number>(0);

  // Function to create a particle
  const createParticle = (type: MoleculeType): Particle => {
    return {
      id: Math.random().toString(36).substr(2, 9),
      x: Math.random() * CANVAS_WIDTH,
      y: Math.random() * CANVAS_HEIGHT,
      vx: (Math.random() - 0.5) * (0.5 + temperature * 0.2), // Speed depends on temp
      vy: (Math.random() - 0.5) * (0.5 + temperature * 0.2),
      type,
    };
  };

  // Sync particle count with state
  useEffect(() => {
    const targetCounts = {
      [MoleculeType.N2]: Math.floor(n2 * PARTICLE_SCALE),
      [MoleculeType.H2]: Math.floor(h2 * PARTICLE_SCALE),
      [MoleculeType.NH3]: Math.floor(nh3 * PARTICLE_SCALE),
    };

    const currentParticles = particlesRef.current;
    const newParticles: Particle[] = [];
    
    // Process each type to match counts
    (Object.keys(targetCounts) as MoleculeType[]).forEach((type) => {
      const existing = currentParticles.filter(p => p.type === type);
      const diff = targetCounts[type] - existing.length;

      if (diff > 0) {
        // Add more
        newParticles.push(...existing);
        for (let i = 0; i < diff; i++) {
          newParticles.push(createParticle(type));
        }
      } else if (diff < 0) {
        // Remove some (randomly or from end)
        newParticles.push(...existing.slice(0, targetCounts[type]));
      } else {
        newParticles.push(...existing);
      }
    });

    particlesRef.current = newParticles;
  }, [n2, h2, nh3]);

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      // Clear
      ctx.fillStyle = COLORS.BG;
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Update and Draw
      particlesRef.current.forEach(p => {
        // Update position
        const speedMultiplier = Math.sqrt(temperature); // Kinetic energy ~ T, so v ~ sqrt(T)
        p.x += p.vx * speedMultiplier;
        p.y += p.vy * speedMultiplier;

        // Bounce off walls
        if (p.x < 0 || p.x > CANVAS_WIDTH) p.vx *= -1;
        if (p.y < 0 || p.y > CANVAS_HEIGHT) p.vy *= -1;

        // Draw
        ctx.beginPath();
        if (p.type === MoleculeType.N2) {
            // N2: Two blue circles
            ctx.fillStyle = COLORS.N2;
            ctx.arc(p.x - 3, p.y, 4, 0, Math.PI * 2);
            ctx.arc(p.x + 3, p.y, 4, 0, Math.PI * 2);
            ctx.fill();
        } else if (p.type === MoleculeType.H2) {
            // H2: Two small grey circles
            ctx.fillStyle = COLORS.H2;
            ctx.arc(p.x - 2, p.y, 2.5, 0, Math.PI * 2);
            ctx.arc(p.x + 2, p.y, 2.5, 0, Math.PI * 2);
            ctx.fill();
        } else {
             // NH3: One large red, three small grey
             ctx.fillStyle = COLORS.NH3;
             ctx.arc(p.x, p.y, 5, 0, Math.PI * 2); // N
             ctx.fill();
             ctx.fillStyle = COLORS.H2;
             ctx.beginPath();
             ctx.arc(p.x - 4, p.y + 4, 2, 0, Math.PI * 2); // H
             ctx.arc(p.x + 4, p.y + 4, 2, 0, Math.PI * 2); // H
             ctx.arc(p.x, p.y - 5, 2, 0, Math.PI * 2); // H
             ctx.fill();
        }
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [temperature]); // Re-bind if T changes drastically or just rely on ref

  return (
    <div className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-700">
        <canvas 
            ref={canvasRef} 
            width={CANVAS_WIDTH} 
            height={CANVAS_HEIGHT} 
            className="w-full h-full block bg-slate-800"
        />
        <div className="absolute top-2 right-2 bg-slate-900/80 px-2 py-1 rounded text-xs text-slate-300 font-mono">
            粒子总数: {Math.floor((n2 + h2 + nh3) * PARTICLE_SCALE)}
        </div>
    </div>
  );
};

export default SimulationCanvas;