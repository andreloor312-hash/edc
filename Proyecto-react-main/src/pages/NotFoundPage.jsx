import { Container, Title, Text, Button, Group, Stack, ThemeIcon } from '@mantine/core';
import { IconMapOff, IconArrowLeft } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <Container size="sm" py={80}>
      <Stack align="center" ta="center" gap="md">
        <ThemeIcon size={80} radius="xl" variant="light" color="blue">
          <IconMapOff size={44} />
        </ThemeIcon>

        <Title order={1} size="3rem" c="blue">
          404
        </Title>

        <Title order={2}>Ruta no encontrada</Title>

        <Text c="dimmed" maw={450}>
          Parece que te desviaste del sendero. La página o destino que buscas no existe o fue movido.
        </Text>

        <Group mt="md">
          <Button
            component={Link}
            to="/"
            size="md"
            leftSection={<IconArrowLeft size={18} />}
          >
            Volver al planificador
          </Button>
          <Button
            component={Link}
            to="/resenas"
            variant="light"
            size="md"
          >
            Ver reseñas de viajeros
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}