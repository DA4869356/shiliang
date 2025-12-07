import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DataPoint } from '../types';
import { COLORS } from '../constants';

interface ChartPanelProps {
  data: DataPoint[];
}

const ChartPanel: React.FC<ChartPanelProps> = ({ data }) => {
  return (
    <div className="h-[300px] w-full bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-xl">
      <h3 className="text-sm font-semibold text-slate-400 mb-2">浓度 - 时间变化曲线</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="time" 
            type="number" 
            domain={['dataMin', 'dataMax']} 
            hide={true} 
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={12}
            domain={[0, 4]}
            tickFormatter={(val) => val.toFixed(1)}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#1e293b', borderColor: '#475569', color: '#f1f5f9' }}
            itemStyle={{ fontSize: '12px' }}
            labelStyle={{ display: 'none' }}
            formatter={(value: number) => value.toFixed(2)}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }}/>
          <Line 
            type="monotone" 
            dataKey="n2" 
            name="[N₂] 氮气" 
            stroke={COLORS.N2} 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={false}
          />
          <Line 
            type="monotone" 
            dataKey="h2" 
            name="[H₂] 氢气" 
            stroke={COLORS.H2} 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={false}
          />
          <Line 
            type="monotone" 
            dataKey="nh3" 
            name="[NH₃] 氨气" 
            stroke={COLORS.NH3} 
            strokeWidth={2} 
            dot={false} 
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartPanel;