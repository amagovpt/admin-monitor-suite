import { JsonBPipe } from './json-b.pipe';

describe('JsonBPipe', () => {
  it('create an instance', () => {
    const pipe = new JsonBPipe();
    expect(pipe).toBeTruthy();
  });
});
