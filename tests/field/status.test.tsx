import { cleanup, render } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { ProField as Field } from '@xxlabs/pro-components';

afterEach(() => {
  cleanup();
});

describe('Field Status', () => {
  afterEach(() => {
    cleanup();
  });
  const statusList = [
    'Success',
    'Error',
    'Processing',
    'Default',
    'Warning',
    'success',
    'error',
    'processing',
    'default',
    'warning',
  ];
  statusList.forEach((status) => {
    it(`🥩 ${status} render`, async () => {
      const { container } = render(
        <Field
          text="open"
          valueEnum={{
            open: {
              text: '未解决',
              status,
            },
          }}
          mode="read"
        />,
      );
      expect(container).toMatchSnapshot();
    });
  });

  it(`🥩 red color render`, async () => {
    const { container } = render(
      <Field
        text="open"
        valueEnum={{
          open: {
            text: '未解决',
            color: 'red',
          },
        }}
        mode="read"
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
