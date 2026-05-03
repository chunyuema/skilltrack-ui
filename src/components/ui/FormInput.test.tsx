import { render, screen, fireEvent } from '@testing-library/react';
import { FormInput } from './FormInput';
import { describe, it, expect, vi } from 'vitest';

describe('FormInput', () => {
  it('renders correctly in editing mode', () => {
    const onChange = vi.fn();
    render(
      <FormInput
        label="Test Label"
        value="Test Value"
        onChange={onChange}
        isEditing={true}
      />
    );

    expect(screen.getByLabelText(/Test Label/i)).toBeInTheDocument();
    const input = screen.getByDisplayValue('Test Value');
    expect(input.tagName).toBe('INPUT');
  });

  it('renders correctly in read-only mode', () => {
    render(
      <FormInput
        label="Test Label"
        value="Test Value"
        onChange={() => {}}
        isEditing={false}
      />
    );

    expect(screen.getByText(/Test Label/i)).toBeInTheDocument();
    expect(screen.getByText('Test Value')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('Test Value')).not.toBeInTheDocument();
  });

  it('renders as textarea when specified', () => {
    render(
      <FormInput
        label="Description"
        value="Some text"
        onChange={() => {}}
        type="textarea"
        isEditing={true}
      />
    );

    const textarea = screen.getByDisplayValue('Some text');
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('calls onChange when value is changed', () => {
    const onChange = vi.fn();
    render(
      <FormInput
        label="Name"
        value=""
        onChange={onChange}
        isEditing={true}
      />
    );

    const input = screen.getByLabelText(/Name/i);
    fireEvent.change(input, { target: { value: 'New Name' } });
    expect(onChange).toHaveBeenCalledWith('New Name');
  });

  it('displays NULL placeholder in read-only mode when value is empty', () => {
    render(
      <FormInput
        label="Empty Field"
        value=""
        onChange={() => {}}
        isEditing={false}
      />
    );

    expect(screen.getByText('NULL')).toBeInTheDocument();
  });
});
