// Code themes from the workstation palette (lime / amber / coral on warm black). No blue/purple.
const theme = (name, type, c) => ({
  name,
  type,
  colors: { 'editor.background': c.bg, 'editor.foreground': c.fg },
  tokenColors: [
    { scope: ['comment', 'punctuation.definition.comment'], settings: { foreground: c.muted, fontStyle: 'italic' } },
    { scope: ['keyword', 'storage', 'storage.type', 'keyword.control'], settings: { foreground: c.coral } },
    { scope: ['string', 'string.quoted', 'string.template'], settings: { foreground: c.lime } },
    { scope: ['constant.numeric', 'constant.language', 'constant.character'], settings: { foreground: c.amber } },
    { scope: ['entity.name.function', 'support.function', 'meta.function-call'], settings: { foreground: c.cream } },
    { scope: ['entity.name.type', 'support.type', 'entity.name.class'], settings: { foreground: c.amber } },
    { scope: ['entity.name.tag', 'support.class.component'], settings: { foreground: c.coral } },
    { scope: ['entity.other.attribute-name'], settings: { foreground: c.amber, fontStyle: 'italic' } },
    { scope: ['variable', 'variable.other', 'meta.object-literal.key'], settings: { foreground: c.fg } },
    { scope: ['punctuation', 'meta.brace'], settings: { foreground: c.muted } },
  ],
});

export const termDark = theme('term-dark', 'dark', {
  bg: '#11130E',
  fg: '#E4E8DA',
  muted: '#7C8470',
  lime: '#C6F432',
  amber: '#FFB224',
  coral: '#FF7A5C',
  cream: '#F5EFD9',
});

export const termLight = theme('term-light', 'light', {
  bg: '#FFFFFF',
  fg: '#121410',
  muted: '#6B7160',
  lime: '#4A6500',
  amber: '#9A5B00',
  coral: '#C23A20',
  cream: '#3D3A2E',
});
