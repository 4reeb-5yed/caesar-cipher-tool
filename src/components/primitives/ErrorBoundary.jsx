import { Component } from "react";

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div className="card" style={{ borderColor: "rgba(239,68,68,.4)" }}>
          <div className="empty-state">
            <i className="ti ti-bug" style={{ color: "var(--red)" }} />
            <p style={{ color: "var(--red)", fontWeight: 700 }}>Something went wrong in this panel</p>
            <p style={{ color: "var(--text3)", fontSize: 12 }}>{this.state.error.message}</p>
            <button className="btn btn-ghost btn-sm" onClick={() => this.setState({ error: null })} style={{ marginTop: 8 }}>
              <i className="ti ti-refresh" /> Retry
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}