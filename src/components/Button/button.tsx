import React from 'react'
import classNames from 'classnames';

// export enum ButtonSize {
//     Large = 'lg',
//     Small = 'sm'
// }

// export enum ButtonType {
//     Primary = 'primary',
//     Default = 'default',
//     Danger = 'danger',
//     Link = 'link'
// }

export type ButtonSize = 'lg' | 'sm'
export type ButtonType = 'primary' | 'default' | 'danger' | 'link'

interface BaseButtonProps {
    /** 自定义类名 */
    className?: string;
    /** 设置按钮禁用 */
    disabled?: boolean;
    /** 设置按钮尺寸 */
    size?: ButtonSize;
    /** 设置按钮类型 */
    btnType?: ButtonType;

    children: React.ReactNode
    /** 跳转链接 */
    href?: string
}

// 元素的原生属性太多了，不可能每个组件都写完整
// React 给我们提供一个接口，可以拿到所有 button 的属性 React.ButtonHTMLAttributes
// type NativeButtonProps = React.ButtonHTMLAttributes<HTMLElement>
// 通过交叉类型将多个类型合并为一个类型
type NativeButtonProps = BaseButtonProps & React.ButtonHTMLAttributes<HTMLElement>
type AnchorButtonProps = BaseButtonProps & React.AnchorHTMLAttributes<HTMLElement>
// 将两种标签的类型组合起来
// export type ButtonProps = NativeButtonProps & AnchorButtonProps
// 但是这样也有问题，有的属性是 button 有的，但是 a 标签不一定有，反之亦然，所以需要把这些属性设置为可选的
// 通过 TS 提供程序类型工具，可以解决这种问题
export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>

/**
 * Button 组件
 */
const Button: React.FC<ButtonProps> = (props) => {
    const {
        btnType,
        className,
        disabled,
        size,
        children,
        href,
        // 取出剩余属性
        ...restProps
    } = props
    // btn btn-lg btn-primary
    const classes = classNames('voss-btn', className, {
        [`btn-${btnType}`]: btnType,
        [`btn-${size}`]: size,
        // link 类型按钮是个 a 标签，需要特殊处理 disable 状态
        'disabled': (btnType === 'link') && disabled
    })
    
    if(btnType === 'link' && href) {
        return (
            <a href={href} className={classes} {...restProps}>{children}</a>
        )
    } else {
        return <button className={classes} disabled={disabled} {...restProps}>{children}</button>
    }
}

Button.defaultProps = {
    disabled: false,
    btnType: 'default'
}

Button.displayName = "Button"

export default Button