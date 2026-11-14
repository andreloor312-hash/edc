import { Container, Group, Title, Button, Text, Badge, Box } from '@mantine/core';
import { IconCompass, IconLogout, IconUser } from '@tabler/icons-react';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';
// ... dentro del Group izquierdo junto al logo:
<Group gap="xs" ml="md">
  <Button component={Link} to="/" variant="subtle" size="xs">
    Planificador
  </Button>
  <Button component={Link} to="/resenas" variant="subtle" size="xs">
    Reseñas
  </Button>
</Group>

export default function Navbar() {
  const { user, openAuthModal, logout } = useAuthStore();

  return (
    <Box component="header" py="md" style={{ borderBottom: '1px solid #e9ecef' }}>
      <Container size="xl">
        <Group justify="space-between">
          {/* Logo / Nombre de la plataforma */}
          <Group gap="xs">
            <IconCompass size={28} color="#228be6" />
            <Title order={4}>RutaEcuador</Title>
            <Badge variant="dot" color="green" visibleFrom="xs">
              Planificador Oficial
            </Badge>
          </Group>

          {/* Controles de sesión dinámicos */}
          {user ? (
            <Group>
              <Group gap="xs">
                <IconUser size={18} />
                <Text size="sm" fw={500}>
                  {user.displayName || user.email}
                </Text>
              </Group>
              <Button
                variant="subtle"
                color="red"
                size="xs"
                leftSection={<IconLogout size={16} />}
                onClick={logout}
              >
                Salir
              </Button>
            </Group>
          ) : (
            <Button size="sm" onClick={openAuthModal}>
              Iniciar Sesión / Registrarse
            </Button>
          )}
        </Group>
      </Container>
    </Box>
  );
}