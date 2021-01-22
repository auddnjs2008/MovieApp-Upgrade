import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

const GlobalStyle = createGlobalStyle`
    ${reset};
    body{
        //background-color:rgba(20,20,20,0.9);
        background-color:black;
      
       overflow-x:hidden;
      
    }


    a{
        text-decoration:none;
        color:inherit;
    }
    *{
        box-sizing:border-box;
    }
`;

export default GlobalStyle;
