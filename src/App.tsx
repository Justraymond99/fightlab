import { useGamepad } from './hooks/useGamepad';
import './input-engine.css';

function App() {
  const {
    connected,
    gamepadName,
    inputs,
    commands,
    diagnostics,
    clearInputs,
  } = useGamepad();
  const latestCommand = commands[0];

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
              <select defaultValue="Motion Trainer">
                <option>Motion Trainer</option>
                <option>Combo Trainer</option>
                <option>Hit Confirm Trainer</option>
                <option>Anti-Air Trainer</option>
              </select>
            </label>
          </div>

          <button className="primary-action" type="button" disabled={!connected}>
            {connected ? 'Start training' : 'Connect controller'}
          </button>
        </section>

        <section className="panel stats-panel">
          <div>
            <p className="panel-label">Live recognition</p>
            <h2>Latest command</h2>
          </div>

          {latestCommand ? (
            <div className="latest-command">
              <div className="command-grade" aria-label={`Grade ${latestCommand.grade.letter}`}>
                {latestCommand.grade.letter}
              </div>
              <strong>{latestCommand.notation}</strong>
              <span>{latestCommand.motion}</span>
              <small>
                {latestCommand.durationFrames}f · {Math.round(latestCommand.durationMs)} ms · {latestCommand.grade.score}%
              </small>
              <p>{latestCommand.grade.feedback}</p>
            </div>
          ) : (
            <div className="latest-command empty-command">
              <strong>--</strong>
              <span>Perform a motion + attack</span>
            </div>
          )}
        </section>
      </section>

      <section className="diagnostics-grid">
        <section className="panel diagnostics-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-label">Controller diagnostics</p>
              <h2>Raw device state</h2>
            </div>
            <span className="direction-readout">{diagnostics?.direction ?? 5}</span>
          </div>

          {diagnostics ? (
            <dl className="diagnostics-list">
              <div><dt>Mapping</dt><dd>{diagnostics.mapping}</dd></div>
              <div><dt>Frame</dt><dd>{diagnostics.frame}</dd></div>
              <div><dt>Polling</dt><dd>{diagnostics.pollingHz} Hz</dd></div>
              <div><dt>Pressed buttons</dt><dd>{diagnostics.pressedButtons.join(', ') || 'None'}</dd></div>
              <div><dt>Axes</dt><dd>{diagnostics.axes.map((axis) => axis.toFixed(2)).join(', ')}</dd></div>
            </dl>
          ) : (
            <div className="compact-empty">Connect your DualSense or Haute42.</div>
          )}
        </section>

        <section className="panel command-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-label">Parsed output</p>
              <h2>Command history</h2>
            </div>
          </div>

          {commands.length === 0 ? (
            <div className="compact-empty">Try 236 + LP, 214 + LK, or 623 + HP.</div>
          ) : (
            <ol className="command-list">
              {commands.map((command) => (
                <li key={command.id}>
                  <span className="history-grade">{command.grade.letter}</span>
                  <strong>{command.notation}</strong>
                  <span>{command.motion}</span>
                  <small>{command.durationFrames}f · {command.grade.score}%</small>
                </li>
              ))}
            </ol>
          )}
        </section>
      </section>

      <section className="panel input-panel">
        <div className="panel-heading">
          <div>
            <p className="panel-label">Normalized feed</p>
            <h2>Input history</h2>
          </div>
          <button className="secondary-action" type="button" onClick={clearInputs} disabled={inputs.length === 0}>
            Clear
          </button>
        </div>

        {inputs.length === 0 ? (
          <div className="empty-state">
            <strong>No inputs yet</strong>
            <span>Directions and attack buttons will appear here.</span>
          </div>
        ) : (
          <ol className="input-list">
            {inputs.slice(0, 30).map((input) => (
              <li key={input.id}>
                <span className="input-token">{input.value}</span>
                <span className="input-kind">{input.kind}</span>
                <span className="input-time">Frame {input.frame}</span>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}

export default App;