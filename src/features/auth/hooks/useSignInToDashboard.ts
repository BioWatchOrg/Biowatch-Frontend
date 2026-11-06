import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../../store/userStore';

export function useSignInToDashboard(): () => void {
  const navigate = useNavigate();
  const signIn = useUserStore((state) => state.signIn);

  return () => {
    signIn();
    navigate('/dashboard');
  };
}
