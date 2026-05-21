import { LocalStorageAdapter } from './local-storage.adapter';
import { User } from '../../../domain/entities/user.entity';

describe('LocalStorageAdapter', () => {
  let adapter: LocalStorageAdapter;
  let store: Record<string, string>;

  beforeEach(() => {
    adapter = new LocalStorageAdapter();
    store = {};

    spyOn(localStorage, 'getItem').and.callFake((key: string) => store[key] ?? null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      store[key] = value;
    });
    spyOn(localStorage, 'removeItem').and.callFake((key: string) => {
      delete store[key];
    });
  });

  it('stores and reads the user and token', () => {
    const user: User = {
      fullName: 'Admin User',
      email: 'admin@example.com',
      role: 'ADMIN'
    };

    adapter.saveUser(user, 'token-123');

    expect(adapter.getUser()).toEqual(user);
    expect(adapter.getToken()).toBe('token-123');
    expect(adapter.isAuthenticated()).toBeTrue();
  });

  it('returns null user and unauthenticated state when storage is empty', () => {
    expect(adapter.getUser()).toBeNull();
    expect(adapter.getToken()).toBeNull();
    expect(adapter.isAuthenticated()).toBeFalse();
  });

  it('removes the stored session', () => {
    store['token'] = 'token-123';
    store['foodtrack-user'] = JSON.stringify({ fullName: 'User' });

    adapter.logout();

    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    expect(localStorage.removeItem).toHaveBeenCalledWith('foodtrack-user');
  });
});
