import { render, screen, fireEvent } from '@testing-library/react';
import MyInput from '../components/UI/Input/MyInput';

test('проверка рендеринга MyInput с правильными пропсами', () => {
  const placeholderText = 'Введите текст';
  const type = 'text';
  
  render(<MyInput placeholder={placeholderText} type={type} />);
  
  // Проверяем, что элемент с нужным placeholder отрендерен
  const inputElement = screen.getByPlaceholderText(placeholderText);
  expect(inputElement).toBeInTheDocument();
  
  // Проверяем, что input имеет правильный type
  expect(inputElement).toHaveAttribute('type', type);
});

test('проверка срабатывания onChange', () => {
  const handleChange = jest.fn(); // Мокаем функцию onChange
  render(<MyInput placeholder="Введите текст" type="text" onChange={handleChange} />);
  
  const inputElement = screen.getByPlaceholderText('Введите текст');
  
  // Симулируем изменение значения в input
  fireEvent.change(inputElement, { target: { value: 'Новый текст' } });
  
  // Проверяем, что функция onChange была вызвана
  expect(handleChange).toHaveBeenCalledTimes(1);
});
