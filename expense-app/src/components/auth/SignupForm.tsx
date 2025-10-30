import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import ShowPasswordIcon from "../../assets/passwordShow.svg?react";
import HidePasswordIcon from "../../assets/passwordHide.svg?react";

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

const SignupForm = ({ onSwitchToLogin }: SignupFormProps) => {
  const { signup } = useAuth()
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true)

    try {
      const user = await signup(formData.name, formData.email, formData.password)
      console.log("User Signed Up:", user)
      setError(null)
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
    <div className="background-layout justify-center items-center flex p-4">
      <div className="auth-card">
        <h1 className="auth-title">
          Welcome to Budgo
        </h1>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder='Enter your Name here...'
              required
            />
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder='Enter your Email here...'
              required
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <div className='relative w-full'>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder='Enter your Password here...'
                required
              />
              <div
                role='button'
                onClick={() => setShowPassword((prev) => !prev)}
                className='absolute right-3 top-1/2 -translate-y-1/2 border-0 cursor-pointer'
                title={showPassword ? "Click to hide password." : "Click to show password"}
              >
                {showPassword ? <HidePasswordIcon {...({
                      fill: "black",
                      width: 30,
                      height: 30,
                    } as React.SVGProps<SVGSVGElement>)}/> : <ShowPasswordIcon {...({
                      fill: "black",
                      width: 30,
                      height: 30,
                    } as React.SVGProps<SVGSVGElement>)}/>}
              </div>
            </div>
          </div>

          <p className="text-red-500 flex justify-center w-full h-5">
            {error || ''}
          </p>

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Signing up..." : "Signup"}
          </button>
        </form>

        <div className="auth-switch">
          <p>Already have an account?</p>
          <button onClick={onSwitchToLogin} className="link-button">
            Login Here!
          </button>
        </div>

        <p className="auth-description">
          Keep track of your monthly expenses<br/>and budgeting.
        </p>
      </div>
    </div>
  );
};

export default SignupForm;