import { AssetspipePipe } from './dataasync.pipe';

describe('DataasyncPipe', () => {
  it('create an instance', () => {
    const pipe = new AssetspipePipe('');
    expect(pipe).toBeTruthy();
  });
});
