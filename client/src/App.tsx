import React, { useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { Home } from './screens/Home';
import { socket } from './socket/socket';

function App() {

  return (
    <ChakraProvider>
      <Home />
    </ChakraProvider>
  );
}

export default App;
