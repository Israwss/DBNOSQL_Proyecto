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

interface PizzaData {
  pizza_name: string;
  pizzasTotal: number;
}

export default function TopPizzasChartHighcharts() {
  const [data, setData] = useState<PizzaData[]>([]);
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
    fetch(`/api/top-pizzas?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json.slice(0, 5)); // Top 5
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching pizza data:', err);
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
    if (!data.length) return null;

    const cleaned = data.map((pizza) => ({
      name: pizza.pizza_name.replace(/\b(The|Pizza)\b/gi, '').trim(),
      y: pizza.pizzasTotal,
    }));

    return {
      chart: {
        type: 'bar',
        backgroundColor: 'transparent',
        height: 420,
        style: {
          fontFamily: 'Arial',
        },
      },
      title: {
        text: 'Top 5 Pizzas Más Vendidas',
        style: {
          fontFamily: 'Arial Black',
          fontSize: '18px',
          color: isDark ? '#fff' : '#000',
        },
      },
      xAxis: {
        categories: cleaned.map((p) => p.name),
        labels: {
          style: {
            fontSize: '13px',
            fontFamily: 'Arial Black',
            color: isDark ? '#ddd' : '#333',
          },
          align: 'center',
        },
        title: null,
      },
      yAxis: {
        title: {
          text: 'Cantidad vendida',
          align: 'high',
          style: {
            fontWeight: 'bold',
            fontFamily: 'Arial Black',
            color: isDark ? '#fff' : '#000',
          },
        },
        labels: {
          style: {
            color: isDark ? '#ccc' : '#000',
          },
        },
      },
      tooltip: {
        formatter: function () {
          return `<b>${this.key}</b><br/>🍕 <b>${this.y}</b> unidades vendidas`;
        },
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
            style: {
              fontSize: '13px',
              color: isDark ? '#fff' : '#000',
              fontWeight: 'bold',
            },
          },
        },
        series: {
          borderRadius: 4,
          groupPadding: 0.1,
        },
      },
      legend: { enabled: false },
      credits: { enabled: false },
      series: [
        {
          name: 'Ventas',
          data: cleaned,
          color: '#FFC067',
        },
      ],
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
    return <Typography>No hay datos de pizzas disponibles.</Typography>;
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
          >
            <MenuItem value="">Todas</MenuItem>
            <MenuItem value="Veggie">Vegetariana</MenuItem>
            <MenuItem value="Classic">Clásica</MenuItem>
            <MenuItem value="Supreme">Supreme</MenuItem>
            <MenuItem value="Chicken">Supreme</MenuItem>

            {/* Agrega más según tus datos */}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Tamaño</InputLabel>
          <Select
            value={sizeFilter}
            onChange={handleSizeChange}
            label="Tamaño"
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
