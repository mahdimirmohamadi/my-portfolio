// Code-block themes built from the Saffron Chronicle palette (no blue/purple).
const theme = (name, type, c) => ({
  name,
  type,
  colors: { 'editor.background': c.bg, 'editor.foreground': c.fg },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: c.muted, fontStyle: 'italic' } },
    { scope: ['keyword', 'storage', 'storage.type', 'keyword.control'], settings: { foreground: c.red, fontStyle: 'bold' } },
    { scope: ['string', 'string.quoted', 'string.template'], settings: { foreground: c.green } },
    { scope: ['constant.numeric', 'constant.language', 'constant.character'], settings: { foreground: c.amber } },
    { scope: ['entity.name.function', 'support.function', 'meta.function-call'], settings: { foreground: c.brown } },
    { scope: ['entity.name.type', 'support.type', 'entity.name.class'], settings: { foreground: c.amber, fontStyle: 'bold' } },
    { scope: ['entity.name.tag', 'support.class.component'], settings: { foreground: c.red } },
    { scope: ['entity.other.attribute-name'], settings: { foreground: c.brown, fontStyle: 'italic' } },
    { scope: ['variable', 'variable.other', 'meta.object-literal.key'], settings: { foreground: c.fg } },
    { scope: ['punctuation', 'meta.brace'], settings: { foreground: c.muted } },
  ],
});

export const inkPaper = theme('ink-paper', 'light', {
  bg: '#EBE1CB',
  fg: '#16130F',
  muted: '#6B6358',
  red: '#B3261E',
  green: '#4E6B26',
  amber: '#8A5A00',
  brown: '#7A4A2A',
});

export const inkNight = theme('ink-night', 'dark', {
  bg: '#221D17',
  fg: '#EFE6D2',
  muted: '#A0968A',
  red: '#F07A5E',
  green: '#A9CC72',
  amber: '#F2B705',
  brown: '#D9A57C',
});
