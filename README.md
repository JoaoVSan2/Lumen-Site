# Lumen Society

Estrutura inicial do site imersivo da Lumen Society.

## Arquitetura das ilhas

- `scripts/main-island3d.js`: ponto de entrada da ilha principal compartilhada.
- Futuro módulo de ilhas privadas: lógica reutilizável para criar uma ilha independente e personalizada para cada personagem.
- Futuro módulo da ilha comercial: espaço dedicado a café, mercados, lojas e outros estabelecimentos.

Os módulos das ilhas privadas e comercial serão adicionados quando essas experiências começarem a ser implementadas. Não manteremos arquivos vazios apenas como marcadores.

## Arquivos atuais

- `index.html`: página inicial e estrutura da experiência.
- `styles/style.css`: identidade visual e layout responsivo.
- `scripts/main-island3d.js`: entrada da ilha principal.

## Integração do Island Core

O código funcional e validado da ilha principal deverá ser integrado em `scripts/main-island3d.js`.

Cuidados durante a integração:
- Preservar o elemento `#island-canvas`.
- Manter a versão do Three.js já adotada pelo projeto.
- Não alterar inclinação, rotação ou zoom da câmera sem solicitação explícita.
- Priorizar melhorias no cenário natural sem descaracterizar a ilha atual.

## Publicação

O projeto é um site estático e pode ser publicado pela Vercel.

Configuração básica:
- Framework Preset: Other
- Build Command: vazio
- Output Directory: `.`
- Install Command: vazio

Verifique os limites e termos atuais do plano escolhido antes de usar o projeto comercialmente.
