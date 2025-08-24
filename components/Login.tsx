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
}

const LoginContext = createContext<LoginContextValue | undefined>(undefined);


export const validateCredentials = (username: string, password: string) =>
  username.trim() === 'user' && password === 'pass123';


export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {

    if (username.trim() === 'user' && password === 'pass123') {

      setIsLoggedIn(true);
      setShowLogin(false);
      setUsername('');
      setPassword('');
    } else {
      Alert.alert('Login failed', 'Invalid username or password');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
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
    <TouchableOpacity style={styles.loginButton} onPress={handleLogout}>
      <Text style={styles.loginButtonText}>Logout</Text>
    </TouchableOpacity>
  ) : (
    <TouchableOpacity style={styles.loginButton} onPress={() => setShowLogin(true)}>
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
  } = useLogin();

  return (
    <Modal
      transparent
      animationType="fade"
      visible={showLogin && !isLoggedIn}
      onRequestClose={() => setShowLogin(false)}
    >
      <View style={styles.modalOverlay}>
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
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  loginButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#00C805',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  loginButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
  loginForm: {
    backgroundColor: '#1C1C1E',
    padding: 20,
    borderRadius: 8,
    width: '80%',
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
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#555',
    marginTop: 8,
  },

});

export default LoginProvider;
