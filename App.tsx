import React, { useState, useEffect, useRef } from 'react';
import SimulationCanvas from './components/SimulationCanvas';
import ChartPanel from './components/ChartPanel';
import Controls from './components/Controls';
import { SimulationState, DataPoint } from './types';
import { calculateRate } from './utils/chemistry';
import { HISTORY_LENGTH, SIMULATION_SPEED } from './constants';

const App: React.FC = () => {
  // Use a Ref for the simulation state to ensure the loop runs independently of React renders
  // This prevents the loop from resetting or stuttering when state updates occur.
  const simStateRef = useRef<SimulationState>({
    n2: 1.5,
    h2: 1.5,
    nh3: 0.5,
    temperature: 1.2,
  });

  // React state for rendering UI (synced from simStateRef)
  const [viewState, setViewState] = useState<SimulationState>(simStateRef.current);
  const [history, setHistory] = useState<DataPoint[]>([]);
  
  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);

  // Simulation Loop
  useEffect(() => {
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      // const deltaTime = (timestamp - lastTimeRef.current) / 1000; // Unused but good for future physics
      lastTimeRef.current = timestamp;

      // 1. Physics Step
      const { n2, h2, nh3, temperature } = simStateRef.current;
      const rate = calculateRate(n2, h2, nh3, temperature);
      const dt = 0.1 * SIMULATION_SPEED;

      let nextN2 = n2 - rate * dt;
      let nextH2 = h2 - 3 * rate * dt;
      let nextNH3 = nh3 + 2 * rate * dt;

      // Boundary checks
      if (nextN2 < 0) nextN2 = 0;
      if (nextH2 < 0) nextH2 = 0;
      if (nextNH3 < 0) nextNH3 = 0;

      // Update Ref
      simStateRef.current = {
        n2: nextN2,
        h2: nextH2,
        nh3: nextNH3,
        temperature
      };

      // 2. UI Sync (Sync React state with Ref)
      // We sync every frame for smooth sliders, but React handles the DOM diffing efficiently.
      setViewState({ ...simStateRef.current });

      // 3. History Update (Throttle to every 5 frames to avoid cluttering the chart)
      frameCountRef.current += 1;
      if (frameCountRef.current % 5 === 0) {
        setHistory(prev => {
          const newPoint: DataPoint = {
            time: frameCountRef.current,
            n2: nextN2,
            h2: nextH2,
            nh3: nextNH3
          };
          const newHistory = [...prev, newPoint];
          if (newHistory.length > HISTORY_LENGTH) {
            return newHistory.slice(newHistory.length - HISTORY_LENGTH);
          }
          return newHistory;
        });
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []); // Empty dependency array: loop runs once on mount and persists

  // Handlers for sliders
  // We update both the Ref (for immediate physics impact) and the View State (for UI feedback)
  const handleN2Change = (val: number) => {
    simStateRef.current.n2 = val;
    setViewState(prev => ({ ...prev, n2: val }));
  };
  const handleH2Change = (val: number) => {
    simStateRef.current.h2 = val;
    setViewState(prev => ({ ...prev, h2: val }));
  };
  const handleTempChange = (val: number) => {
    simStateRef.current.temperature = val;
    setViewState(prev => ({ ...prev, temperature: val }));
  };

  return (
    <div className="min-h-screen p-4 md:p-8 flex flex-col items-center gap-6">
      
      {/* Header */}
      <header className="w-full max-w-5xl text-center mb-4">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white mb-2">
          合成氨反应平衡模拟
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto">
          演示合成氨过程中的勒夏特列原理 (Le Chatelier's Principle)。 
          <br/>
          化学方程： <span className="text-blue-400 font-bold">N₂</span> + 
          <span className="text-slate-300 font-bold"> 3H₂</span> ⇌ 
          <span className="text-red-500 font-bold"> 2NH₃</span> + 热量 (ΔH &lt; 0)
        </p>
      </header>

      {/* Main Grid */}
      <main className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Left Column: Visuals */}
        <div className="md:col-span-8 flex flex-col gap-6">
          {/* Particle View */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center px-2">
                <h3 className="text-slate-300 font-semibold text-sm uppercase tracking-wider">微观粒子视图</h3>
                <div className="text-xs text-slate-500">运动速率 ~ 温度</div>
            </div>
            <SimulationCanvas 
              n2={viewState.n2} 
              h2={viewState.h2} 
              nh3={viewState.nh3} 
              temperature={viewState.temperature} 
            />
          </div>

          {/* Chart View */}
          <div className="flex flex-col gap-2">
            <h3 className="text-slate-300 font-semibold text-sm uppercase tracking-wider px-2">浓度实时曲线</h3>
            <ChartPanel data={history} />
          </div>
        </div>

        {/* Right Column: Controls */}
        <div className="md:col-span-4 flex flex-col gap-6">
          <Controls 
            n2={viewState.n2}
            h2={viewState.h2}
            temp={viewState.temperature}
            setN2={handleN2Change}
            setH2={handleH2Change}
            setTemp={handleTempChange}
          />
          
          {/* Info Card */}
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 text-sm text-slate-400">
             <h4 className="font-semibold text-slate-200 mb-2">模拟原理</h4>
             <p className="mb-2">
               本模拟基于阿伦尼乌斯方程 (Arrhenius equation) 计算动力学反应速率。
             </p>
             <div className="grid grid-cols-2 gap-2 text-xs font-mono">
               <div className="bg-slate-900 p-2 rounded">
                 Rate<sub>fwd</sub> ∝ [N₂][H₂]³
               </div>
               <div className="bg-slate-900 p-2 rounded">
                 Rate<sub>rev</sub> ∝ [NH₃]²
               </div>
             </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default App;