// import React from 'react';
// import ReactDOM from 'react-dom/client';
// // import './index.css';
// import './styles/index.scss'
// import App from './App';
// import reportWebVitals from './reportWebVitals';

// const root = ReactDOM.createRoot(
//   document.getElementById('root') as HTMLElement
// );
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// // If you want to start measuring performance in your app, pass a function
// // to log results (for example: reportWebVitals(console.log))
// // or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

// icon font 别忘了
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'
library.add(fas)

// 入口文件，导出所有的组件，也称之为中转导出
export { default as Button } from './components/Button'
export { default as Menu } from './components/Menu'
export { default as Icon } from './components/Icon'