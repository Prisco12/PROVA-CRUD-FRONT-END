import React, { useState, useEffect } from 'react';
import { createViagem, updateViagem, getViagemById } from './ViagemService';
import { addDestino, removeDestino } from './ViagemService'; // Importe as funções de serviço
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Button, FormControl, FormLabel, Input, Stack, Heading, Flex, Divider, Text, VStack, HStack, useColorModeValue
} from '@chakra-ui/react';

interface Destino {
  nome: string;
}

interface Viagem {
  _id?: string; // Incluímos o ID da viagem para facilitar o controle
  nome: string;
  dataSaida: string;
  dataChegada: string;
  valor: number;
  destino: Destino[];
}

const ViagemForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [viagem, setViagem] = useState<Viagem>({
    nome: '',
    dataSaida: '',
    dataChegada: '',
    valor: 0,
    destino: [],
  });
  const [novoDestino, setNovoDestino] = useState<string>('');
  const [isViagemCriada, setIsViagemCriada] = useState<boolean>(!!id); // Controle para verificar se a viagem foi criada

  useEffect(() => {
    if (id) {
      fetchViagem();
    }
  }, [id]);

  const fetchViagem = async () => {
    try {
      const response = await getViagemById(id!);
      const data = response.data;
      setViagem({
        ...data,
        dataSaida: new Date(data.dataSaida).toISOString().split('T')[0],
        dataChegada: new Date(data.dataChegada).toISOString().split('T')[0],
      });
    } catch (error) {
      console.error('Error fetching viagem:', error);
    }
  };

  const handleSaveViagem = async () => {
    try {
      if (isViagemCriada) {
        // Atualizar viagem existente
        await updateViagem(id!, viagem);
      } else {
        // Criar nova viagem e obter o ID retornado
        const response = await createViagem(viagem);
        const viagemCriada = response.data;
        setViagem(viagemCriada); // Atualizar o estado com a viagem criada e o ID
        setIsViagemCriada(true); // Marcar como viagem criada
      }
    } catch (error) {
      console.error('Error saving viagem:', error);
    }
  };

  const handleAddDestino = async () => {
    if (novoDestino && viagem._id) {  // Verificar se o ID está disponível
      try {
        const novoDestinoData = { nome: novoDestino };
        
        // Adicionar destino via API
        await addDestino(viagem._id, novoDestinoData);
        
        // Atualizar o estado local
        setViagem({ ...viagem, destino: [...viagem.destino, novoDestinoData] });
        setNovoDestino('');
      } catch (error) {
        console.error('Error adding destino:', error);
      }
    }
  };

  const handleRemoveDestino = async (index: number) => {
    try {
      const destinoParaRemover = viagem.destino[index]; // Obter o destino a ser removido
      if (!viagem._id) return; // Garantir que o ID da viagem existe
  
      // Chamar a API para remover o destino
      await removeDestino(viagem._id, { nome: destinoParaRemover.nome }); // Enviar o destino com o nome correto
  
      // Atualizar o estado local removendo o destino
      setViagem({
        ...viagem,
        destino: viagem.destino.filter((_, i) => i !== index),
      });
    } catch (error) {
      console.error('Erro ao remover destino:', error);
    }
  };

  const handleSaveAndExit = async () => {
    try {
      if (isViagemCriada) {
        // Atualizar viagem existente
        await updateViagem(id!, viagem);
      } else {
        // Criar nova viagem e obter o ID retornado
        const response = await createViagem(viagem);
        const viagemCriada = response.data;
        setViagem(viagemCriada); // Atualizar o estado com a viagem criada e o ID
        setIsViagemCriada(true); // Marcar como viagem criada
      }
    } catch (error) {
      console.error('Error saving viagem:', error);
    }
    navigate('/'); // Redirecionar para a lista de viagens após salvar
  };

  const formBg = useColorModeValue('gray.100', 'gray.700');

  return (
    <Box maxW="600px" mx="auto" my="40px" bg={formBg} p={8} borderRadius="md">
      <Heading as="h1" mb="6" textAlign="center">
        {id || isViagemCriada ? 'Editar Viagem' : 'Criar Viagem'}
      </Heading>

      <VStack spacing={4} as="form">
        <FormControl isRequired>
          <FormLabel>Nome</FormLabel>
          <Input
            placeholder="Nome da viagem"
            value={viagem.nome}
            onChange={(e) => setViagem({ ...viagem, nome: e.target.value })}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Data de Saída</FormLabel>
          <Input
            type="date"
            placeholder="Data de Saída"
            value={viagem.dataSaida}
            onChange={(e) => setViagem({ ...viagem, dataSaida: e.target.value })}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Data de Chegada</FormLabel>
          <Input
            type="date"
            placeholder="Data de Chegada"
            value={viagem.dataChegada}
            onChange={(e) => setViagem({ ...viagem, dataChegada: e.target.value })}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Valor</FormLabel>
          <Input
            type="number"
            placeholder="Valor"
            value={viagem.valor}
            onChange={(e) => setViagem({ ...viagem, valor: parseFloat(e.target.value) })}
          />
        </FormControl>

        <Flex justify="center" mt="6">
          <Button colorScheme="blue" onClick={handleSaveViagem}>
            {isViagemCriada ? 'Atualizar Viagem' : 'Salvar Viagem'}
          </Button>
        </Flex>

        {isViagemCriada && viagem._id && (
          <>
            <Divider />
            <FormControl>
              <FormLabel>Destinos</FormLabel>
              <VStack align="start">
                {viagem.destino.map((d, index) => (
                  <HStack key={index} justify="space-between" width="100%">
                    <Text>{d.nome}</Text>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleRemoveDestino(index)}
                    >
                      Remover
                    </Button>
                  </HStack>
                ))}
              </VStack>
              <Flex mt="4">
                <Input
                  placeholder="Adicionar destino"
                  value={novoDestino}
                  onChange={(e) => setNovoDestino(e.target.value)}
                  mr="2"
                />
                <Button padding="20px 40px" textAlign="center" colorScheme="teal" onClick={handleAddDestino}>
                  Adicionar Destino
                </Button>
              </Flex>
            </FormControl>

            <Flex justify="center" mt="6">
              <Button colorScheme="blue" onClick={handleSaveAndExit}>
                Salvar e Sair
              </Button>
            </Flex>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default ViagemForm;
