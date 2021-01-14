import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
    ${reset};
    a{
        text-decoration:none;
    }
    *{
        box-sizing:border-box;
    }
`;

export default GlobalStyle;
