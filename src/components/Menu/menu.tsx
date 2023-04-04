import React, {useState, createContext} from 'react'
import classNames from 'classnames'
import { MenuItemProps } from './menuItem'

type MenuMode = 'horizontal' | 'vertical'

type SelectCallback = (selectedIndex: string) => void;

export interface MenuProps {
    children?: React.ReactNode
    defaultIndex?: string;
    className?: string;
    mode?: MenuMode;
    style?: React.CSSProperties;
    onSelect?: SelectCallback;
    defaultOpenSubMenus?: string[]
}

interface IMenuContext {
    index: string;
    onSelect?: SelectCallback;
    mode?: MenuMode
    defaultOpenSubMenus?: string[]
}

export const MenuContext = createContext<IMenuContext>({index: '0'})

const Menu: React.FC<MenuProps> = (props) => {
    const { className, mode, style, children, defaultIndex, onSelect, defaultOpenSubMenus } = props;

    const [currentActive, setActive] = useState(defaultIndex)

    const classes = classNames('voss-menu', className, {
        'menu-vertical': mode === 'vertical',
        'menu-horizontal': mode !== 'vertical'
    })

    const handleClick = (index: string) => {
        setActive(index)
        if(onSelect) {
            onSelect(index)
        }
    }

    const passedContext: IMenuContext = {
        index: currentActive ? currentActive : '0',
        onSelect: handleClick,
        mode,
        defaultOpenSubMenus
    }

    const renderChildren = () => {
        // 直接用 children 遍历不行，因为 props 里的 children 有很多种类型，如果是非数组类型，使用 map 方法肯定就报错了
        // 所以使用 React.Children.map 方法对 children 遍历，保证数据的安全性
        return React.Children.map(children, (child, index) => {
            // 类型没有 displayName 属性
            // child.
            // 需要类型断言，转成 Function Component 实例
            const childElement = child as React.FunctionComponentElement<MenuItemProps>
            // 这样 .type 就可以获取到静态属性
            const { displayName } = childElement.type 
            // 拦截非 MenuItem 组件，保证了组件的 Menu 组件的安全性，里边只渲染 displayName 为 MenuItem 的组件
            // 加上 SubMenu，放过 SubMenu 子组件
            if(displayName === 'MenuItem' || displayName === 'SubMenu' ) {
                // 不直接返回 child，通过 react 提供的 clone 方法，加点其他属性
                // return child
                // 然后把 index 删掉，测试用例还是可以完美通过的
                return React.cloneElement(childElement, {index: index.toString()})
            } else {
                // 测试非 MenuItem 的情况
                console.error('Warning: Menu has a child which is not a MenuItem component')
            }
        })
    }

    return (
        <ul className={classes} style={style} data-testid="test-menu">
            <MenuContext.Provider value={passedContext}>
            {/* {children} */}
            {renderChildren()}
            </MenuContext.Provider>
        </ul>
    )

}

Menu.defaultProps = {
    defaultIndex: '0',
    mode: 'horizontal',
    defaultOpenSubMenus: []
}
Menu.displayName = 'Menu'

export default Menu