import { useState } from 'react';
import {
  Modal,
  TextInput,
  PasswordInput,
  Button,
  Stack,
  Text,
  Anchor,
  Alert,
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { useAuthStore } from '../store/useAuthStore';

export default function AuthModal() {
  const { authModalOpen, closeAuthModal } = useAuthStore();

  // Alternar entre Iniciar Sesión (false) y Registrarse (true)
  const [isRegister, setIsRegister] = useState(false);

  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        // 1. Crear cuenta en Firebase
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // 2. Guardar el nombre del viajero en su perfil
        await updateProfile(userCredential.user, { displayName: nombre });
      } else {
        // Iniciar sesión existente
        await signInWithEmailAndPassword(auth, email, password);
      }

      // Limpiar campos y cerrar modal (App.jsx actualizará Zustand automáticamente)
      setNombre('');
      setEmail('');
      setPassword('');
      closeAuthModal();
    } catch (err) {
      // Traducción amigable de errores comunes de Firebase
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('Este correo ya está registrado. Intenta iniciar sesión.');
          break;
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          setError('Correo o contraseña incorrectos.');
          break;
        case 'auth/weak-password':
          setError('La contraseña debe tener al menos 6 caracteres.');
          break;
        default:
          setError('Ocurrió un error al autenticar. Verifica tus datos.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsRegister((prev) => !prev);
    setError('');
  };

  return (
    <Modal
      opened={authModalOpen}
      onClose={closeAuthModal}
      title={
        <Text fw={700} size="lg">
          {isRegister ? 'Crea tu cuenta de viajero' : 'Bienvenido de vuelta'}
        </Text>
      }
      centered
    >
      <form onSubmit={handleSubmit}>
        <Stack>
          {error && (
            <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
              {error}
            </Alert>
          )}

          {isRegister && (
            <TextInput
              label="Nombre completo"
              placeholder="Ej. Carlos Mendoza"
              required
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          )}

          <TextInput
            label="Correo electrónico"
            placeholder="viajero@ejemplo.com"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <PasswordInput
            label="Contraseña"
            placeholder="Mínimo 6 caracteres"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" fullWidth loading={loading} mt="sm">
            {isRegister ? 'Registrarme y desbloquear planificador' : 'Iniciar Sesión'}
          </Button>

          <Text size="sm" ta="center" c="dimmed">
            {isRegister ? '¿Ya tienes una cuenta? ' : '¿Aún no tienes cuenta? '}
            <Anchor component="button" type="button" onClick={toggleMode} fw={600}>
              {isRegister ? 'Inicia sesión aquí' : 'Regístrate gratis'}
            </Anchor>
          </Text>
        </Stack>
      </form>
    </Modal>
  );
}