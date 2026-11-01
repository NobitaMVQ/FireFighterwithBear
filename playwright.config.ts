import {defineConfig} from '@playwright/test';
const port=process.env.TEST_PORT||'4175';
export default defineConfig({testDir:'tests',timeout:120000,use:{baseURL:`http://127.0.0.1:${port}`,viewport:{width:1440,height:1050},launchOptions:{executablePath:process.env.CHROMIUM_PATH||(process.platform==='linux'?'/usr/bin/chromium':undefined),args:['--no-sandbox']}},webServer:{command:`npm run dev -- --host 127.0.0.1 --port ${port} --strictPort`,url:`http://127.0.0.1:${port}`,reuseExistingServer:true}});
