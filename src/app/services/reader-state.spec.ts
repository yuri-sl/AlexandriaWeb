import { ReaderState } from './reader-state';
import { BOOK_FIXTURES } from '../testing/book-fixtures';
describe('Reader session', () => {
  let reader: ReaderState;
  beforeEach(() => (reader = new ReaderState()));
  it('calculates decimal totals and caps quantities at stock', () => {
    expect(reader.add(BOOK_FIXTURES[0])).toBe(true);
    expect(reader.add(BOOK_FIXTURES[0])).toBe(true);
    expect(reader.add(BOOK_FIXTURES[0])).toBe(false);
    expect(reader.count()).toBe(2);
    expect(reader.subtotal()).toBe(101);
    reader.quantity(101, -5);
    expect(reader.count()).toBe(1);
    reader.quantity(101, NaN);
    expect(reader.count()).toBe(1);
    reader.remove(101);
    expect(reader.subtotal()).toBe(0);
  });
  it('never adds unavailable books', () => {
    expect(reader.add(BOOK_FIXTURES[1])).toBe(false);
    expect(reader.cart()).toEqual([]);
  });
  it('keeps favorites separate from purchases and toggles by book ID', () => {
    reader.toggleFavorite(BOOK_FIXTURES[0]);
    expect(reader.favorites().length).toBe(1);
    expect(reader.count()).toBe(0);
    reader.toggleFavorite({ ...BOOK_FIXTURES[0] });
    expect(reader.favorites()).toEqual([]);
  });
});
