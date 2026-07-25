import { useGamepad } from './hooks/useGamepad';

function App() {
  const { connected, gamepadName, inputs, clearInputs } = useGamepad();

  return (
    <main className="app-shell">
      <header className="topbar">
        <div>
          <p className="brand-kicker">Execution training</p>
          <h1>FightLab</h1>
        </div>

        <div className="controller-badge" aria-live="polite">
          <span className={connected ? 'status-dot online' : 'status-dot'} />
          <div>
            <strong>{connected ? 'Controller connected' : 'Controller offline'}</strong>
            <span>{gamepadName ?? 'Press any controller button'}</span>
          </div>
        </div>
      </header>

      <section className="dashboard-grid">
        <section className="panel session-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-label">Today&apos;s session</p>
              <h2>Training setup</h2>
            </div>
            <span className="session-pill">Ready</span>
          </div>

          <div className="field-grid">
            <label>
              <span>Character</span>
              <select defaultValue="Terry">
                <option>Terry</option>
                <option>Ken</option>
                <option>Ryu</option>
                <option>Akuma</option>
              </select>
            </label>

            <label>
              <span>Drill</span>
              <select defaultValue="Combo Trainer">
                <option>Combo Trainer</option>
                <option>Hit Confirm Trainer</option>
                <option>Anti-Air Trainer</option>
                <option>Whiff Punish Trainer</option>
              </select>
            </label>
          </div>

          <button className="primary-action" type="button">
            Start training
          </button>
        </section>

        <section className="panel stats-panel">
          <div>
            <p className="panel-label">Today&apos;s stats</p>
            <h2>Session overview</h2>
          </div>

          <dl className="stats-grid">
            <div>
              <dt>Accuracy</dt>
              <dd>--</dd>
            </div>
            <div>
              <dt>Reaction</dt>
              <dd>--</dd>
            </div>
            <div>
              <dt>Successes</dt>
              <dd>0</dd>
            </div>
            <div>
              <dt>Drops</dt>
              <dd>0</dd>
            </div>
          </dl>
        </section>
      </section>

      <section className="panel input-panel">
        <div className="panel-heading">
          <div>
            <p className="panel-label">Live feed</p>
            <h2>Input history</h2>
          </div>
          <button className="secondary-action" type="button" onClick={clearInputs} disabled={inputs.length === 0}>
            Clear
          </button>
        </div>

        {inputs.length === 0 ? (
          <div className="empty-state">
            <strong>No inputs yet</strong>
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
