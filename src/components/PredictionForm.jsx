import React, { useState } from 'react';
import { Activity, AlertCircle, CheckCircle } from 'lucide-react';

export default function PredictionForm({ onPredict }) {
  const [inputs, setInputs] = useState({ 
    temp: '', 
    turb: '', 
    ph: '', 
    do: '', 
    tds: '' 
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs({ ...inputs, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const ph = parseFloat(inputs.ph);
      const tds = parseFloat(inputs.tds);
      const temp = parseFloat(inputs.temp);
      const turb = parseFloat(inputs.turb);
      const dissolved = parseFloat(inputs.do);

      let status, color, bg, description;

      if (ph >= 6.5 && ph <= 8.5 && tds < 500 && temp >= 15 && temp <= 30 && turb < 5 && dissolved > 6) {
        status = 'Excellent';
        color = 'text-green-400';
        bg = 'bg-green-500/20 border-green-500/30';
        description = 'Water quality is optimal for all uses.';
      } else if (ph >= 6 && ph <= 9 && tds < 1000 && temp >= 10 && temp <= 35 && turb < 10 && dissolved > 4) {
        status = 'Average';
        color = 'text-yellow-400';
        bg = 'bg-yellow-500/20 border-yellow-500/30';
        description = 'Water quality is acceptable but needs monitoring.';
      } else {
        status = 'Poor / Dangerous';
        color = 'text-red-400';
        bg = 'bg-red-500/20 border-red-500/30';
        description = 'Water quality is unsafe. Immediate action required!';
      }

      setResult({ status, color, bg, description });
      setLoading(false);

      if (onPredict) {
        onPredict({ inputs, result: { status, color, bg, description } });
      }
    }, 800);
  };

  const parameters = [
    { name: 'temp', label: 'Temperature', unit: '°C', placeholder: '0-50', min: 0, max: 50 },
    { name: 'turb', label: 'Turbidity', unit: 'NTU', placeholder: '0-10', min: 0, max: 100 },
    { name: 'ph', label: 'pH Level', unit: '', placeholder: '6-8', min: 0, max: 14 },
    { name: 'do', label: 'Dissolved Oxygen', unit: 'mg/L', placeholder: '0-15', min: 0, max: 15 },
    { name: 'tds', label: 'TDS (Total Dissolved Solids)', unit: 'ppm', placeholder: '0-2000', min: 0, max: 5000 },
  ];

  return (
    <div className="max-w-2xl mx-auto bg-slate-900 p-8 rounded-3xl border border-white/10 shadow-2xl animate-in zoom-in duration-300">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="text-blue-400" size={28} />
        <h2 className="text-2xl font-bold">Analyze Water Samples</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Parameter Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {parameters.map((param) => (
            <div key={param.name} className="flex flex-col gap-2">
              <label className="text-xs uppercase font-bold text-slate-400 ml-1">
                {param.label} <span className="text-slate-500">({param.unit})</span>
              </label>
              <input
                type="number"
                name={param.name}
                required
                min={param.min}
                max={param.max}
                step="0.1"
                value={inputs[param.name]}
                onChange={handleInputChange}
                className="bg-slate-800 border border-white/10 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-slate-200 placeholder:text-slate-600"
                placeholder={param.placeholder}
              />
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 py-4 rounded-xl font-bold text-lg transition shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
        >
          <Activity size={20} />
          {loading ? 'Analyzing...' : 'Run AI Prediction'}
        </button>
      </form>

      {/* Result Display */}
      {result && (
        <div className={`mt-8 p-6 rounded-2xl border border-white/20 text-center ${result.bg} animate-in slide-in-from-bottom duration-300`}>
          <div className="flex items-center justify-center gap-3 mb-3">
            {result.status === 'Excellent' && <CheckCircle className="text-green-400" size={32} />}
            {result.status === 'Average' && <Activity className="text-yellow-400" size={32} />}
            {result.status === 'Poor / Dangerous' && <AlertCircle className="text-red-400" size={32} />}
            <h3 className={`text-3xl font-black ${result.color}`}>{result.status}</h3>
          </div>
          <p className="text-slate-300 text-sm">{result.description}</p>

          {/* Parameter Summary */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
            {parameters.map((param) => (
              <div key={param.name} className="bg-white/5 p-3 rounded-lg">
                <p className="text-slate-500 mb-1">{param.label}</p>
                <p className="font-bold text-slate-200">{inputs[param.name]} {param.unit}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
