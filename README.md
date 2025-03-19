# **Sistema de Registro de Horas Complementares - Frequentium** :books:

## Descrição :page_facing_up:

Este projeto visa simplificar o processo de adição de horas complementares para alunos que participam do sistema [Meu Racha](https://meu-racha.vercel.app/). A aplicação permite o registro de participantes, incluindo informações como nome, matrícula e data do evento, e facilita a inserção dessas informações no **SIGAA** para a validação e contabilização das horas complementares.

## Funcionalidades :star2:

- ✅ Adicionar e gerenciar alunos.
- ✅ Registrar a participação dos alunos em eventos do sistema **Meu Racha**.
- ✅ Armazenar informações dos alunos, como nome, matrícula e data do evento.
- ✅ Facilitar a inserção das horas complementares no **SIGAA**.
- 🌟 Interface simples e intuitiva com funcionalidades de editar e excluir registros de alunos.

## Tecnologias Utilizadas :computer:

- **Frontend**: 
  - React
  - TypeScript
  - Tailwind CSS
  - React Icons
- **Backend**: (não especificado, se necessário)
  - (Detalhar as tecnologias do backend, como Node.js, Express, etc.)
  
## Instalação :package:

### Pré-requisitos :wrench:

- [Node.js](https://nodejs.org/) instalado.
- [Git](https://git-scm.com/) instalado.

### Passos para rodar a aplicação :rocket:

1. Clone este repositório para sua máquina local:

   ```bash
   git clone https://github.com/seu-usuario/frequentium.git
   ```

2. Navegue até a pasta do projeto:

   ```bash
   cd frequentium
   ```

3. Instale as dependências necessárias:

   ```bash
   npm install
   ```

4. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Acesse a aplicação em seu navegador em `http://localhost:5173/`.

## Como Usar :gear:

1. **Adicionar Novo Aluno**: Clique no botão **"Adicionar Novo Aluno"** no dashboard para adicionar um aluno ao sistema.
2. **Importar JSON**: Use o botão **"Importar JSON"** para carregar registros de alunos a partir de um arquivo JSON.
3. **Visualizar Alunos**: Todos os alunos registrados são exibidos em uma tabela, com a opção de **editar** ou **excluir** registros.

## Estrutura de Diretórios :file_folder:

```bash
/
├── public/              # Arquivos públicos (como imagens, ícones, etc.)
├── src/                 # Código-fonte da aplicação
│   ├── assets/          # Arquivos estáticos, como imagens
│   ├── components/      # Componentes React reutilizáveis
│   ├── pages/           # Páginas principais da aplicação
│   ├── services/        # Funções para manipulação de dados
│   └── App.tsx          # Arquivo principal da aplicação
├── tailwind.config.js   # Configuração do Tailwind CSS
└── package.json         # Dependências e scripts
```

## Contribuindo :octocat:

1. Faça um **fork** deste repositório.
2. Crie uma nova branch para suas alterações:

   ```bash
   git checkout -b minha-feature
   ```

3. Realize suas modificações e faça **commits** adequados.

4. Submeta suas alterações através de um **pull request**.