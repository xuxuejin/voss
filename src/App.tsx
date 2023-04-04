import React, {ErrorInfo, useState} from 'react'
import Button from "./components/Button/button";
import Menu from "./components/Menu/menu";
import MenuItem from "./components/Menu/menuItem";
import SubMenu from "./components/Menu/subMenu";
import Input from './components/Input/input'
import AutoComplete, {DataSourceType} from './components/AutoComplete/autoComplete';
import Upload from './components/Upload/upload'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

// import Transition from './components/Transition/transition';
library.add(fas)
function App() {
  // const [ show, setShow ] = useState(false)
  const [value, setValue] = useState('')
  const renderOption = (item: DataSourceType) => {
    return <div>
      <h2>{item.value}</h2>
      <p>url:{item.url}</p>
    </div>
  }

  const handleFetch = (str: string) => {
    return fetch(`https://api.github.com/search/users?q=${str}`)
    .then(res => res.json())
    .then(({items}) => {
      const formatItems = items.slice(0, 10).map((item: any) => ({value: item.login, ...item}))

      return formatItems
    })
  }

  const handleError = (err: ErrorInfo, file: File) => {
    console.log(err)
  }

  const handleProgress = (percentage: number, file: File) => {
    console.log(percentage)
  }

  const handleSuccess = (rest: any, file: File) => {
    console.log(rest)
  }

  return (
    <div className="App">
      <Button className="custom">按钮</Button>
      <Menu mode="horizontal" defaultOpenSubMenus={['2']} onSelect={(index) => {}}>
        <MenuItem>item-1</MenuItem>
        <MenuItem disabled>item-2</MenuItem>
        <SubMenu title="dropdown">
          <MenuItem>dropdown 1</MenuItem>
          <MenuItem>dropdown 2</MenuItem>
        </SubMenu>
        <MenuItem>item-3</MenuItem>
      </Menu>
      {/* 动画组件 添加到 button 上无效，这是因为 button 组件的 transition 属性和 Transition 组件的 transition 冲突了 */}
      {/* 利用 transition 属性不能继承的特点，给 Transition 组件外部再套一层 */}
      {/* <Transition
        in={show}
        timeout={300}
      >
        <Button>A Button</Button>
      </Transition> */}
      <Input placeholder="请输入" value={value} onChange={(ev) => {setValue(ev.target.value)}} />
      <hr />
      <AutoComplete 
        fetchSuggestions={ handleFetch }
        onSelect={(item) => {}}
        renderOption={renderOption}
      />
      <hr />
      <Upload 
        action="https://run.mocky.io/v3/413da923-f41d-4e89-91c4-3caaa395bd6a" 
        onError={handleError}
        onProgress={handleProgress}
        onSuccess={handleSuccess}
       />
    </div>
  );
}

export default App;
