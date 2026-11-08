export const showcaseKeys = {
  all: ['showcase'] as const,
  product: (id: string) => [...showcaseKeys.all, id] as const,
};
