import { render, screen, fireEvent, waitFor  } from '@testing-library/react'

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

import Menu, { MenuProps} from './menu'
import MenuItem from './menuItem'
import SubMenu from './subMenu'

// import Transition from './components/Transition/transition';
library.add(fas)

const testProps: MenuProps = {
    defaultIndex: '0',
    onSelect: jest.fn(),
    className: 'test'
}

const testVerProps: MenuProps = {
    defaultIndex: '0',
    mode: 'vertical'
}

const generateMenu = (props: MenuProps) => {
    return (
        <Menu {...props}>
            <MenuItem>active</MenuItem>
            <MenuItem disabled>disabled</MenuItem>
            <MenuItem>item-3</MenuItem>
            {/* li 不是 MenuItem 组件*/}
            {/* <li></li> */}
            <SubMenu title="dropdown">
                <MenuItem>dropdown 1</MenuItem>
                <MenuItem>dropdown 2</MenuItem>
            </SubMenu>
        </Menu>
    )
}

// const createStyleFile = () => {
//     const cssFile: string = `
//         .voss-submenu {
//             display: none;
//         }
//         .voss-submenu.menu-opened {
//             display: block;
//         }
//     `
//     const style = document.createElement('style')
//     style.innerHTML = cssFile
//     return style
// }

let menuElement:HTMLElement, activeElement:HTMLElement, disabledElement:HTMLElement

// 最外层可以进行一个分类
describe('test Menu and MenuItem Compontent', () => {
    const setup = () => {
        // 插入样式
        // document.head.appendChild(createStyleFile())
        render(generateMenu(testProps))
        menuElement = screen.getByTestId('test-menu')
        activeElement = screen.getByText('active')
        disabledElement = screen.getByText('disabled')
    };

    // 测试会不会展示正确的样式
    it('should render correct Menu and MenuItem base on default props', () => {
        setup()
        expect(menuElement).toBeInTheDocument()
        expect(menuElement).toHaveClass('voss-menu test')
        // 虽然上面加入了 li 标签，但是 length 还是 3，还是可以通过测试的
        // expect(screen.getAllByRole('listitem').length).toEqual(3)
        // 因为加入了 SubMenu，getAllByRole 选择元素不分层级，所有的 li 都获取到了，因此再写 toEqual(3) 就错了
        // 那怎么才能只选择一层节点呢？
        // 使用伪类 :scope 来实现只选择一层 dom 节点
        // eslint-disable-next-line testing-library/no-node-access
        expect(menuElement.querySelectorAll(':scope > li').length).toEqual(4)
        // 但是上面的这种方式 eslit 报错，目前 React-testing-library 找不到合适的方法
        expect(activeElement).toHaveClass('menu-item is-active')
        expect(disabledElement).toHaveClass('menu-item is-disabled')
    })

    // 测试会不会展示正确的行为
    it('click items should change active and call the right callback', () => {
        setup()
        const thirdItem = screen.getByText('item-3')
        fireEvent.click(thirdItem)
        expect(thirdItem).toHaveClass('is-active')
        expect(activeElement).not.toHaveClass('is-active')
        expect(testProps.onSelect).toHaveBeenCalledWith('2')
        fireEvent.click(disabledElement)
        expect(disabledElement).not.toHaveClass('is-active')
        expect(testProps.onSelect).not.toHaveBeenCalledWith('1')
    })

    // 测试 vertical 模式
    it('should render vertical mode when mode is set to vertical', () => {
        render(generateMenu(testVerProps))
        menuElement = screen.getByTestId('test-menu')
        expect(menuElement).toHaveClass('menu-vertical')
    })

    it('should show dropdown items when hover on subMenu', async () => {
        setup()
        // // 因为刚开始子菜单是隐藏的，因此使用 queryByText
        // expect(screen.queryByText('dropdown 1')).not.toBeVisible()
        // // 测试不通过，因为我们是使用 display 这个 css 属性来控制显示隐藏的
        // // 但是测试用例中并没有任何 css 代码，所以这个元素一直出现在屏幕中
        // // 那需要添加整个 css 文件？
        // // 其实只需要在整个 case 中添加一小部分 css 即可
        
        // const dropdownElement = screen.getByText('dropdown')
        // fireEvent.mouseEnter(dropdownElement)
        // // expect(screen.queryByText('dropdown 1')).toBeVisible()
        // // 断言失败，为什么？
        // // 因为在鼠标 hover 移入事件加了定时器，这是一个异步操作 
        // // 断言是直接跑的，不是等待定时器的 300ms 再跑的，这时候还没显示出来
        // // 怎么处理？
        // // 通过 async 和 await 来处理
        // await waitFor(() => {
        //     expect(screen.getByText('dropdown 1')).toBeVisible()
        // })
        // // 当使用 waitfor 来等待某个元素出现后，需要再使用 await 来获取该元素
        // const dropdownFirst = await screen.findByText('dropdown 1')
        
        // fireEvent.click(dropdownFirst)

        // expect(testProps.onSelect).toHaveBeenCalledWith('3-0')

        // fireEvent.mouseLeave(dropdownElement)

        // await waitFor(() => {
        //     expect(screen.queryByText('dropdown 1')).not.toBeVisible()
        // })
        // 后面改成 Transition 组件包裹，不是使用 display 来控制显示、隐藏
        // 测试用例需要改一下，判断文档中有没有元素
        expect(screen.queryByText('dropdown 1')).not.toBeInTheDocument()

        const dropdownElement = screen.getByText('dropdown')

        fireEvent.mouseEnter(dropdownElement)

        await waitFor(() => {
            expect(screen.getByText('dropdown 1')).toBeVisible()
        })

        const dropdownFirst = await screen.findByText('dropdown 1')

        fireEvent.click(dropdownFirst)

        expect(testProps.onSelect).toHaveBeenCalledWith('3-0')

        fireEvent.mouseLeave(dropdownElement)

        await waitFor(() => {
            expect(screen.queryByText('dropdown 1')).not.toBeInTheDocument()
        })
    })
})
