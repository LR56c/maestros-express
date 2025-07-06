import { create } from "zustand"

interface AuthState {
  session: any;
  isLoading: boolean;
  isAuthenticated: boolean;
  setSession: ( session: any ) => void;
  setLoading: ( loading: boolean ) => void;
}

export const useAuthStore = create<AuthState>( ( set ) => (
  {
    session        : null,
    isLoading      : true,
    isAuthenticated: false,
    setSession     : ( session ) => set(
      { session, isAuthenticated: !!session?.user } ),
    setLoading     : ( isLoading ) => set( { isLoading } )
  }
) )