import { useAuthStore, useAuthModal } from './store';

export const AuthModal = () => {
  const { isOpen } = useAuthModal();
  const { auth } = useAuthStore();

  // If we ever need a modal login again, we can implement it here.
  // For now, the main login flow is on the Home Page.
  return null;
};
export default useAuthModal;