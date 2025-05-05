'use client';
import * as React from 'react';
import Typography from '@mui/material/Typography';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LanguageIcon from '@mui/icons-material/Language';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Image from 'next/image';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        position: 'relative',
        py: 3,
        px: 2,
        minHeight: '130px',
        // Aplicando el gradiente con sx de MUI
        background: 'linear-gradient(to right, #2C2C2C, #F28C28)',
        color: 'white',
      }}
    >
      {/* Logo - Esquina superior izquierda */}
      <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Image src="/logo-pizzas-mibuen.png" alt="Logo" width={30} height={30} />
          <Typography variant="subtitle1" sx={{ color: 'white' }}>
            Pizzas Mi Buen
          </Typography>
        </Stack>
      </Box>

      {/* Información de contacto - Centrado */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          transform: 'translateY(-10px)',
          marginTop: '10px',
        }}
      >
        <Stack direction="column" spacing={1} sx={{ textAlign: 'center' }}>
          <Typography variant="body2" display="flex" alignItems="center" sx={{ color: 'white' }}>
            <LocationOnIcon sx={{ mr: 1, fontSize: '1rem', color: 'white' }} /> Av. Reforma 123, CDMX
          </Typography>
          <Typography variant="body2" display="flex" alignItems="center" sx={{ color: 'white' }}>
            <PhoneIcon sx={{ mr: 1, fontSize: '1rem', color: 'white' }} /> (55) 1234 5678
          </Typography>
          <Typography variant="body2" display="flex" alignItems="center" sx={{ color: 'white' }}>
            <EmailIcon sx={{ mr: 1, fontSize: '1rem', color: 'white' }} /> contacto@pizzasmibuen.com
          </Typography>
          <Typography variant="body2" display="flex" alignItems="center" sx={{ color: 'white' }}>
            <LanguageIcon sx={{ mr: 1, fontSize: '1rem', color: 'white' }} /> www.pizzasmibuen.com
          </Typography>
        </Stack>
      </Box>

      {/* Copyright - Esquina inferior derecha */}
      <Typography
        variant="body2"
        sx={{
          position: 'absolute',
          bottom: 8,
          right: 16,
          fontSize: '0.75rem',
          color: 'white'
        }}
      >
        Página creada por <strong>DATAtouille</strong> | © 2025
      </Typography>
    </Box>
  );
}