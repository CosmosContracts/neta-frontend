
import { red } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
    palette: {
        mode: 'dark',

        neutral: {
            main: '#fff',
            contrastText: '#fff',
        },
    },
});

export default theme;