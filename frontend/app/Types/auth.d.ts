export interface AuthContextType {
  token: string | null;
  currentUser: User | null;
  setCurrentUser: (User: User | null) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export interface AuthProviderProps {
  children: ReactNode;
}

declare global {
  interface Window {
    google: any;
  }
}