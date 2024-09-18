import React, { useEffect, useState } from 'react';
import { getViagens, deleteViagem } from './ViagemService';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Heading, Stack, Text, Flex, Divider, useColorModeValue } from '@chakra-ui/react';

interface Viagem {
  _id: string;
  nome: string;
  dataSaida: string;
  dataChegada: string;
  valor: number;
}

const ViagemList: React.FC = () => {
  const [viagens, setViagens] = useState<Viagem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchViagens();
  }, []);

  const fetchViagens = async () => {
    const response = await getViagens();
    setViagens(response.data);
  };

  const handleDelete = async (id: string) => {
    await deleteViagem(id);
    fetchViagens();
  };

  const listItemBg = useColorModeValue('gray.100', 'gray.700'); // Cor do item conforme o modo

  return (
    <Box maxW="800px" mx="auto" mt="5">
      <Heading as="h1" mb="6" textAlign="center">
        Lista de Viagens
      </Heading>
      <Flex justify="center" mb="4">
        <Button colorScheme="teal" onClick={() => navigate('/create')}>
          Criar Viagem
        </Button>
      </Flex>
      <Stack spacing={4}>
        {viagens.map((viagem) => (
          <Box
            key={viagem._id}
            p={5}
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
            bg={listItemBg}
          >
            <Heading fontSize="xl">{viagem.nome || 'Viagem'}</Heading>
            <Text mt={2}>
              {new Date(viagem.dataSaida).toLocaleDateString()} até {new Date(viagem.dataChegada).toLocaleDateString()}
            </Text>
            <Text mt={2}>
              R$ {viagem.valor.toFixed(2)}
            </Text>
            <Flex mt={4} justify="space-between">
              <Button colorScheme="blue" onClick={() => navigate(`/edit/${viagem._id}`)}>
                Editar
              </Button>
              <Button colorScheme="red" onClick={() => handleDelete(viagem._id)}>
                Deletar
              </Button>
            </Flex>
          </Box>
        ))}
        {viagens.length === 0 && <Text textAlign="center">Nenhuma viagem cadastrada.</Text>}
      </Stack>
    </Box>
  );
};

export default ViagemList;
