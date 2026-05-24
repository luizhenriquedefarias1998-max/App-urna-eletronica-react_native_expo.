# 🗳️ Urna Eletrônica - React Native & Expo

Este é um aplicativo de Urna Eletrônica desenvolvido em **React Native** utilizando o ecossistema **Expo**. O projeto simula o processo de votação presidencial de forma interativa, permitindo o cadastro personalizado de candidatos e a apuração dos resultados em tempo real.

Desenvolvido com dedicação por **Luiz Henrique de Farias**.

---

## 📱 Funcionalidades

- **Menu Principal:** Navegação simples entre as áreas de cadastro, votação e apuração.
- **Cadastro de Candidatos:** Permite registrar o nome do candidato, um número identificador de exatamente 2 dígitos e carregar uma foto diretamente da galeria do telemóvel.
- **Simulação de Voto Fiel:** Interface que imita o visor e o teclado de uma urna eletrônica real, com botões funcionais de *BRANCO*, *CORRIGE* e *CONFIRMA*.
- **Efeitos Sonoros:** Emissão do som característico ("Plim Plim") ao confirmar com sucesso ou votar em branco.
- **Apuração Completa:** Tela de resultados detalhada exibindo os votos individuais de cada candidato, além da contagem de votos em branco e votos nulos.
- **Zerar Urna:** Opção rápida para reiniciar a votação e limpar os dados armazenados temporariamente.

---

## 🗂️ Estrutura e Descrição dos Arquivos

O projeto é composto pelos seguintes ficheiros essenciais na sua raiz:

- 🗳️ **`App.js`**: O coração do projeto. Contém toda a lógica em React Native, gerenciamento de estados, interface visual de todas as telas, validações de voto e controlo de áudio/imagem.
- 📦 **`package.json`**: Manifesto do projeto que lista o nome do app, scripts de execução e as dependências necessárias (como `expo-av` para som e `expo-image-picker` para a foto).
- ⚙️ **`app.json`**: Ficheiro de configuração do Expo. Define detalhes nativos do dispositivo, como o nome exibido no ecrã do telemóvel, ícone e permissões de privacidade.
- 🛠️ **`eas.json`**: Configuração do serviço de build do Expo (EAS). Configurado com `"buildType": "apk"` para permitir a compilação de um instalador Android direto.
- 🔒 **`package-lock.json`**: Registra as versões exatas de cada dependência instalada pelo Node (npm), garantindo estabilidade e consistência ao rodar o projeto em qualquer máquina.

> *Nota: A pasta pesada `node_modules/` e os ficheiros temporários `.expo/` foram devidamente ignorados no controlo de versão.*

---

## 🛠️ Tecnologias Utilizadas

- **React Native** (com React Hooks como `useState` e `useEffect`)
- **Expo Framework**
- **Expo AV** (Reprodução de áudio)
- **Expo Image Picker** (Acesso à galeria de imagens)

---

## 🚀 Como Executar o Projeto Localmente

1. **Clonar o repositório:**
   ```bash
   git clone [https://github.com/luizhenriquedefarias1998-max/urna-eletronica-react_native_expo.git](https://github.com/luizhenriquedefarias1998-max/urna-eletronica-react_native_expo.git)
Entrar na pasta do projeto:

Bash
cd urna-eletronica-react_native_expo
Instalar as dependências:

Bash
npm install
Iniciar o servidor do Expo (Limpando o cache):

Bash
npx expo start -c
Abra o aplicativo Expo Go no seu telemóvel e escaneie o QR Code exibido no terminal.

📦 Como Gerar o Ficheiro APK (Instalador Android)
Este projeto está pronto para ser compilado via EAS Build:

Bash
eas build --profile preview --platform android
O comando gerará um link e um QR Code para descarregar o ficheiro .apk diretamente no telemóvel.
