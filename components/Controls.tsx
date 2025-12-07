import React from 'react';

interface ControlsProps {
  n2: number;
  h2: number;
  temp: number;
  setN2: (val: number) => void;
  setH2: (val: number) => void;
  setTemp: (val: number) => void;
}

const Slider: React.FC<{
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  colorClass: string;
  onChange: (val: number) => void;
  unit?: string;
}> = ({ label, value, min, max, step = 0.1, colorClass, onChange, unit }) => (
  <div className="flex flex-col gap-1 mb-4">
    <div className="flex justify-between items-end">
        <label className={`font-semibold text-sm ${colorClass}`}>{label}</label>
        <span className="text-xs font-mono text-slate-400">{value.toFixed(2)} {unit}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
    />
  </div>
);

const Controls: React.FC<ControlsProps> = ({ n2, h2, temp, setN2, setH2, setTemp }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-xl h-full">
      <h2 className="text-lg font-bold text-white mb-6 border-b border-slate-700 pb-2">
        反应条件控制
      </h2>
      
      <Slider 
        label="氮气浓度 [N₂]" 
        value={n2} 
        min={0} 
        max={3.0} 
        colorClass="text-blue-400"
        onChange={setN2}
        unit="M"
      />
      
      <Slider 
        label="氢气浓度 [H₂]" 
        value={h2} 
        min={0} 
        max={3.0} 
        colorClass="text-slate-300"
        onChange={setH2}
        unit="M"
      />

      <div className="my-6 border-t border-slate-700" />

      <Slider 
        label="体系温度 (T)" 
        value={temp} 
        min={0.8} 
        max={3.0} 
        step={0.05}
        colorClass="text-orange-400"
        onChange={setTemp}
        unit="arb. units"
      />

      <div className="mt-4 p-3 bg-slate-900/50 rounded text-xs text-slate-400 leading-relaxed">
        <strong className="text-slate-300 block mb-1">观察要点:</strong>
        <ul className="list-disc pl-4 space-y-1">
            <li>增加 <strong>N₂</strong> 或 <strong>H₂</strong>：正反应速率加快，平衡向右移动，生成更多 NH₃。</li>
            <li>升高 <strong>温度</strong>：平衡向左移动（放热反应），NH₃ 浓度降低。</li>
            <li>观察滑块：随着反应物被消耗，浓度滑块会自动下降！</li>
        </ul>
      </div>
    </div>
  );
};

export default Controls;