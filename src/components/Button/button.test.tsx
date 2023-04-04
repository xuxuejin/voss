
import { render, screen, fireEvent } from '@testing-library/react'
// import userEvent from '@testing-library/user-event'

import Button, { ButtonProps } from './button'

const defaultProps = {
    onClick: jest.fn()
}

const testProps: ButtonProps = {
    btnType: 'primary',
    size: 'lg',
    className: 'klass'
}

const disableProps: ButtonProps = {
    disabled: true,
    onClick: jest.fn()
}

// 最外层可以进行一个分类
describe('test Button Compontent', () => {
    // test('true is truthy', () => {
    //     expect(true).toBe(true);
    // });
 it('should render the correct default button', () => {
    render(<Button {...defaultProps}>Nice</Button>)
    const element = screen.getByText('Nice')
    expect(element).toBeInTheDocument()
    expect(element.tagName).toEqual('BUTTON')
    expect(element).toHaveClass('voss-btn btn-default')
    // 事件
    // userEvent.click(element)
    // expect(defaultProps.onClick).toHaveBeenCalled()
    fireEvent.click(element)
    expect(defaultProps.onClick).toHaveBeenCalled()
 })
 it('should render the correct component based on different props', () => {
    render(<Button {...testProps}>Nice</Button>)
    const element = screen.getByText('Nice')
    expect(element).toBeInTheDocument()
    expect(element.tagName).toEqual('BUTTON')
    expect(element).toHaveClass('voss-btn btn-primary btn-lg klass')
 })
 it('should render a link when btnType equal link and href is provided', () => {
    render(<Button btnType='link' href="https://dummyurl">Link</Button>)
    const element = screen.getByText('Link')
    expect(element).toBeInTheDocument()
    expect(element.tagName).toEqual('A')
    expect(element).toHaveClass('voss-btn btn-link')
 })
 it('should render disabled button when disabled set to true', () => {
    render(<Button {...disableProps}>Disable</Button>)
    const element = screen.getByText('Disable') as HTMLButtonElement
    expect(element).toBeInTheDocument()
    expect(element.disabled).toBeTruthy()
    // disable 按钮应该不能触发
    fireEvent.click(element)
    expect(disableProps.onClick).not.toHaveBeenCalled()
 })
})
