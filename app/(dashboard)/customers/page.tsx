'use client';
import * as React from 'react';
import CustomDataGrid from '../../components/CustomDataGrid';
import { rows, columns } from '../../mocks/gridOrdersData';

export default function CustomersPage() {
  return <CustomDataGrid rows={rows} columns={columns} />;
}