import '@fontsource/inter';
import { CssBaseline, CssVarsProvider } from '@mui/joy';
import { DialogProvider } from 'react-dialog-async';

import ChessGame from './components/ChessGame/ChessGame';

function App() {
  return (
    <CssVarsProvider defaultMode={'dark'}>
      <DialogProvider>
        <CssBaseline />
        <ChessGame />
      </DialogProvider>
    </CssVarsProvider>
  );
}

export default App;
