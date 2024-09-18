import { ChakraProvider, extendTheme, ColorModeScript } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ViagemForm from './ViagemForm';
import ViagemList from './ViagemList';

const config = {
  initialColorMode: 'dark', // Define o modo inicial como "dark"
  useSystemColorMode: false, // Não muda baseado no tema do sistema
};

const theme = extendTheme({ config });

function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Router>
        <Routes>
          <Route path="/" element={<ViagemList />} />
          <Route path="/create" element={<ViagemForm />} />
          <Route path="/edit/:id" element={<ViagemForm />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
