'use client';

import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import Accessibility from 'highcharts/modules/accessibility';
import { useEffect, useState, useMemo } from 'react';
import {
  Box,
  CircularProgress,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

if (typeof Highcharts === 'object') {
  Exporting(Highcharts);
  ExportData(Highcharts);
  Accessibility(Highcharts);
}

interface IngredientePrep {
  ingrediente: string;
  promedio_tiempo: number;
}

export default function TopIngredientesPrepChartHighcharts() {
  const [data, setData] = useState<IngredientePrep[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');

  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const fetchData = (category = '', size = '') => {
    const params = new URLSearchParams();
    if (category) params.append('pizza_category', category);
    if (size) params.append('pizza_size', size);

    setLoading(true);
    fetch(`/api/top-ingredientes-preparacion?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching ingredientes prep data:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCategoryChange = (event: any) => {
    const value = event.target.value;
    setCategoryFilter(value);
    fetchData(value, sizeFilter);
  };

  const handleSizeChange = (event: any) => {
    const value = event.target.value;
    setSizeFilter(value);
    fetchData(categoryFilter, value);
  };

  const options = useMemo(() => {
    if (data.length === 0) return null;

    const categories = data.map((d) => d.ingrediente);
    const values = data.map((d) => parseFloat(d.promedio_tiempo.toFixed(2)));

    return {
      chart: {
        type: 'bar',
        backgroundColor: 'transparent',
        height: 500,
        style: { fontFamily: 'Arial' },
      },
      title: {
        text: 'Ingredientes con Mayor Tiempo Promedio de Preparación',
        style: {
          fontFamily: 'Arial Black',
          fontSize: '18px',
          color: isDark ? '#fff' : '#000',
        },
      },
      xAxis: {
        categories,
        title: null,
        labels: {
          style: {
            fontSize: '12px',
            fontFamily: 'Arial',
            color: isDark ? '#ccc' : '#333',
          },
        },
      },
      yAxis: {
        min: 25,
        max: 28,
        title: {
          text: 'Tiempo promedio (min)',
          style: {
            fontWeight: 'bold',
            fontFamily: 'Arial Black',
            color: isDark ? '#fff' : '#000',
          },
        },
        labels: {
          format: '{value} min',
          style: {
            color: isDark ? '#ccc' : '#000',
          },
        },
      },
      tooltip: {
        valueSuffix: ' min',
        backgroundColor: isDark ? '#333' : '#fff',
        style: {
          color: isDark ? '#fff' : '#000',
          fontFamily: 'Arial',
        },
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: true,
            format: '{y:.2f} min',
            style: {
              fontSize: '13px',
              color: isDark ? '#fff' : '#000',
              fontWeight: 'bold',
            },
          },
        },
        series: {
          borderRadius: 3,
          groupPadding: 0.1,
        },
      },
      series: [
        {
          name: 'Tiempo promedio (min)',
          data: values,
          color: '#FFC067',
        },
      ],
      legend: { enabled: false },
      credits: { enabled: false },
      exporting: {
        enabled: true,
        buttons: {
          contextButton: {
            symbolStroke: isDark ? '#ccc' : '#000',
            menuItems: ['downloadPNG', 'downloadPDF', 'downloadCSV'],
          },
        },
      },
      accessibility: {
        enabled: true,
      },
    };
  }, [data, isDark]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!options) {
    return <Typography>No hay datos disponibles.</Typography>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap' }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Categoría</InputLabel>
          <Select
            value={categoryFilter}
            onChange={handleCategoryChange}
            label="Categoría"
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: 300,
                  width: 200,
                },
              },
            }}
          >
            <MenuItem value="">Todas</MenuItem>
            <MenuItem value="Veggie">Vegetariana</MenuItem>
            <MenuItem value="Classic">Clásica</MenuItem>
            <MenuItem value="Supreme">Supreme</MenuItem>
            <MenuItem value="Chicken">Supreme</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Tamaño</InputLabel>
          <Select
            value={sizeFilter}
            onChange={handleSizeChange}
            label="Tamaño"
            MenuProps={{
              PaperProps: {
                sx: {
                  maxHeight: 300,
                  width: 200,
                },
              },
            }}
          >
            <MenuItem value="">Todos</MenuItem>
            <MenuItem value="S">S</MenuItem>
            <MenuItem value="M">M</MenuItem>
            <MenuItem value="L">L</MenuItem>
            <MenuItem value="XL">XL</MenuItem>
            <MenuItem value="XXL">XXL</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <HighchartsReact highcharts={Highcharts} options={options} />
    </Box>
  );
}
