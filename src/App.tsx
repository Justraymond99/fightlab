import { useGamepad } from './hooks/useGamepad';

function App() {
  const { connected, gamepadName, inputs, clearInputs } = useGamepad();

  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">STREET FIGHTER 6 · TERRY</p>
        <h1>FightLab</h1>
        <p className="subtitle">Controller-first execution training.</p>
      </section>

      <section className="panel status-panel">
        <div>
          <p className="panel-label">Controller</p>
          <h2>{connected ? 'Connected' : 'Waiting for input'}</h2>
          <p className="muted">
            {gamepadName ?? 'Connect a controller and press any button.'}
          </p>
        </div>
        <span className={connected ? 'status-dot online' : 'status-dot'} />
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <p className="panel-label">Live feed</p>
            <h2>Input History</h2>
          </div>
          <button type="button" onClick={clearInputs} disabled={inputs.length === 0}>
            Clear
          </button>
        </div>

        {inputs.length === 0 ? (
          <div className="empty-state">
            <strong>No inputs yet.</strong>
            <span>Directions will appear as numpad notation.</span>
          </div>
        ) : (
          <ol className="input-list">
            {inputs.map((input) => (
              <li key={input.id}>
                <span className="input-token">{input.label}</span>
                <span className="input-time">{Math.round(input.timestamp)} ms</span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}

export default App;
