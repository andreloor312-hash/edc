import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Title,
  Text,
  Card,
  Stack,
  Group,
  Rating,
  Textarea,
  Select,
  Button,
  Badge,
  Avatar,
  Alert,
} from '@mantine/core';
import { IconLock, IconMessagePlus, IconArrowLeft } from '@tabler/icons-react';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuthStore } from '../store/useAuthStore';

const DESTINOS_OPCIONES = [
  'Baños de Agua Santa',
  'Puerto López / Isla de la Plata',
  'Cuyabeno Lodge',
  'Galápagos (Santa Cruz)',
  'Quilotoa / Cotopaxi',
];

export default function ReviewsPage() {
  const { user, openAuthModal } = useAuthStore();

  const [resenas, setResenas] = useState([]);
  const [destino, setDestino] = useState('');
  const [calificacion, setCalificacion] = useState(5);
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'resenas'), orderBy('fecha', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setResenas(lista);
    });

    return () => unsubscribe();
  }, []);

  const handlePublicar = async (e) => {
    e.preventDefault();
    if (!user || !destino || !comentario.trim()) return;

    setEnviando(true);
    try {
      await addDoc(collection(db, 'resenas'), {
        uid: user.uid,
        autor: user.displayName || user.email.split('@')[0],
        destino,
        calificacion,
        comentario: comentario.trim(),
        fecha: serverTimestamp(),
      });

      setDestino('');
      setCalificacion(5);
      setComentario('');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Container size="md" py="xl">
      {/* Botón de regreso al planificador */}
      <Button
        component={Link}
        to="/"
        variant="subtle"
        size="sm"
        leftSection={<IconArrowLeft size={16} />}
        mb="md"
        px={0}
      >
        Volver al planificador
      </Button>

      <Title order={2} mb="xs">Experiencias de Viajeros en Ecuador</Title>
      <Text c="dimmed" mb="xl">
        Opiniones reales sobre rutas, operadores y presupuestos verificados.
      </Text>

      {/* Formulario adaptativo: restringido si no hay login */}
      <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl">
        {user ? (
          <form onSubmit={handlePublicar}>
            <Stack>
              <Group justify="space-between">
                <Text fw={600}>Comparte tu experiencia</Text>
                <Group gap="xs">
                  <Text size="sm" c="dimmed">Calificación:</Text>
                  <Rating value={calificacion} onChange={setCalificacion} />
                </Group>
              </Group>

              <Select
                label="Destino visitado"
                placeholder="Selecciona un destino"
                data={DESTINOS_OPCIONES}
                value={destino}
                onChange={setDestino}
                required
              />

              <Textarea
                label="Tu reseña"
                placeholder="¿Cómo estuvo el transporte, hospedaje y los precios?"
                minRows={3}
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                required
              />

              <Button
                type="submit"
                loading={enviando}
                leftSection={<IconMessagePlus size={18} />}
              >
                Publicar 
              </Button>
            </Stack>
          </form>
        ) : (
          <Alert icon={<IconLock size={18} />} title="¿Ya viajaste por Ecuador?" color="blue">
            <Group justify="space-between" mt="xs">
              <Text size="sm">
                Inicia sesión para calificar destinos y ayudar a otros viajeros a planificar mejor.
              </Text>
              <Button size="xs" onClick={openAuthModal}>
                Iniciar sesión para opinar
              </Button>
            </Group>
          </Alert>
        )}
      </Card>

      {/* Listado público de reseñas */}
      <Stack>
        {resenas.length === 0 ? (
          <Text c="dimmed" ta="center" py="lg">
            Aún no hay reseñas publicadas. ¡Sé el primero en compartir tu ruta!
          </Text>
        ) : (
          resenas.map((item) => (
            <Card key={item.id} shadow="xs" padding="md" radius="md" withBorder>
              <Group justify="space-between" mb="xs">
                <Group>
                  <Avatar color="blue" radius="xl">
                    {item.autor?.[0]?.toUpperCase() || 'V'}
                  </Avatar>
                  <div>
                    <Text fw={600} size="sm">{item.autor}</Text>
                    <Badge size="xs" variant="light" color="teal">
                      {item.destino}
                    </Badge>
                  </div>
                </Group>
                <Rating value={item.calificacion} readOnly size="sm" />
              </Group>
              <Text size="sm" mt="xs">{item.comentario}</Text>
            </Card>
          ))
        )}
      </Stack>
    </Container>
  );
}