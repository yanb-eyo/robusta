import React from 'react';
import {
  LineChart,
  BarChart,
  PieChart,
  ScatterChart,
  AreaChart,
  Line,
  Bar,
  Pie,
  Scatter,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'area';
  title?: string;
  data: any[];
  xKey?: string;
  yKey?: string;
  keys?: string[];
  colors?: string[];
}

const DEFAULT_COLORS = [
  '#8884d8',
  '#82ca9d',
  '#ffc658',
  '#ff7c7c',
  '#8dd1e1',
  '#d084d0',
];

export const ChartRenderer: React.FC<{ chartData: ChartData }> = ({ chartData }) => {
  const colors = chartData.colors || DEFAULT_COLORS;

  const renderChart = () => {
    const commonProps = {
      width: 500,
      height: 300,
      data: chartData.data,
      margin: { top: 5, right: 30, left: 0, bottom: 5 },
    };

    switch (chartData.type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chartData.xKey || 'name'} />
              <YAxis />
              <Tooltip />
              <Legend />
              {(chartData.keys || ['value']).map((key, idx) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={colors[idx % colors.length]}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chartData.xKey || 'name'} />
              <YAxis />
              <Tooltip />
              <Legend />
              {(chartData.keys || ['value']).map((key, idx) => (
                <Bar
                  key={key}
                  dataKey={key}
                  fill={colors[idx % colors.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'area':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chartData.xKey || 'name'} />
              <YAxis />
              <Tooltip />
              <Legend />
              {(chartData.keys || ['value']).map((key, idx) => (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  fill={colors[idx % colors.length]}
                  stroke={colors[idx % colors.length]}
                  fillOpacity={0.6}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.data}
                dataKey={chartData.yKey || 'value'}
                nameKey={chartData.xKey || 'name'}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {chartData.data.map((_, idx) => (
                  <Cell key={`cell-${idx}`} fill={colors[idx % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart
              data={chartData.data}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={chartData.xKey || 'x'} />
              <YAxis dataKey={chartData.yKey || 'y'} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter
                name={chartData.title || 'Data'}
                data={chartData.data}
                fill={colors[0]}
              />
            </ScatterChart>
          </ResponsiveContainer>
        );

      default:
        return <div>Unknown chart type: {chartData.type}</div>;
    }
  };

  return (
    <div style={{ width: '100%', margin: '16px 0' }}>
      {chartData.title && (
        <h3 style={{ marginBottom: '12px', color: '#333' }}>{chartData.title}</h3>
      )}
      {renderChart()}
    </div>
  );
};
