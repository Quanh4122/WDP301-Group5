import React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppTheme from '../shared-theme/AppTheme';
import Sidebar from './components/Header'; // Đảm bảo import đúng Sidebar
import MainGrid from './components/MainGrid';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from './theme/customizations';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <div className="mt-20 mb-20 text-white">

        {/* Nội dung chính với Sidebar và MainGrid */}
        <main className="max-w-7xl mx-auto p-6 flex gap-6">
          {/* Sidebar */}
          <Sidebar />

          {/* MainGrid */}
          <div className="flex-1">
            <MainGrid />
          </div>
        </main>
      </div>
    </AppTheme>
  );
}