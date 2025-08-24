import React, { createContext, useContext, useState } from 'react';

import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Modal } from 'react-native';



interface LoginContextValue {
  isLoggedIn: boolean;
  showLogin: boolean;
  username: string;
  password: string;
  setShowLogin: (v: boolean) => void;
  setUsername: (v: string) => void;
  setPassword: (v: string) => void;
  handleLogin: () => void;
  handleLogout: () => void;
  showCreate: boolean;
  setShowCreate: (v: boolean) => void;
  handleCreateAccount: () => void;
  createUsername: string;
  setCreateUsername: (v: string) => void;
  createPassword: string;
  setCreatePassword: (v: string) => void;
}

const LoginContext = createContext<LoginContextValue | undefined>(undefined);


export const validateCredentials = (username: string, password: string) =>
  username.trim() === 'user' && password === 'pass123';


export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // Demo: store accounts in memory (object). Replace with persistent storage for real app.
  const [accounts, setAccounts] = useState<{ [user: string]: string }>({ user: 'pass123' });
  const [createUsername, setCreateUsername] = useState('');
  const [createPassword, setCreatePassword] = useState('');

  const handleLogin = () => {
    console.log('LoginProvider: handleLogin attempt', { username });
    if (accounts[username.trim()] && accounts[username.trim()] === password) {
      console.log('LoginProvider: login success');
      setIsLoggedIn(true);
      setShowLogin(false);
      setUsername('');
      setPassword('');
    } else {
      console.log('LoginProvider: login failed');
      Alert.alert('Login failed', 'Invalid username or password');
    }
  };

  const handleLogout = () => {
    console.log('LoginProvider: handleLogout');
    setIsLoggedIn(false);
  };

  const handleCreateAccount = () => {
    if (!createUsername.trim() || !createPassword) {
      Alert.alert('Error', 'Username and password required');
      return;
    }
    if (accounts[createUsername.trim()]) {
      Alert.alert('Error', 'Username already exists');
      return;
    }
    setAccounts((prev) => ({ ...prev, [createUsername.trim()]: createPassword }));
    setShowCreate(false);
    setShowLogin(true);
    setUsername(createUsername.trim());
    setPassword(createPassword);
    setCreateUsername('');
    setCreatePassword('');
    Alert.alert('Account created', 'You can now log in.');
  };

  return (
    <LoginContext.Provider
      value={{
        isLoggedIn,
        showLogin,
        username,
        password,
        setShowLogin,
        setUsername,
        setPassword,
        handleLogin,
        handleLogout,
        showCreate,
        setShowCreate,
        handleCreateAccount,
        createUsername,
        setCreateUsername,
        createPassword,
        setCreatePassword,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => {
  const ctx = useContext(LoginContext);
  if (!ctx) throw new Error('useLogin must be used within LoginProvider');
  return ctx;
};

export const LoginButton = () => {
  const { isLoggedIn, setShowLogin, handleLogout } = useLogin();
  return isLoggedIn ? (
    <TouchableOpacity style={styles.loginButton} onPress={() => { console.log('LoginButton: Logout pressed'); handleLogout(); }}>
      <Text style={styles.loginButtonText}>Logout</Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity style={styles.loginButton} onPress={() => { console.log('LoginButton: Login pressed'); setShowLogin(true); }}>
      <Text style={styles.loginButtonText}>Login</Text>
    </TouchableOpacity>
  );
};

export const LoginForm = () => {
  const {
    showLogin,
    isLoggedIn,
    username,
    password,
    setUsername,
    setPassword,
    setShowLogin,
    handleLogin,
    showCreate,
    setShowCreate,
    handleCreateAccount,
    createUsername,
    setCreateUsername,
    createPassword,
    setCreatePassword,
  } = useLogin();

  React.useEffect(() => {
    console.log('LoginForm: visibility change', { showLogin, isLoggedIn, username });
  }, [showLogin, isLoggedIn, username]);

  if (showCreate) {
    return (
      <View style={[styles.modalOverlay, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }]}> 
        <View style={styles.loginForm}>
          <Text style={styles.loginTitle}>Create Account</Text>
          <TextInput
            style={styles.input}
            placeholder="New Username"
            placeholderTextColor="#888"
            keyboardAppearance="dark"
            value={createUsername}
            onChangeText={setCreateUsername}
          />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            placeholderTextColor="#888"
            keyboardAppearance="dark"
            secureTextEntry
            value={createPassword}
            onChangeText={setCreatePassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
            <Text style={styles.buttonText}>Create</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => { setShowCreate(false); setShowLogin(true); }}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (!(showLogin && !isLoggedIn)) return null;
  return (
    <View style={[styles.modalOverlay, { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }]}> 
      <View style={styles.loginForm}>
        <Text style={styles.loginTitle}>User Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#888"
          keyboardAppearance="dark"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          keyboardAppearance="dark"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => setShowLogin(false)}
        >
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#2196F3', marginTop: 8 }]}
          onPress={() => { setShowLogin(false); setShowCreate(true); }}
        >
          <Text style={[styles.buttonText, { color: '#fff' }]}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: '#00C805',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignSelf: 'flex-end',
    marginTop: 10,
    marginRight: 10,
  },
  loginButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  loginForm: {
    backgroundColor: '#222',
    padding: 28,
    borderRadius: 12,
    width: '90%',
    maxWidth: 340,
    borderWidth: 2,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
    alignItems: 'stretch',
  },
  loginTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#1C1C1E',
    padding: 10,
    borderRadius: 4,
    color: '#fff',
  },
  button: {
    backgroundColor: '#00C805',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  cancelButton: {
    backgroundColor: '#555',
    marginTop: 8,
  },

});

export default LoginProvider;
