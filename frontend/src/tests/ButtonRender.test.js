// src/tests/ButtonRender.test.js
import { render, screen } from '@testing-library/react';
import MyButton from '../components/UI/Button/MyButton';

test('проверка рендеринга компонента MyButton', () => {
  const buttonText = 'MyButton'; // Текст для кнопки
  render(<MyButton text={buttonText} />); // Передаем текст через пропс
  const buttonElement = screen.getByText(buttonText); // Ищем текст на кнопке
  expect(buttonElement).toBeInTheDocument(); // Проверяем, что текст в кнопке есть
});
