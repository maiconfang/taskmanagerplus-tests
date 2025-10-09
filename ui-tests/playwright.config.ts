import { defineConfig, devices } from '@playwright/test';
import { join } from 'path';

export default defineConfig({
  // Diretório onde ficam os testes
  testDir: './tests',

  // Tempo máximo por teste (30s)
  timeout: 30 * 1000,

  // Onde salvar relatórios e traces
  reporter: [
    ['line'], // mostra no terminal
    ['json', { outputFile: join(__dirname, 'reports/ui/playwright-report.json') }]
  ],

  // Configurações padrão dos testes
  use: {
    headless: true,                 // roda em modo headless (sem abrir o browser)
    screenshot: 'only-on-failure',  // tira screenshot só quando falha
    video: 'retain-on-failure',     // grava vídeo se falhar
    trace: 'on',                    // salva trace para debug
    baseURL: process.env.BASE_URL || 'http://localhost:4200'
  },

  // Projetos: roda nos 3 navegadores principais
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
