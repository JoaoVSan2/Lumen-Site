# Lumen Society — Design Guidelines

> Documento de referência para manter consistência visual, arquitetural e de gameplay durante o desenvolvimento do Lumen Society.
>
> **Status:** diretrizes iniciais. Itens identificados como *proposta* ainda precisam de decisão explícita antes de virarem requisitos.

## 1. Princípios do projeto

- Preservar a identidade visual e as decisões já aprovadas; mudanças estruturais devem ser deliberadas, não introduzidas incidentalmente.
- Priorizar uma experiência de mundo acolhedor, legível e coerente.
- Construir sistemas de forma incremental, evitando antecipar complexidade que ainda não é necessária.
- Manter as áreas e funcionalidades independentes quando possível, para reduzir efeitos colaterais entre partes do projeto.
- Não considerar sugestões de IA como decisões aprovadas sem validação do responsável pelo projeto.

## 2. Direção visual

### Estilo geral

- Direção de arte **3D low-poly estilizada**, com volumes suaves, arredondados e orgânicos.
- Silhuetas limpas e reconhecíveis, inclusive em escala reduzida.
- Aparência amigável, com proporções compactas e expressivas.
- A inspiração em jogos com personagens de formas arredondadas é uma referência de linguagem visual, não uma autorização para copiar personagens, modelos ou identidade visual de terceiros.
- Personagens humanos devem continuar humanos; não transformar o estilo em aparência animal.

### Cenários e ilhas

- Manter coerência entre vegetação, terreno, construções, objetos e personagens.
- Usar formas e cores que favoreçam leitura espacial e sensação acolhedora.
- Melhorias no cenário devem respeitar o enquadramento atual da câmera da Island Core. **Não alterar inclinação, rotação, posição ou zoom dessa câmera sem pedido explícito.**
- Não reorganizar a Island Core ou substituir elementos existentes sem avaliar o impacto e obter aprovação.

## 3. Estrutura do mundo e ilhas

### Áreas conhecidas do projeto

- **Island Core:** núcleo central do mundo.
- **Verdant Island:** área temática natural.
- **Commerce Archipelago:** arquipélago dedicado a atividades comerciais.
- **Entertainment:** área dedicada a entretenimento.

A existência e a identidade dessas áreas fazem parte do contexto atual do projeto. Novas divisões, conexões ou mudanças de função precisam ser discutidas antes de implementação.

### Commerce Archipelago

Diretriz já estabelecida para os estabelecimentos:

- Usar módulos estruturais como base, permitindo ampla personalização.
- A personalização externa pode abranger formato, fachadas, paredes, portas, janelas, telhados, materiais, cores, letreiros e decoração.
- A personalização interna pode abranger divisórias, cômodos, pisos, paredes, móveis, iluminação, equipamentos e decoração.
- Cada negócio deve poder ter aparência e organização próprias.

### Organização espacial — propostas para avaliação

As sugestões abaixo são possibilidades de design, não decisões finais:

- Criar zonas de chegada/porto, convivência, áreas residenciais e áreas de construção/recursos, caso sejam compatíveis com o layout e a experiência desejada.
- Garantir clareiras e áreas abertas para que personagens e construções permaneçam legíveis em meio à vegetação.
- Avaliar se espaços privados dos jogadores serão ilhas próprias ou terrenos dentro de uma área compartilhada.
- Diferenciar claramente espaços pessoais, áreas públicas e ilhas especializadas.

## 4. Personagens

### Direção de personagens

- Personagens devem seguir a linguagem low-poly estilizada e arredondada do mundo.
- A silhueta deve ser legível de longe e em tamanhos pequenos.
- Mãos, roupas e acessórios precisam funcionar visualmente e permitir futuras interações.
- A modularidade é uma meta de arquitetura para customização futura, mas não deve antecipar um sistema complexo antes da validação do modelo-base.

### Taika — referência de desenvolvimento

Taika é um personagem original da HQ **Solados**. Sua identidade visual deve ser preservada:

- Cabelo escuro, cacheado e volumoso.
- Máscara branca angular com detalhes vermelhos.
- Expressão/sensação séria.
- Sobretudo preto longo, forro vinho e detalhes vermelhos.
- Gola levantada, luvas brancas, calça escura, botas e pequeno pingente prateado.

O objetivo visual é adaptar Taika à linguagem 3D low-poly arredondada do Lumen Society sem descaracterizá-lo.

**Estado de referência:** Taika Prototype 0.7 no Character Lab. O T-pose serve para avaliar proporções e silhueta. O Character Lab é uma página de trabalho independente; não integrá-lo à navegação da Island Core sem solicitação explícita.

### Próximos critérios de avaliação

- Silhueta e proporções em escala pequena.
- Integração visual entre braços, mãos, tronco e sobretudo.
- Máscara reconhecível como máscara facial, não como óculos.
- Cachos definidos sem perder o volume característico.
- Compatibilidade futura com poses, animações e customização.

Poses adicionais e animações podem ser desenvolvidas depois que o modelo-base estiver visualmente consolidado.

## 5. Gameplay e sistemas — conceitos em avaliação

As ideias desta seção foram discutidas como direção conceitual e ainda precisam ser confirmadas como requisitos de gameplay:

- Personagens podem executar atividades e construir ao longo do tempo, enquanto o jogador fornece ordens de alto nível.
- Construções podem levar períodos de tempo real, com a faixa de 1 a 3 dias mencionada como referência inicial.
- Caso esse sistema seja adotado, o progresso deve ser comunicado visualmente: etapas de construção, materiais, atividade dos personagens e mudanças perceptíveis no local.
- Um ciclo de dia e noite pode reforçar a sensação de mundo vivo, desde que seja compatível com a arquitetura e a prioridade do projeto.

Antes de implementar esses sistemas, definir regras de simulação, persistência, progresso offline, estados de construção e feedback para o jogador.

## 6. Regras de implementação e colaboração

- Fazer alterações pequenas e focadas, respeitando os limites da tarefa solicitada.
- Evitar mudanças não relacionadas em outras ilhas, na câmera da Island Core ou em páginas independentes.
- Validar dependências, caminhos de assets, escala, orientação, topologia, rig e licenças antes de incorporar assets externos.
- Não declarar uma funcionalidade testada visualmente ou aprovada sem executar a verificação correspondente.
- Evitar que agentes diferentes façam alterações simultâneas e conflitantes na branch principal.
- Sugestões externas ou de outras IAs devem ser tratadas como revisão; consolidar uma decisão antes de implementar.
- Sempre que possível, revisar o diff e verificar o estado do deploy após alterações relevantes.

### Fluxo sugerido entre IAs

- **Grok:** revisão independente, crítica visual, ideias de gameplay e identificação de riscos/alternativas.
- **ChatGPT:** continuidade técnica, arquitetura, implementação, integração e verificação das alterações.
- **Responsável pelo projeto:** decide quais sugestões serão aceitas e aprova mudanças de direção.

Esse fluxo é uma proposta operacional e pode ser ajustado.

## 7. Processo para alterar estas diretrizes

Ao propor uma mudança:

1. Identificar se é uma decisão já aprovada, uma proposta ou uma hipótese.
2. Explicar o impacto sobre sistemas, ilhas, personagens e assets existentes.
3. Evitar sobrescrever decisões anteriores sem aprovação explícita.
4. Atualizar este documento quando uma decisão relevante for confirmada.
5. Manter as diretrizes concisas e alinhadas ao estado real do projeto.

---

**Última revisão:** 2026-11-26
