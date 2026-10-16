import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  it('reflects in-flight requests and never goes negative', () => {
    const svc = new LoadingService();
    expect(svc.isLoading()).toBe(false);

    svc.start();
    expect(svc.isLoading()).toBe(true);

    svc.start();
    svc.stop();
    expect(svc.isLoading()).toBe(true);

    svc.stop();
    expect(svc.isLoading()).toBe(false);

    svc.stop();
    expect(svc.isLoading()).toBe(false);
  });
});
