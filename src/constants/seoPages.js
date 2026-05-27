/** Slugs indexáveis na raiz (canonical) + idioma principal do conteúdo */
export const SEO_PAGE_SLUGS = [
  'teste-digitacao-celular',
  'teste-digitacao-portugues',
  'typing-test-mobile',
  'como-melhorar-wpm',
  'certificado-digitacao',
  'teste-de-digitacao-online',
  'teste-de-velocidade-digitacao',
  'mobile-typing-speed-test',
];

export const SEO_PAGES = {
  'teste-digitacao-celular': {
    slug: 'teste-digitacao-celular',
    lang: 'pt',
    title: 'Teste de Digitação no Celular | QuickDocTest',
    description:
      'Faça um teste de digitação no celular gratuitamente. Mede WPM, precisão e desempenho com teclado virtual otimizado para Android e iPhone.',
    h1: 'Teste de Digitação no Celular',
    intro:
      'O QuickDocTest foi pensado para quem quer medir a velocidade de digitação diretamente no smartphone. Ao contrário de testes feitos só para desktop, aqui o texto permanece visível quando o teclado virtual abre, o que permite uma avaliação real do seu desempenho no dia a dia com o celular.',
    sections: [
      {
        h2: 'Por que fazer o teste no celular?',
        paragraphs: [
          'Cada vez mais tarefas profissionais e acadêmicas acontecem em dispositivos móveis: respostas rápidas no WhatsApp, anotações, e-mails curtos e formulários. Saber quantas palavras por minuto (WPM) você atinge no celular ajuda a entender sua produtividade real fora do teclado físico.',
          'No QuickDocTest, o layout se adapta à área visível acima do teclado. Isso evita que linhas fiquem escondidas e reduz a frustração comum em testes que não foram otimizados para telas pequenas.',
        ],
      },
      {
        h2: 'Compatibilidade com Android e iPhone',
        paragraphs: [
          'O teste funciona nos principais navegadores móveis: Chrome, Safari, Edge e Firefox. Em iPhones e iPads, o Safari respeita a viewport dinâmica quando o teclado aparece; em Android, o comportamento é semelhante nos navegadores baseados em Chromium.',
        ],
        subsections: [
          {
            h3: 'Teclado virtual e precisão',
            paragraphs: [
              'A precisão medida no celular inclui correções comuns em toque, como retrocesso e autocorreção do sistema. O resultado combina velocidade líquida (net WPM) e percentual de acertos, oferecendo uma visão equilibrada do seu desempenho.',
            ],
          },
        ],
      },
      {
        h2: 'Como interpretar WPM no mobile',
        paragraphs: [
          'WPM (words per minute) representa palavras por minuto com base em cinco caracteres por palavra, padrão internacional. No celular, valores entre 25 e 45 WPM já indicam uso confortável; acima de 50 WPM, desempenho avançado para digitação móvel.',
          'Após o teste, você pode emitir certificado digital com serial único, útil para portfólio ou comprovação informal de prática.',
        ],
      },
    ],
    faq: [
      {
        question: 'O teste de digitação no celular é gratuito?',
        answer: 'Sim. O QuickDocTest é gratuito e roda no navegador, sem instalação obrigatória.',
      },
      {
        question: 'Preciso criar conta?',
        answer: 'O teste funciona sem login. Conta Google é opcional para salvar certificado e receber por e-mail.',
      },
    ],
  },

  'teste-digitacao-portugues': {
    slug: 'teste-digitacao-portugues',
    lang: 'pt',
    title: 'Teste de Digitação em Português | QuickDocTest',
    description:
      'Teste de digitação em português com textos naturais, métricas de WPM, precisão e certificado digital. Ideal para prática em PT-BR.',
    h1: 'Teste de Digitação em Português',
    intro:
      'Praticar digitação em português exige atenção a acentos, cedilha e pontuação típica do idioma. O QuickDocTest oferece textos em português selecionados aleatoriamente, cronômetro configurável e métricas em tempo real para você evoluir com consistência.',
    sections: [
      {
        h2: 'Textos pensados para o idioma',
        paragraphs: [
          'Os trechos incluem vocabulário cotidiano e termos técnicos moderados, aproximando o teste de situações reais: redação, estudos e trabalho administrativo. Isso torna a medição mais representativa do que listas aleatórias sem contexto.',
        ],
      },
      {
        h2: 'Métricas que importam em português',
        paragraphs: [
          'Além do WPM bruto e líquido, o sistema calcula precisão, consistência ao longo do tempo e taxa de erros corrigidos. Erros em acentos contam como falhas até serem corrigidos, incentivando digitação cuidadosa.',
        ],
        subsections: [
          {
            h3: 'Duração do teste',
            paragraphs: [
              'Você pode escolher sessões curtas (15 ou 30 segundos) para aquecimento, ou 60 segundos para avaliação completa. A repetição diária de blocos curtos costuma gerar ganhos mais estáveis do que sessões longas esporádicas.',
            ],
          },
        ],
      },
      {
        h2: 'Certificado e evolução',
        paragraphs: [
          'Ao concluir, é possível gerar certificado em PDF com identificação do dispositivo utilizado e serial de rastreio. Use o resultado como marco mensal e compare seu WPM ao longo das semanas.',
        ],
      },
    ],
    faq: [
      {
        question: 'O teste aceita teclado ABNT2?',
        answer: 'Sim. Qualquer layout configurado no seu sistema operacional é respeitado durante a digitação.',
      },
      {
        question: 'Posso alternar idioma do site?',
        answer: 'O site está disponível em português, inglês e espanhol; os textos do teste seguem o idioma escolhido na interface.',
      },
    ],
  },

  'typing-test-mobile': {
    slug: 'typing-test-mobile',
    lang: 'en',
    title: 'Mobile Typing Test | QuickDocTest',
    description:
      'Free mobile typing test with real WPM and accuracy metrics. Optimized virtual keyboard layout for Android and iPhone browsers.',
    h1: 'Mobile Typing Test',
    intro:
      'QuickDocTest delivers a typing speed test built for phones and tablets. When the virtual keyboard opens, the passage stays visible in the upper screen area so you can type without losing context—a common failure point in desktop-only typing apps.',
    sections: [
      {
        h2: 'Why mobile typing speed matters',
        paragraphs: [
          'Mobile messaging, support tickets, and field notes increasingly happen on touch keyboards. Measuring your true mobile WPM helps set realistic goals and track improvement separately from physical keyboard scores.',
        ],
      },
      {
        h2: 'Android and iOS support',
        paragraphs: [
          'The test runs in modern mobile browsers with adaptive layout logic. Safari on iOS and Chrome on Android are fully supported, including dynamic viewport handling when the keyboard is shown or hidden.',
        ],
        subsections: [
          {
            h3: 'Accuracy under touch input',
            paragraphs: [
              'Accuracy reflects correct characters, including corrections before the timer ends. Net WPM discounts uncorrected errors, aligning with international typing assessment conventions.',
            ],
          },
        ],
      },
      {
        h2: 'From practice to certificate',
        paragraphs: [
          'After each run you receive instant analytics and may download a PDF certificate with a unique serial number—useful for portfolios, training logs, or personal milestones.',
        ],
      },
    ],
    faq: [
      {
        question: 'Is the mobile typing test free?',
        answer: 'Yes. QuickDocTest is free to use in the browser with optional Google sign-in for certificates.',
      },
      {
        question: 'Do I need to install an app?',
        answer: 'No installation is required. You can add the site to your home screen for quick access if your browser supports it.',
      },
    ],
  },

  'como-melhorar-wpm': {
    slug: 'como-melhorar-wpm',
    lang: 'pt',
    title: 'Como Melhorar WPM na Digitação | QuickDocTest',
    description:
      'Guia prático para aumentar WPM (palavras por minuto) com precisão, postura, treino diário e uso do teste de digitação online.',
    h1: 'Como Melhorar seu WPM na Digitação',
    intro:
      'WPM (words per minute) é a métrica mais usada para medir velocidade de digitação. Melhorar o WPM não significa apenas digitar mais rápido: estabilidade, precisão e ritmo constante são igualmente importantes para resultados profissionais.',
    sections: [
      {
        h2: 'O que é WPM e como é calculado',
        paragraphs: [
          'Internacionalmente, uma palavra equivale a cinco caracteres digitados, incluindo espaços em muitos padrões. O WPM bruto conta tudo o que foi digitado; o WPM líquido (net WPM) penaliza erros não corrigidos, sendo a métrica mais justa em avaliações sérias.',
        ],
      },
      {
        h2: 'Estratégias práticas de evolução',
        paragraphs: [
          'Treine 10 a 15 minutos por dia em vez de uma hora esporádica. Comece focando em precisão acima de 95%; quando isso for automático, a velocidade sobe naturalmente.',
          'Use o teste de digitação online do QuickDocTest para registrar séries com o mesmo tempo (30 ou 60 segundos) e compare gráficos de progresso.',
        ],
        subsections: [
          {
            h3: 'Postura e ergonomia',
            paragraphs: [
              'No desktop, mantenha punhos neutros e teclas ao alcance dos dedos na fileira base. No celular, segure o aparelho estável ou apoie os cotovelos para reduzir erros por movimento.',
            ],
          },
          {
            h3: 'Precisão antes de velocidade',
            paragraphs: [
              'Cada erro corrigido custa tempo. Reduzir retrabalho é frequentemente mais eficiente do que forçar picos de velocidade com muitos backspaces.',
            ],
          },
        ],
      },
      {
        h2: 'Metas realistas por nível',
        paragraphs: [
          'Iniciantes costumam ficar entre 20 e 35 WPM; intermediários entre 40 e 60; avançados acima de 70 no teclado físico. No celular, subtrair cerca de 15–25% desses valores é normal.',
        ],
      },
    ],
    faq: [
      {
        question: 'Quantas palavras por minuto são consideradas boas?',
        answer: 'Acima de 40 WPM líquido no desktop é sólido para escritório; acima de 60 WPM é avançado.',
      },
      {
        question: 'Com que frequência devo treinar?',
        answer: 'Sessões curtas diárias superam maratonas semanais para ganho de velocidade sustentável.',
      },
    ],
  },

  'certificado-digitacao': {
    slug: 'certificado-digitacao',
    lang: 'pt',
    title: 'Certificado de Digitação Digital | QuickDocTest',
    description:
      'Emita certificado de digitação em PDF com WPM, precisão, serial único e dados do dispositivo. Download imediato após o teste.',
    h1: 'Certificado de Digitação Digital',
    intro:
      'O QuickDocTest gera um certificado em PDF após o teste, documentando seu desempenho com métricas reconhecíveis internacionalmente. O documento é adequado para portfólio, desafios pessoais ou comprovação informal de prática.',
    sections: [
      {
        h2: 'O que consta no certificado',
        paragraphs: [
          'Nome do participante, data e hora, idioma do teste, duração, WPM líquido, precisão, classificação de nível e serial único no formato QDT-ANO-SEQUÊNCIA. Também registramos o tipo de dispositivo utilizado (celular, tablet ou desktop) com detalhes de sistema e navegador.',
        ],
      },
      {
        h2: 'Emissão automática e download',
        paragraphs: [
          'Após concluir o teste e fazer login com Google, você pode baixar o PDF em alta resolução. O nome do arquivo inclui o serial para organização: quickdoctest-certificado-QDT-....pdf.',
        ],
        subsections: [
          {
            h3: 'Validação e rastreio',
            paragraphs: [
              'O serial é determinístico a partir do momento do teste, permitindo referência futura. O certificado pode ser enviado por e-mail quando o EmailJS está configurado no ambiente.',
            ],
          },
        ],
      },
      {
        h2: 'Qualidade para impressão',
        paragraphs: [
          'O PDF é exportado em A4 paisagem com renderização em alta densidade de pixels, mantendo o mesmo layout visual da prévia na tela.',
        ],
      },
    ],
    faq: [
      {
        question: 'O certificado é oficial?',
        answer: 'É um comprovante digital de desempenho na plataforma QuickDocTest, não um diploma governamental.',
      },
      {
        question: 'Preciso pagar pelo certificado?',
        answer: 'Não. O download do certificado é gratuito para usuários autenticados.',
      },
    ],
  },

  'teste-de-digitacao-online': {
    slug: 'teste-de-digitacao-online',
    lang: 'pt',
    title: 'Teste de Digitação Online Grátis | QuickDocTest',
    description:
      'Teste de digitação online gratuito com cronômetro, WPM, precisão e certificado. Funciona no navegador, celular e desktop.',
    h1: 'Teste de Digitação Online',
    intro:
      'Avaliar sua digitação online elimina a necessidade de instalar software. O QuickDocTest roda inteiramente no navegador, com interface responsiva, suporte a tema claro e escuro e resultados instantâneos ao final de cada sessão.',
    sections: [
      {
        h2: 'Vantagens do teste no navegador',
        paragraphs: [
          'Acesso imediato em qualquer dispositivo, atualizações automáticas e compatibilidade com autenticação Google para salvar certificados. Ideal para escolas, treinamentos corporativos e uso individual.',
        ],
      },
      {
        h2: 'Como funciona o fluxo',
        paragraphs: [
          'Escolha o tempo do teste, digite o texto exibido o mais rápido e preciso possível, e visualize WPM e precisão em tempo real. Ao terminar, gráficos mostram a evolução segundo a segundo.',
        ],
        subsections: [
          {
            h3: 'Segurança e privacidade',
            paragraphs: [
              'O teste não grava o conteúdo digitado para fins publicitários. Autenticação é usada apenas para certificado e e-mail opcional.',
            ],
          },
        ],
      },
      {
        h2: 'Para quem é indicado',
        paragraphs: [
          'Estudantes, profissionais de suporte, candidatos a vagas administrativas e entusiastas de produtividade que desejam baseline mensurável de digitação.',
        ],
      },
    ],
    faq: [
      {
        question: 'Funciona offline?',
        answer: 'É necessária conexão para carregar o site; o teste em si roda localmente após o carregamento.',
      },
    ],
  },

  'teste-de-velocidade-digitacao': {
    slug: 'teste-de-velocidade-digitacao',
    lang: 'pt',
    title: 'Teste de Velocidade de Digitação | QuickDocTest',
    description:
      'Meça sua velocidade de digitação (WPM e CPM) com teste gratuito, precisão em tempo real e relatório completo ao final.',
    h1: 'Teste de Velocidade de Digitação',
    intro:
      'Velocidade de digitação é medida principalmente em WPM (palavras por minuto) e CPM (caracteres por minuto). O QuickDocTest calcula ambos automaticamente, além de precisão, consistência e fatores de desempenho derivados.',
    sections: [
      {
        h2: 'WPM versus CPM',
        paragraphs: [
          'CPM conta caracteres crus por minuto; WPM divide por cinco para padronizar “palavras”. Em comparações internacionais, WPM líquido é a referência mais citada.',
        ],
      },
      {
        h2: 'Como obter medição confiável',
        paragraphs: [
          'Use sempre a mesma duração de teste, evite pausas longas e priorize precisão. Repita três vezes e considere a mediana, não apenas o melhor pico isolado.',
        ],
        subsections: [
          {
            h3: 'Velocidade no celular',
            paragraphs: [
              'No smartphone, espere valores menores que no teclado físico. O QuickDocTest adapta a interface para que a medição reflita uso real com teclado virtual.',
            ],
          },
        ],
      },
      {
        h2: 'Análise após o teste',
        paragraphs: [
          'Gráfico de velocidade por segundo, ranking de nível e opção de certificado PDF consolidam o resultado para compartilhamento ou arquivo pessoal.',
        ],
      },
    ],
    faq: [
      {
        question: 'Qual velocidade é considerada profissional?',
        answer: 'Geralmente acima de 50–60 WPM líquido em texto em inglês ou português no desktop.',
      },
    ],
  },

  'mobile-typing-speed-test': {
    slug: 'mobile-typing-speed-test',
    lang: 'en',
    title: 'Mobile Typing Speed Test Online | QuickDocTest',
    description:
      'Measure mobile typing speed (WPM) and accuracy online. Free typing speed test optimized for phones with digital certificate.',
    h1: 'Mobile Typing Speed Test',
    intro:
      'A mobile typing speed test should reflect real thumb typing—not just shrink a desktop layout. QuickDocTest keeps the passage and live metrics visible while you type on a touch keyboard, producing WPM and accuracy scores you can trust.',
    sections: [
      {
        h2: 'Built for touch keyboards',
        paragraphs: [
          'Layouts adapt when the virtual keyboard opens, reducing scroll fatigue and hidden lines. This design choice leads to fairer measurements on small screens.',
        ],
      },
      {
        h2: 'Speed, accuracy, and consistency',
        paragraphs: [
          'Alongside WPM, you receive accuracy percentage, per-second speed charts, and a performance score that rewards steady rhythm instead of erratic bursts.',
        ],
        subsections: [
          {
            h3: 'Compare with desktop results',
            paragraphs: [
              'Mobile scores are typically lower than physical keyboard results. Tracking them separately prevents unrealistic expectations and highlights real mobile productivity gains.',
            ],
          },
        ],
      },
      {
        h2: 'Certificate and device transparency',
        paragraphs: [
          'Certificates note whether the attempt was on phone, tablet, or desktop, including OS and browser context. Each PDF includes a unique serial for reference.',
        ],
      },
    ],
    faq: [
      {
        question: 'Does it work on iPhone Safari?',
        answer: 'Yes. Safari on iOS is supported with viewport-aware layout adjustments.',
      },
      {
        question: 'Can I share my score?',
        answer: 'You can download the PDF certificate or share your validation link after signing in.',
      },
    ],
  },
};

export function getSeoPage(slug) {
  return SEO_PAGES[slug] || null;
}

/** Links internos entre páginas SEO (labels por idioma da página de destino) */
export function getSeoRelatedLinks(currentSlug, lang) {
  return SEO_PAGE_SLUGS.filter((s) => s !== currentSlug).map((slug) => {
    const page = SEO_PAGES[slug];
    return {
      slug,
      href: `/${slug}`,
      label: page?.h1 || slug,
      lang: page?.lang,
    };
  });
}
