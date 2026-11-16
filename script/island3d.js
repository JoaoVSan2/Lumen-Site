/*
  LUMEN SOCIETY — ISLAND CORE

  Substitua TODO este arquivo pelo conteúdo completo do seu
  island3d.js que já funciona no Replit.

  Importante:
  - Mantenha o elemento #island-canvas.
  - Mantenha o import do Three.js no início do arquivo:
    import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
  - Não altere a câmera durante esta etapa.
*/
const host = document.getElementById('island-canvas');
if (host) {
  const loading = host.querySelector('.loading');
  if (loading) {
    loading.innerHTML = '<span class="loading-mark">✳</span><span>Adicione aqui o Island Core 3D</span>';
  }
}
