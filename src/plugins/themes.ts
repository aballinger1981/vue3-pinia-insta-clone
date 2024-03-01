import { type ThemeDefinition } from 'vuetify';

const light: ThemeDefinition = {
  dark: false,
  colors: {
    background: "#6200EE",
    "on-background": '#000000',
    surface: '#FFFFFF',
    'on-surface': '#000000',
    primary: '#6200EE',
    primaryVariant: '#3700B3',
    'on-primary': '#FFFFFF',
    secondary: '#03DAC6',
    'on-secondary': '#000000',
    error: '#B00020',
    "on-error": '#FFFFFF',
  },
}

const dark: ThemeDefinition = {
  dark: true,
  colors: {
    background: "#121212",
    "on-background": '#FFFFFF',
    surface: '#121212',
    'on-surface': '#FFFFFF',
    primary: '#BB86FC',
    primaryVariant: '#3700B3',
    'on-primary': '#000000',
    secondary: '#03DAC6',
    'on-secondary': '#000000',
    error: '#CF6679',
    "on-error": '#000000',
  }
};

export { light, dark };