import { fireEvent, render, screen } from '@testing-library/react'

import Input, { InputProps} from './input'

const defaultProps: InputProps = {
    onChange: jest.fn(),
    placeholder: 'test-input'
}

describe('test input component', () => {

    it('should render the correct default Input', () => {
        render(<Input {...defaultProps} />)
        const testInput = screen.getByPlaceholderText('test-input') as HTMLInputElement

        expect(testInput).toBeInTheDocument()
        expect(testInput).toHaveClass('input-inner')

        fireEvent.change(testInput,{target: {value: '23'}})
        expect(defaultProps.onChange).toHaveBeenCalled()
        expect(testInput.value).toEqual('23')
    })

    it('should render the disabled Input on disabled property', () => {
        render(<Input disabled placeholder='disabled' />)
        const disabledInput = screen.getByPlaceholderText('disabled') as HTMLInputElement
        expect(disabledInput.disabled).toBeTruthy()
    })

    it('should render different input size on size propertye', () => {
        const { container } = render(<Input size="lg" placeholder='size' />)
        // const sizeInput = screen.getByPlaceholderText('size') as HTMLInputElement
        // console.log(prettyDOM(container.firstChild))
        // eslint-disable-next-line testing-library/no-node-access
        expect(container.firstChild).toHaveClass('input-size-lg')
    })

    it('should render prepend and append element on prepeng/append property', () => {
        const { container } = render(<Input placeholder='pend' prepend="https://" append=".com" />)

        // eslint-disable-next-line testing-library/no-node-access
        expect(container.firstChild).toHaveClass('voss-input input-width-prepend input-width-append')

        expect(screen.getByText('https://')).toBeInTheDocument()

        expect(screen.getByText('.com')).toBeInTheDocument()
    })
})