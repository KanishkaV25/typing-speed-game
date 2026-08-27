import { useState } from "react";
import { gqlClient } from "../../graphql/client";
import { LOGIN_MUTATION } from "../../graphql/mutations";
import { useAuth, User } from "../../context/AuthContext";

interface LoginFormProps {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}

interface LoginResponse {
  login: {
    token: string;
    user: User;
  };
}

export default function LoginForm({ onSuccess, onSwitchToRegister }: LoginFormProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await gqlClient<LoginResponse>(LOGIN_MUTATION, { email, password });
      login(data.login.token, data.login.user);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-header">
        <h1>key_pace</h1>
        <p>Authenticate to continue</p>
      </div>

      <form className="kp-auth-form" onSubmit={handleSubmit}>
        {error && (
          <div className="kp-error-box">
            <span>⚠️</span> {error}
          </div>
        )}

        <div className="kp-form-group">
          <label htmlFor="login-email">EMAIL</label>
          <input
            id="login-email"
            type="email"
            required
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="kp-form-group">
          <label htmlFor="login-password">PASSWORD</label>
          <input
            id="login-password"
            type="password"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-auth-submit" disabled={loading}>
          {loading ? "AUTHENTICATING..." : "Log in"}
        </button>

        {onSwitchToRegister && (
          <div className="auth-footer-links">
            <button type="button" onClick={onSwitchToRegister}>
              Create account
            </button>
          </div>
        )}
      </form>
    </div>
  );
}


