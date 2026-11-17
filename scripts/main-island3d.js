/*
  LUMEN SOCIETY — MAIN ISLAND CORE

  Este arquivo será o ponto de entrada exclusivo da ilha principal.
  O código funcional do Island Core será integrado aqui quando recuperarmos
  a versão atual validada no projeto de desenvolvimento.

  Importante:
  - Mantenha o elemento #island-canvas.
  - Mantenha o import do Three.js no início do arquivo:
    import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
  - Não altere a câmera durante a integração.
*/
const host = document.getElementById('island-canvas');
if (host) {
  const loading = host.querySelector('.loading');
  if (loading) {
    loading.innerHTML = '<span class="loading-mark">✳</span><span>Preparando a ilha principal...</span>';
  }
}
