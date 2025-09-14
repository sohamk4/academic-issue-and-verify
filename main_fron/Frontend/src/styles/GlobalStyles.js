import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Arial', sans-serif;
  }

  body {
    background-color: #E5E7EB; /* Soft Gray */
    color:#0b193f; /* Deep Blue */
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  button {
    cursor: pointer;
    background-color: #0b193f; /* Deep Blue */
    color: #FFFFFF; /* White */
    border: none;
    padding: 0.8rem 1.5rem;
    font-size: 1rem;
    border-radius: 5px;
    transition: background-color 0.3s ease;

    &:hover {
      background-color: #0b193f; /* Slightly darker Deep Blue */
    }
  }
`;

export default GlobalStyles;
