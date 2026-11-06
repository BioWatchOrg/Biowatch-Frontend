import { useUserStore } from '../userStore';

describe('userStore', () => {
  beforeEach(() => useUserStore.setState({ isAuthenticated: false }));

  it('starts signed out', () => {
    expect(useUserStore.getState().isAuthenticated).toBe(false);
  });

  it('signIn marks the user as authenticated', () => {
    useUserStore.getState().signIn();

    expect(useUserStore.getState().isAuthenticated).toBe(true);
  });

  it('signOut clears the authenticated flag', () => {
    useUserStore.getState().signIn();
    useUserStore.getState().signOut();

    expect(useUserStore.getState().isAuthenticated).toBe(false);
  });
});
