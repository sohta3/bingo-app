import type { Foo } from "./types";

export function createFoo(id: string): Foo {
  return { id };
}
