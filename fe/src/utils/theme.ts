export const themeConfig = {
  token: {
    // Deep Teal primary color (Professional Corporate)
    colorPrimary: '#0D9488',
    colorInfo: '#0D9488',
    colorSuccess: '#10B981',
    colorWarning: '#F59E0B',
    colorError: '#EF4444',

    // Typography
    fontFamily:
      "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: 14,

    // Border radius (moderate rounded - professional)
    borderRadius: 8,

    // Spacing
    controlHeight: 40,

    // Shadows (subtle professional)
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    boxShadowSecondary: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  },
  components: {
    Layout: {
      headerBg: '#FFFFFF',
      siderBg: '#FFFFFF',
      bodyBg: '#F9FAFB',
    },
    Menu: {
      itemBg: 'transparent',
      itemColor: '#4B5563',
      itemHoverColor: '#0D9488',
      itemSelectedColor: '#0D9488',
      itemSelectedBg: '#F0FDFA',
    },
    Button: {
      controlHeight: 40,
      borderRadius: 8,
    },
    Card: {
      borderRadius: 12,
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
    },
    Table: {
      headerBg: '#F9FAFB',
      borderRadius: 8,
    },
  },
}
