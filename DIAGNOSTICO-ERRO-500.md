# 🔍 DIAGNÓSTICO DO ERRO 500

O erro 500 significa que algo falhou no backend ao processar sua requisição.

## 📋 PASSO A PASSO PARA DIAGNOSTICAR

### 1. Reiniciar o Backend (IMPORTANTE)
Fiz alterações no código. Você PRECISA reiniciar:

1. Vá no terminal do backend (`npm run dev`)
2. Pressione `Ctrl + C`
3. Digite: `npm run dev`

### 2. Testar o Health Check
Depois de reiniciar, abra no navegador:
```
http://localhost:3000/api/health
```

Você deve ver algo como:
```json
{
  "status": "ok",
  "appwrite": {
    "connected": true,
    ...
  }
}
```

Se aparecer `"connected": false`, o problema é com o Appwrite.

### 3. Ver o Erro Real no Terminal
Quando você tentar fazer o build novamente, olhe no terminal do backend.
Você deve ver uma mensagem de erro detalhada, algo como:

```
❌ Build error: [mensagem do erro]
```

**Copie essa mensagem e me envie!**

---

## 🔧 POSSÍVEIS CAUSAS DO ERRO 500

1. **Appwrite não conectado** - Verifique se as credenciais no `.env` estão corretas
2. **Collection não existe** - A collection "teste" precisa existir no Appwrite
3. **Campos faltando** - A collection precisa ter os campos corretos
4. **Backend não reiniciado** - Minhas alterações só funcionam após reiniciar

---

## ✅ PRÓXIMOS PASSOS

1. Reinicie o backend
2. Teste o health check
3. Tente o build novamente
4. Me envie o erro que aparecer no terminal do backend
