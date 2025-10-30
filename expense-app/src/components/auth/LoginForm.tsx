import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';

interface LoginFormProps {
  onSwitchToSignup: () => void;
}

const LoginForm = ({ onSwitchToSignup }: LoginFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null)
    setLoading(true)

    try {
      const user = await authService.login(formData.email, formData.password);
      console.log('Logged in: ', user);

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login Failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="auth-container p-4">
      <div className="auth-card">
        <h1 className="auth-title">
          Expense<br/>Tracker
        </h1>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder='Enter your email here...'
              required
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder='Enter your password here...'
              required
            />
          </div>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Logging in...' : "Login"}
          </button>
        </form>

        <div className="auth-switch">
          <p>Don't have an account?</p>
          <button onClick={onSwitchToSignup} className="link-button">
            Signup Here!
          </button>
        </div>

        <p className="auth-description">
          Keep track of your monthly expenses<br/>and budgeting.
        </p>
      </div>
    </div>
  );
};

export default LoginForm;