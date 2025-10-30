import { useSearchParams } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';

const AuthPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get('mode') || 'login';

  const switchToSignup = () => {
    setSearchParams({ mode: 'signup' });
  };

  const switchToLogin = () => {
    setSearchParams({ mode: 'login' });
  };

  return (
    <>
      {mode === 'login' ? (
        <LoginForm onSwitchToSignup={switchToSignup} />
      ) : (
        <SignupForm onSwitchToLogin={switchToLogin} />
      )}
    </>
  );
};

export default AuthPage;