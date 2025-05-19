'use client';

import * as React from 'react';
import { ResponsiveFunnel } from '@nivo/funnel';
import {
  Box,
  CircularProgress,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

interface FunnelDataItem {
  label: string;
  value: number;
}

function FunnelWrapper({ title, data }: { title: string; data: FunnelDataItem[] }) {
  return (
    <Box sx={{ width: '100%', maxWidth: 500, height: 420 }}>
      <Typography variant="h6" sx={{ mb: 1, fontFamily: 'Arial Black' }}>
        {title}
      </Typography>
      <ResponsiveFunnel
        data={data.map((d, i) => ({ ...d, id: d.label || i }))}
        margin={{ top: 20, right: 20, bottom: 30, left: 20 }}
        valueFormat=">-.4s"
        colors={{ scheme: 'spectral' }}
        borderWidth={20}
        borderColor={{ from: 'color' }}
        labelColor={{ from: 'color', modifiers: [['darker', 3]] }}
        beforeSeparatorLength={100}
        beforeSeparatorOffset={20}
        afterSeparatorLength={100}
        afterSeparatorOffset={20}
        currentPartSizeExtension={10}
        currentBorderWidth={40}
        motionConfig="wobbly"
      />
    </Box>
  );
}

export default function IngredientesFunnelChart() {
  const [top, setTop] = React.useState<FunnelDataItem[] | null>(null);
  const [bottom, setBottom] = React.useState<FunnelDataItem[] | null>(null);
  const [loading, setLoading] = React.useState(true);

  const [categoryFilter, setCategoryFilter] = React.useState('');
  const [sizeFilter, setSizeFilter] = React.useState('');

  const fetchData = (category = '', size = '') => {
    const params = new URLSearchParams();
    if (category) params.append('pizza_category', category);
    if (size) params.append('pizza_size', size);

    setLoading(true);
    fetch(`/api/ingredientes-funnel?${params.toString()}`)
      .then((res) => res.json())
      .then((json) => {
        setTop(json.top);
        setBottom(json.bottom);
      })
      .catch((err) => {
        console.error('Error fetching funnel data:', err);
        setTop([]);
        setBottom([]);
      })
      .finally(() => setLoading(false));
  };

  React.useEffect(() => {
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

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!top?.length || !bottom?.length) {
    return <Typography>No data available</Typography>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Categoría</InputLabel>
          <Select
            value={categoryFilter}
            onChange={handleCategoryChange}
            label="Categoría"
            MenuProps={{
              PaperProps: { sx: { maxHeight: 300, width: 200 } },
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
              PaperProps: { sx: { maxHeight: 300, width: 200 } },
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

      <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
        <FunnelWrapper title="Top 10 ingredientes con mayores ventas" data={top} />
        <FunnelWrapper title="Top 10 ingredientes con menores ventas" data={bottom} />
      </Box>
    </Box>
  );
}
