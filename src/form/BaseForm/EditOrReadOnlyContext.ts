import { createContext } from 'react';

export const EditOrReadOnlyContext = createContext<{
  mode: 'edit' | 'read' | 'update';
}>({
  mode: 'edit',
});
