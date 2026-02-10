export interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'scatter' | 'area';
  title?: string;
  data: any[];
  xKey?: string;
  yKey?: string;
  keys?: string[];
  colors?: string[];
}

export const extractChartData = (content: string): ChartData | null => {
  // Look for chart data wrapped in special markers
  const chartMatch = content.match(/```chart\n([\s\S]*?)\n```/);
  
  if (!chartMatch) {
    return null;
  }

  try {
    const chartJson = JSON.parse(chartMatch[1]);
    
    // Validate required fields
    if (!chartJson.type || !Array.isArray(chartJson.data)) {
      return null;
    }

    return chartJson as ChartData;
  } catch {
    return null;
  }
};

export const removeChartMarkers = (content: string): string => {
  // Remove the chart code block from content so it doesn't display as markdown
  return content.replace(/```chart\n[\s\S]*?\n```\n?/g, '').trim();
};
