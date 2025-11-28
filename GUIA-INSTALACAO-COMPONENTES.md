# GUIA DE INSTALAÇÃO - Componentes Android SDK Faltantes

## ✅ COMPONENTES JÁ INSTALADOS
- ✓ Android SDK
- ✓ Platform Tools (adb)
- ✓ Build Tools 36.1.0
- ✓ SDK Platform android-36
- ✓ Java JDK 17
- ✓ Node.js v22.14.0
- ✓ Bubblewrap CLI

## ❌ COMPONENTES FALTANDO (NECESSÁRIOS)

### 1. Android SDK Command-line Tools
**Status:** NÃO INSTALADO
**Necessário para:** sdkmanager, avdmanager, etc.

### 2. Build Tools 34.0.0
**Status:** Tem versão 36.1.0, mas precisa da 34.0.0
**Necessário para:** Compatibilidade com Bubblewrap e Android 14

### 3. Android 14 (API Level 34)
**Status:** Tem android-36, mas precisa da API 34
**Necessário para:** Build de apps compatíveis com Android 14

---

## 📋 PASSO A PASSO PARA INSTALAR

### Passo 1: Abrir Android Studio
1. Abra o Android Studio
2. Na tela inicial, clique em **"More Actions"** (três pontos verticais)
3. Selecione **"SDK Manager"**

### Passo 2: Instalar SDK Platforms
1. Na aba **"SDK Platforms"**:
   - ☑ Marque **"Android 14.0 (UpsideDownCake)"** ou **"API Level 34"**
   - Clique em **"Apply"**
   - Aguarde o download e instalação

### Passo 3: Instalar SDK Tools
1. Clique na aba **"SDK Tools"**
2. Marque **"Show Package Details"** (canto inferior direito)
3. Instale os seguintes componentes:

   **a) Android SDK Command-line Tools (latest):**
   - ☑ Marque a versão mais recente
   
   **b) Android SDK Build-Tools:**
   - Expanda a lista
   - ☑ Marque **"34.0.0"** (mantenha a 36.1.0 também)

4. Clique em **"Apply"**
5. Aguarde o download e instalação

### Passo 4: Verificar Instalação
Após a instalação, execute novamente:
```powershell
powershell -ExecutionPolicy Bypass -File .\check-components.ps1
```

### Passo 5: Configurar Variáveis de Ambiente
Depois que todos os componentes estiverem instalados, execute como **Administrador**:
```powershell
powershell -ExecutionPolicy Bypass -File .\configurar-android-sdk.ps1
```

---

## 🎯 CHECKLIST FINAL

Após instalar tudo, você deve ter:
- [ ] Android SDK Command-line Tools
- [ ] Build Tools 34.0.0 (além da 36.1.0)
- [ ] Android 14 (API 34) (além da API 36)
- [ ] Variáveis de ambiente configuradas (ANDROID_HOME, PATH)

---

## 🔍 VERIFICAÇÃO RÁPIDA

Execute este comando para verificar se está tudo OK:
```powershell
# Verificar componentes
powershell -ExecutionPolicy Bypass -File .\check-components.ps1

# Verificar variáveis de ambiente (após configurar)
echo $env:ANDROID_HOME
adb --version
sdkmanager --list
```

---

## 📝 NOTAS IMPORTANTES

1. **Não desinstale** a versão 36.1.0 do Build Tools - mantenha ambas (34.0.0 e 36.1.0)
2. **Não desinstale** o Android 36 - mantenha ambos (API 34 e 36)
3. O Bubblewrap precisa especificamente da **API 34** e **Build Tools 34.x**
4. Após instalar, **reinicie o terminal** para carregar as variáveis de ambiente

---

## ❓ PROBLEMAS COMUNS

### "SDK Manager não abre"
- Certifique-se de que o Android Studio está atualizado
- Tente: Tools > SDK Manager (dentro do Android Studio)

### "Componentes não aparecem"
- Marque "Show Package Details" no canto inferior direito
- Verifique se está na aba correta (SDK Platforms vs SDK Tools)

### "Erro ao instalar"
- Verifique sua conexão com a internet
- Execute o Android Studio como Administrador
- Limpe o cache: File > Invalidate Caches / Restart

---

## 🚀 PRÓXIMOS PASSOS

Depois de instalar tudo:
1. ✅ Execute `check-components.ps1` para verificar
2. ✅ Execute `configurar-android-sdk.ps1` como Admin
3. ✅ Reinicie o terminal
4. ✅ Teste um build real no WebToAppify
