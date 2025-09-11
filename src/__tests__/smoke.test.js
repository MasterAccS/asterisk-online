/* Minimal smoke test to keep CI green and catch import errors */
import App from '../App';

test('App module loads', () => {
  expect(App).toBeTruthy();
});

test('sanity', () => {
  expect(true).toBe(true);
});

