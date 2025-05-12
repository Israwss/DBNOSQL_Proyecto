'use client';

import * as React from 'react';
import { ResponsiveFunnel } from '@nivo/funnel';
import { Box, CircularProgress, Typography } from '@mui/material';

interface FunnelDataItem {
  label: string;
  value: number;
}

function FunnelWrapper({ title, data }: { title: string; data: FunnelDataItem[] }) {
  return (
    <Box sx={{ width: '100%', maxWidth: 500, height: 500 }}>
      <Typography variant="h6" sx={{ mb: 1 }}>
        {title}
      </Typography>
      <ResponsiveFunnel
        data={data.map((d, i) => ({ ...d, id: d.label || i }))}
        margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        valueFormat=">-.4s"
        colors={{ scheme: 'spectral' }}
        borderWidth={20}
        borderColor={{ from: 'color' }}
        labelColor={{
          from: 'color',
          modifiers: [['darker', 3]],
        }}
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
  const [top, setTop] = React.useState<FunnelDataItem[]>([]);
  const [bottom, setBottom] = React.useState<FunnelDataItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/ingredientes-funnel')
      .then((res) => res.json())
      .then((json) => {
        setTop(json.top);
        setBottom(json.bottom);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching funnel data:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap', justifyContent: 'center' }}>
      <FunnelWrapper title="Top 10 ingredientes con mayores ventas" data={top} />
      <FunnelWrapper title="Top 10 ingredientes con menores ventas" data={bottom} />
    </Box>
  );
}
