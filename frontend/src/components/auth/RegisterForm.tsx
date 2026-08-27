import { useState } from "react";
import { gqlClient } from "../../graphql/client";
import { REGISTER_MUTATION } from "../../graphql/mutations";
import { useAuth, User } from "../../context/AuthContext";

interface RegisterFormProps {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}

interface RegisterResponse {
  register: {
    token: string;
    user: User;
  };
}

export default function RegisterForm({ onSuccess, onSwitchToLogin }: RegisterFormProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const data = await gqlClient<RegisterResponse>(REGISTER_MUTATION, { email, password });
      login(data.register.token, data.register.user);
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-header">
        <h1>key_pace</h1>
        <p>Join the rhythm.</p>
      </div>

      <form className="kp-auth-form" onSubmit={handleSubmit}>
        {error && (
          <div className="kp-error-box">
            <span>⚠️</span> {error}
          </div>
        )}

        <div className="kp-form-group">
          <label htmlFor="reg-email">EMAIL ADDRESS</label>
          <input
            id="reg-email"
            type="email"
            required
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="kp-form-group">
          <label htmlFor="reg-password">PASSWORD</label>
          <input
            id="reg-password"
            type="password"
            required
            minLength={6}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="kp-form-group">
          <label htmlFor="reg-confirm-password">CONFIRM PASSWORD</label>
          <input
            id="reg-confirm-password"
            type="password"
            required
            minLength={6}
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn-auth-submit" disabled={loading}>
          {loading ? "CREATING..." : "CREATE ACCOUNT →"}
        </button>

        {onSwitchToLogin && (
          <div className="auth-footer-links">
            Already have an account?{" "}
            <button type="button" onClick={onSwitchToLogin}>
              Log in
            </button>
          </div>
        )}
      </form>
    </div>
  );
}


