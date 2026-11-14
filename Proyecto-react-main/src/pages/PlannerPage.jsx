import { Link } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  Text,
  Button,
  Badge,
  Group,
  Overlay,
  Box,
  Stack,
  Title,
  Divider,
  ActionIcon,
} from '@mantine/core';
import {
  IconLock,
  IconMapPin,
  IconCalculator,
  IconTrash,
  IconCheck,
  IconStar,
} from '@tabler/icons-react';
import { useAuthStore } from '../store/useAuthStore';
import { useBudgetStore } from '../store/UseBudgetStore';

const DESTINOS_ECUADOR = [
  { id: 1, nombre: 'Baños de Agua Santa', region: 'Sierra', precioBase: 120, proveedores: '3 agencias verificadas' },
  { id: 2, nombre: 'Puerto López / Isla de la Plata', region: 'Costa', precioBase: 185, proveedores: '5 operadores locales' },
  { id: 3, nombre: 'Cuyabeno Lodge', region: 'Amazonía', precioBase: 310, proveedores: '2 eco-lodges directos' },
];

export default function PlannerPage() {
  const { user, openAuthModal } = useAuthStore();
  const { items, addItem, removeItem } = useBudgetStore();

  const totalPresupuesto = items.reduce((acc, item) => acc + item.precioBase, 0);

  return (
    <Container size="xl" py="xl">
      {/* Encabezado con botón directo a Reseñas */}
      <Group justify="space-between" align="flex-start" mb="xl">
        <div>
          <Title order={2} mb="xs">Planificador Integral de Viajes — Ecuador</Title>
          <Text c="dimmed">
            Compara rutas, arma tu presupuesto en tiempo real y reserva con operadores verificados.
          </Text>
        </div>

        <Button
          component={Link}
          to="/resenas"
          variant="light"
          color="teal"
          leftSection={<IconStar size={18} />}
        >
          Ver reseñas de viajeros
        </Button>
      </Group>

      <Grid>
        {/* Columna Izquierda: Catálogo de Destinos */}
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack>
            {DESTINOS_ECUADOR.map((destino) => {
              const yaAgregado = items.some((item) => item.id === destino.id);

              return (
                <Card key={destino.id} shadow="sm" padding="lg" radius="md" withBorder>
                  <Group justify="space-between" mb="xs">
                    <Group>
                      <IconMapPin size={20} color="#228be6" />
                      <Text fw={600} size="lg">{destino.nombre}</Text>
                    </Group>
                    <Badge color="teal" variant="light">{destino.region}</Badge>
                  </Group>

                  {user ? (
                    <Group justify="space-between" mt="md">
                      <div>
                        <Text size="sm" c="dimmed">Tarifa estimada todo incluido: <b>${destino.precioBase} USD</b></Text>
                        <Text size="xs" c="green">{destino.proveedores}</Text>
                      </div>
                      <Button
                        size="sm"
                        color={yaAgregado ? 'teal' : 'blue'}
                        variant={yaAgregado ? 'light' : 'filled'}
                        leftSection={yaAgregado ? <IconCheck size={16} /> : null}
                        disabled={yaAgregado}
                        onClick={() => addItem(user.uid, destino)}
                      >
                        {yaAgregado ? 'En tu itinerario' : 'Agregar al itinerario'}
                      </Button>
                    </Group>
                  ) : (
                    <Group justify="space-between" mt="md">
                      <Text size="sm" c="dimmed">Inicia sesión para ver tarifas desglosadas y contactos directos</Text>
                      <Button variant="light" size="xs" leftSection={<IconLock size={14} />} onClick={openAuthModal}>
                        Desbloquear precios
                      </Button>
                    </Group>
                  )}
                </Card>
              );
            })}
          </Stack>
        </Grid.Col>

        {/* Columna Derecha: Presupuesto y Reserva Directa */}
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Box pos="relative">
            <Card shadow="sm" padding="lg" radius="md" withBorder mih={320}>
              <Group mb="md">
                <IconCalculator size={22} color="#228be6" />
                <Text fw={700}>Mi Presupuesto de Viaje</Text>
              </Group>

              {items.length === 0 ? (
                <Text size="sm" c="dimmed">
                  Aún no has agregado destinos. Selecciona rutas de la lista para calcular tu viaje.
                </Text>
              ) : (
                <Stack gap="sm">
                  {items.map((item) => (
                    <Group key={item.id} justify="space-between" wrap="nowrap">
                      <div>
                        <Text size="sm" fw={500}>{item.nombre}</Text>
                        <Text size="xs" c="dimmed">${item.precioBase} USD</Text>
                      </div>
                      <ActionIcon
                        color="red"
                        variant="subtle"
                        onClick={() => removeItem(user.uid, item.id)}
                        title="Eliminar del presupuesto"
                      >
                        <IconTrash size={16} />
                      </ActionIcon>
                    </Group>
                  ))}

                  <Divider my="sm" />

                  <Group justify="space-between">
                    <Text fw={700}>Total Estimado:</Text>
                    <Text fw={700} size="lg" c="blue">${totalPresupuesto} USD</Text>
                  </Group>

                  <Button fullWidth color="green" mt="md">
                    Solicitar reserva consolidada
                  </Button>
                </Stack>
              )}
            </Card>

            {/* Capa de restricción si no hay usuario logueado */}
            {!user && (
              <Overlay color="#000" backgroundOpacity={0.65} blur={3} radius="md" center>
                <Stack align="center" p="md" ta="center">
                  <IconLock size={36} color="white" />
                  <Text c="white" fw={600}>Función exclusiva para viajeros registrados</Text>
                  <Text c="gray.3" size="xs">
                    Crea una cuenta gratuita para guardar tu presupuesto y evitar cotizaciones dispersas.
                  </Text>
                  <Button color="blue" onClick={openAuthModal}>
                    Iniciar Sesión / Registrarse
                  </Button>
                </Stack>
              </Overlay>
            )}
          </Box>
        </Grid.Col>
      </Grid>
    </Container>
  );
}