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
    button{
        display: flex;
        align-items: center;
        justify-content: center;
        
        border: none;
        outline: none;
        color: white;
        background-color: rgba(64, 115, 158, 1);
        border-radius: 5px;
        &:active {
          transform: scale(0.99, 0.99);
        }
    }
`;

export default GlobalStyle;
