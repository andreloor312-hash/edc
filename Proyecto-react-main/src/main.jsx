import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css'; // 1. Estilos globales obligatorios
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <MantineProvider> {/* 2. Proveedor de tema */}
    <App />
  </MantineProvider>
);