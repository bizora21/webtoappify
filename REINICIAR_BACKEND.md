# ⚠️ IMPORTANTE: REINICIAR O BACKEND

Você acabou de instalar componentes do Android SDK e configurar variáveis de ambiente.
Para que o WebToAppify reconheça essas mudanças e consiga fazer builds reais, você **PRECISA** reiniciar o backend.

## 🔄 COMO REINICIAR

1. **Vá para o terminal onde o `npm run dev` está rodando**
   (Provavelmente o terminal que está aberto há mais de 1 hora)

2. **Pare o servidor**
   - Clique no terminal
   - Pressione `Ctrl + C`
   - Digite `S` (ou `Y`) para confirmar

3. **Inicie novamente**
   ```powershell
   npm run dev
   ```

## 🧪 COMO TESTAR O BUILD REAL

1. Acesse: http://localhost:5173
2. Preencha o formulário com sua URL real
3. Faça upload de um ícone (PNG, 512x512 recomendado)
4. Clique em "Build Android App"

Se tudo estiver correto, você verá os logs do Bubblewrap e Gradle, e no final poderá baixar o `.aab` (para Play Store) e `.apk` (para testar no celular).

## 🆘 SE O BUILD FALHAR

Verifique os logs no terminal do backend.
Se disser "Missing tools", significa que o backend não pegou as variáveis de ambiente.
Nesse caso:
1. Feche **TODOS** os terminais (VS Code inclusive se possível, mas apenas o terminal basta)
2. Abra um novo terminal
3. `cd c:\Users\USER\Desktop\webtoappify`
4. `npm run dev`
