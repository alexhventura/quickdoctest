export const terms = {
  title: 'Termos de Uso do QuickDocTest',
  metaTitle: 'Termos de Uso | QuickDocTest',
  updatedLabel: 'Última atualização:',
  intro: [
    'O QuickDocTest é uma plataforma online destinada à avaliação da proficiência em digitação e habilidades relacionadas à entrada de texto em ambiente digital.',
    'Ao utilizar o sistema, o usuário declara estar de acordo com os presentes Termos de Uso.',
  ],
  sections: [
    {
      heading: 'Finalidade',
      paragraphs: [
        'O QuickDocTest tem como objetivo medir indicadores de desempenho relacionados à digitação, incluindo velocidade, precisão, consistência e eficiência operacional.',
        'Os resultados obtidos possuem caráter informativo e avaliativo, não constituindo certificação profissional regulamentada, habilitação legal ou credenciamento oficial.',
      ],
    },
    {
      heading: 'Responsabilidades do Usuário',
      paragraphs: ['O usuário compromete-se a:'],
      list: [
        'Fornecer informações verdadeiras;',
        'Não utilizar softwares de automação;',
        'Não empregar ferramentas de preenchimento automático;',
        'Não manipular artificialmente os resultados;',
        'Utilizar a plataforma de forma ética.',
      ],
    },
    {
      heading: 'Propriedade Intelectual',
      paragraphs: [
        'Todo o conteúdo do QuickDocTest, incluindo marca, logotipos, interface, algoritmos, relatórios e certificados, é protegido pelas legislações aplicáveis de propriedade intelectual.',
      ],
    },
    {
      heading: 'Disponibilidade',
      paragraphs: [
        'O serviço é oferecido conforme disponibilidade técnica, sem garantia de funcionamento ininterrupto.',
      ],
    },
    {
      heading: 'Alterações',
      paragraphs: [
        'Os presentes Termos poderão ser atualizados periodicamente.',
        'A continuidade do uso da plataforma implica concordância com eventuais alterações.',
      ],
    },
  ],
};

export const privacy = {
  title: 'Política de Privacidade',
  metaTitle: 'Política de Privacidade | QuickDocTest',
  updatedLabel: 'Última atualização:',
  intro:
    'O QuickDocTest respeita a privacidade dos usuários e adota medidas técnicas e organizacionais para proteção das informações processadas.',
  sections: [
    {
      heading: 'Dados Coletados',
      paragraphs: ['Podem ser coletados:'],
      list: [
        'Nome;',
        'E-mail;',
        'Idioma selecionado;',
        'Resultados dos testes;',
        'Dados estatísticos de desempenho;',
        'Informações técnicas do navegador;',
        'Endereço IP para segurança e prevenção de fraudes.',
      ],
    },
    {
      heading: 'Finalidade da Coleta',
      paragraphs: ['Os dados são utilizados para:'],
      list: [
        'geração dos resultados;',
        'emissão de certificados;',
        'validação de autenticidade;',
        'melhoria contínua da plataforma;',
        'prevenção de uso indevido.',
      ],
    },
    {
      heading: 'Compartilhamento',
      paragraphs: [
        'O QuickDocTest não comercializa dados pessoais.',
        'As informações somente poderão ser compartilhadas quando:',
      ],
      list: [
        'exigido por lei;',
        'necessário para hospedagem ou operação técnica do sistema;',
        'autorizado pelo próprio usuário.',
      ],
    },
    {
      heading: 'Segurança',
      paragraphs: ['São aplicadas medidas razoáveis de proteção para reduzir riscos de:'],
      list: ['acesso não autorizado;', 'alteração indevida;', 'perda de informações.'],
    },
    {
      heading: 'Retenção',
      paragraphs: [
        'Os dados poderão ser mantidos enquanto necessários para a operação da plataforma e para validação futura dos certificados emitidos.',
      ],
    },
    {
      heading: 'Direitos do Usuário',
      paragraphs: ['O usuário poderá solicitar:'],
      list: [
        'acesso aos dados;',
        'correção;',
        'exclusão quando aplicável;',
        'esclarecimentos sobre o tratamento das informações.',
      ],
    },
  ],
};

export const instructions = {
  title: 'Como Funciona o QuickDocTest',
  subtitle: 'Entenda como sua proficiência em digitação é avaliada.',
  metaTitle: 'Como Funciona | QuickDocTest',
  intro: [
    'O QuickDocTest utiliza métricas internacionalmente reconhecidas para avaliar desempenho em digitação de forma objetiva e padronizada.',
    'Durante o teste, um texto será apresentado ao participante, que deverá reproduzi-lo da forma mais fiel possível dentro do tempo estabelecido.',
  ],
  metricsHeading: 'Métricas avaliadas',
  metrics: [
    {
      title: 'Velocidade Líquida (Net WPM)',
      body: 'Quantidade de palavras efetivamente digitadas por minuto considerando os erros cometidos. Representa a produtividade real do participante.',
    },
    {
      title: 'Velocidade Bruta (Gross WPM)',
      body: 'Quantidade total de palavras digitadas por minuto sem descontar erros. Representa a velocidade absoluta de digitação.',
    },
    {
      title: 'Precisão (Accuracy)',
      body: 'Percentual de caracteres digitados corretamente. Quanto maior a precisão, maior a qualidade da digitação.',
    },
    {
      title: 'CPM (Characters Per Minute)',
      body: 'Quantidade de caracteres digitados por minuto. Indicador amplamente utilizado em avaliações internacionais.',
    },
    {
      title: 'Consistência',
      body: 'Mede a estabilidade do desempenho ao longo do teste. Menores oscilações resultam em maior consistência.',
    },
    {
      title: 'Latência',
      body: 'Tempo médio entre pressionamentos de teclas. Valores menores indicam maior fluidez operacional.',
    },
    {
      title: 'Taxa de Erros',
      body: 'Quantidade de caracteres incorretos inseridos durante o teste.',
    },
    {
      title: 'Completude',
      body: 'Percentual do texto concluído dentro do tempo disponível.',
    },
    {
      title: 'Performance Geral',
      body: 'Indicador composto que considera velocidade, precisão, consistência e fluidez.',
    },
  ],
  levelsHeading: 'Classificação de proficiência',
  tableLevel: 'Nível',
  tableDescription: 'Descrição',
  levels: [
    { level: 'Iniciante', range: 'até 25 WPM' },
    { level: 'Básico', range: '26 a 40 WPM' },
    { level: 'Intermediário', range: '41 a 60 WPM' },
    { level: 'Avançado', range: '61 a 80 WPM' },
    { level: 'Profissional', range: '81 a 100 WPM' },
    { level: 'Especialista', range: 'acima de 100 WPM' },
  ],
  note: 'As faixas acima possuem caráter indicativo e podem variar conforme idioma, texto utilizado e metodologia de avaliação.',
};
