export const colorTokens = {
  // プライマリーカラー
  primary: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3', // ベースカラー
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },
  
  // セカンダリーカラー
  secondary: {
    50: '#F3E5F5',
    100: '#E1BEE7',
    200: '#CE93D8',
    300: '#BA68C8',
    400: '#AB47BC',
    500: '#9C27B0',
    600: '#8E24AA',
    700: '#7B1FA2',
    800: '#6A1B9A',
    900: '#4A148C',
  },

  // グレースケール
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },

  // セマンティックカラー
  semantic: {
    success: {
      light: '#4CAF50',
      main: '#2E7D32',
      dark: '#1B5E20',
    },
    warning: {
      light: '#FFA726',
      main: '#F57C00',
      dark: '#E65100',
    },
    error: {
      light: '#EF5350',
      main: '#D32F2F',
      dark: '#C62828',
    },
    info: {
      light: '#29B6F6',
      main: '#0288D1',
      dark: '#01579B',
    }
  },

  // アクセシビリティ対応コントラスト比
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',    // WCAG AAA準拠
    secondary: 'rgba(0, 0, 0, 0.6)',   // WCAG AA準拠
    disabled: 'rgba(0, 0, 0, 0.38)',
    hint: 'rgba(0, 0, 0, 0.38)',
  },

  background: {
    default: '#FFFFFF',
    paper: '#F5F5F5',
    elevated: '#FFFFFF',
  }
}; 