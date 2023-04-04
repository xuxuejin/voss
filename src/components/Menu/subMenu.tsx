import React, { useContext, useState } from 'react'
import classNames from 'classnames'
// import { CSSTransition } from 'react-transition-group';
import { MenuContext } from './menu';
import { MenuItemProps } from './menuItem'
import Icon from "../Icon/icon"
import Transition from '../Transition/transition'
export interface SubMenuProps {
    children?: React.ReactNode;
    index?: string;
    title: string;
    className?: string;
}

const SubMenu: React.FC<SubMenuProps> = ({ index, title, children, className}) => {
    const context = useContext(MenuContext)
    const openedSubMenu = context.defaultOpenSubMenus as Array<string>
    const isOpend = (index && context.mode === 'vertical') ? openedSubMenu.includes(index) : false
    const [menuOpen, setOpen] = useState(isOpend)
    // console.log(context.index, index)
    const classes = classNames('menu-item submenu-item', className, {
        'is-active': context.index === index,
        'is-opened': menuOpen,
        'is-vertical': context.mode === 'vertical'
    })
    // 交互：横向鼠标 hover 显示子菜单；纵向鼠标 click 显示子菜单
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        setOpen(!menuOpen)

        if(context.onSelect && (typeof index === 'string')) {
            context.onSelect(index)
        }
    }

    let timer: any
    const handleMouse = (e: React.MouseEvent, toggle: boolean) => {
        clearTimeout(timer)
        e.preventDefault()
        timer = setTimeout(() => {
            setOpen(toggle)
        }, 300)
    }

    const clickEvents = context.mode === 'vertical' ? { onClick: handleClick } : {}

    const hoverEvents = context.mode === 'horizontal' ? {
        onMouseEnter: (e: React.MouseEvent) => { handleMouse(e, true) },
        onMouseLeave: (e: React.MouseEvent) => { handleMouse(e, false) }
    } : {}


    const renderChildren = () => {
        // 用来限制 子组件 只能是 MenuItem
        const childrenComponent = React.Children.map(children, (child, i) => {
            // 下面这个类型断言是为了能获得类型提示
            const childElement = child as React.FunctionComponentElement<MenuItemProps>
            if(childElement.type.displayName === 'MenuItem') {
                // return childElement
                // 这边需要给子元素加上 index，不然没有点击效果
                return React.cloneElement(childElement, {index: `${index}-${i}`})
            } else {
                console.error('Warning: SubMenu has a child which is not a MenuItem component')
            }
        })
        const subMenuClasses = classNames('voss-submenu', {
            'menu-opened': menuOpen
        })
        return (
            <Transition in={menuOpen} timeout={300} animation="zoom-in-top">
                <ul className={subMenuClasses}>
                    {childrenComponent}
                </ul>
            </Transition>
        )
    }

    return (
        <li key={index} className={classes} {...hoverEvents}>
            <div className="submenu-title" {...clickEvents}>
                {title}
                <Icon icon="angle-down" className="arrow-icon" />
            </div>
            {renderChildren()}
        </li>
    )
}

SubMenu.displayName = 'SubMenu'

export default SubMenu