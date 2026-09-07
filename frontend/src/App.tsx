import './App.css';

// Componente placeholder. A UI de verdade (sidebar + hábitos + pomodoro) entra
// quando começarmos as telas — este arquivo é só para o projeto ter uma raiz
// válida e para confirmar que o front está de pé.
function App() {
  // import.meta.env é como o Vite entrega as variáveis de ambiente ao código do
  // navegador. Só aparecem aqui as que começam com VITE_ (ver frontend/.env).
  const apiUrl = import.meta.env.VITE_API_URL;

  return (
    <main className="app">
      <h1>Elite Tracker</h1>
      <p>Front-end no ar. Nenhuma tela construída ainda.</p>
      <p className="api">
        API configurada em: <code>{apiUrl}</code>
      </p>
    </main>
  );
}

export default App;
