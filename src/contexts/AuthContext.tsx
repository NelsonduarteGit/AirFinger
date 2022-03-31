import { useEffect, useState, createContext, ReactNode } from "react";

import { auth, firebase } from "../services/firebase";

type User = {
  id: string;
  name: string;
  avatar: string;
};

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthContextProvider(props: AuthContextProviderProps) {
  const [user, setUser] = useState<User>();

  // keeep state changes, on F5 we dont lose user info
  useEffect(() => {
    // keep event listener in const to save it and unsub later
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // username, photoLocation, uniqueID
        const { displayName, photoURL, uid } = user;

        // what if theres no data?
        if (!displayName || !photoURL)
          throw new Error("Missing information from Google Account");

        // set user information
        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        });
      }
    });

    // stop listening when leaving page
    return () => {
      unsubscribe();
    };
  }, [user]);

  async function signInWithGoogle() {
    // provider is whos giving the log in - google
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);

    if (result.user) {
      // username, photoLocation, uniqueID
      const { displayName, photoURL, uid } = result.user;

      // what if theres no data?
      if (!displayName || !photoURL)
        throw new Error("Missing information from Google Account");

      // set user information
      setUser({
        id: uid,
        name: displayName,
        avatar: photoURL,
      });
    }
  }
  return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
  );
}
