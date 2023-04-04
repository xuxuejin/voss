import React, { InputHTMLAttributes, ReactElement, ChangeEvent } from 'react'
import classNames from 'classnames';
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import Icon from '../Icon/icon'

type InputSize = 'lg' | 'sm'

export interface InputProps extends Omit<InputHTMLAttributes<HTMLElement>, 'size'> {
    // InputHTMLAttributes 中默认有个 size 属性，是 number 类型，跟自定义的 size:string 冲突了
    // 通过内置工具 Omit，忽略原来的 size 类型就不报错了
    /** 设置是否禁用 */
    disabled?: boolean;
    /** 设置尺寸 */
    size?: InputSize;
    /** 是否在右侧悬浮添加图标，用于提示*/
    icon?: IconProp;
    /** 设置前缀 */
    prepend?: string | ReactElement;
    /** 设置后缀 */
    append?: string | ReactElement;
    // 为了让类型识别为 HTMLInputElement，重新定义 onChange 类型
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void

}

export const Input: React.FC<InputProps> = (props) => {
    const { disabled, size, icon, prepend, append, ...restProps } = props;

    const classes = classNames('voss-input', {
        'is-disabled': disabled,
        [`input-size-${size}`]: size,
        'input-width-prepend': prepend,
        'input-width-append': append
    })

    const fixControlledValue = (value: any) => {
        if (typeof value === 'undefined' || value === null) {
            return ''
        }
        return value
    }
    if('value' in props) {
        // 处理受控组件同时 传递 value 和 defaultValue 
        delete restProps.defaultValue
        // 处理受控组件 初始值为 undefind 和 null 的情况
        restProps.value = fixControlledValue(props.value)
    }

    return (
        <div className={classes}>
            {prepend && <div className="input-prepand">{prepend}</div>}
            <div className="input-wrap">
                {icon && <div className="icon-wrapper"><Icon icon={icon} /></div>}
                <input type="text" className="input-inner" disabled={disabled} {...restProps} />
            </div>
            {append && <div className="input-append">{append}</div>}
        </div>
    )
}

Input.defaultProps = {
    disabled: false
}
Input.displayName = 'Input'
export default Input