import { heatColour } from './heat-colour';

describe('heatColour', () => {
  it('is grey when sold out', () => {
    expect(heatColour(0, 100)).toBe('#9AA0A6');
  });

  it('is green when plenty is available', () => {
    expect(heatColour(100, 100)).toBe('rgb(29, 158, 117)');
  });

  it('is red when almost sold out', () => {
    const colour = heatColour(1, 1000);
    expect(colour).toMatch(/^rgb\(2[0-4]\d, /);
  });
});
