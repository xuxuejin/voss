import React, { ChangeEvent, KeyboardEvent, useRef, FC, useEffect, useState } from 'react'

import Input, {InputProps} from '../Input/input'
import classNames from 'classnames'
import Icon from '../Icon/icon'
import useDebounce from '../../hooks/useDebounce'
import useClickOutside from '../../hooks/useClickOutside'

// 测试接口
// https://api.github.com/search/users?q=ab

interface DataSourceObject {
    value: string;
    [key: string]: any
}

export type DataSourceType<T = {}> = T & DataSourceObject

// onSelect 和 InputProps 里的 onSelect 两者不一样，出现了冲突，用 Omit 忽略掉
export interface AutoCompleteProps extends Omit<InputProps, 'onSelect'> {
    // 一般来说，这是个异步方法，需要返回一个 promise 
    fetchSuggestions: (str: string) => DataSourceType[] | Promise<DataSourceType[]>;
    onSelect?: (item: DataSourceType) => void;
    renderOption?: (item: DataSourceType) => React.ReactElement;
}

export const AutoComplete: FC<AutoCompleteProps> = (props) => {
    const { 
        fetchSuggestions, 
        onSelect,
        value,
        renderOption,
        ...restProps
    } = props

    const [ inputValue, setInputValue ] = useState(value)
    const [ suggestions, setSuggestions ] = useState<DataSourceType[]>([])
    const [ loading, setLoading ] = useState(false)
    const [ highlightIndex, setHighlightIndex ] = useState(-1)
    // 控制回车后还会发出一次请求的情况
    const triggerSearch = useRef(false)
    const componentRef = useRef<HTMLDivElement>(null)
    const debounceValue = useDebounce(inputValue, 500)

    useClickOutside(componentRef, () => { setSuggestions([]) })

    useEffect(() => {
        // 函数防抖
        if(debounceValue && triggerSearch.current) {
            const results = fetchSuggestions(debounceValue)
            // setSuggestions(results)
            // 需要先判断返回的结果是不是 promise
            if(results instanceof Promise) {
                setLoading(true)
                // 自动识别出这里 results 是 Promise<DataSourceType[]> 类型
                results.then((data) => {
                    setLoading(false)
                    setSuggestions(data)
                })
            } else {
                // 识别出 results 这里是 DataSourceType[] 类型
                setSuggestions(results)
            }
        } else {
            setSuggestions([])
        }
        setHighlightIndex(-1)
    }, [debounceValue, fetchSuggestions])

    const highlight = (index: number) => {
        if(index < 0) index = 0
        if(index >= suggestions.length) index = suggestions.length - 1;

        setHighlightIndex(index)
    }

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        switch(e.key) {
            case 'Enter':
                if(suggestions[highlightIndex]) {
                    handleSelect(suggestions[highlightIndex])
                }
                break;
            case 'ArrowDown':
                highlight(highlightIndex + 1)
                break;
            case 'ArrowUp':
                highlight(highlightIndex - 1)
                break;
            case 'Escape':
                setSuggestions([])
                setHighlightIndex(-1)
                break;
            default:
                break;
        }

    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim()
        setInputValue(value)
        triggerSearch.current = true
    }

    const handleSelect = (item: DataSourceType) => {
        setInputValue(item.value)
        setSuggestions([])
        if(onSelect) {
            onSelect(item)
        }
        triggerSearch.current = false
    }

    const renderTemplate = (item: DataSourceType) => {
        return renderOption ? renderOption(item) : item.value
    }

    const generateDropdown = () => {
        return (
            <ul>
                {suggestions.map((item, index) => {
                    const cnames = classNames('suggestion-item', {
                        'item-highlighted': index === highlightIndex
                    })
                    return <li key={index} className={cnames} onClick={handleSelect.bind(this,item)}>{renderTemplate(item)}</li>
                })}
            </ul>
        )
    }

    return (
        <div className="voss-auto-complete" ref={componentRef}>
            <Input 
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                {...restProps}
            />
            {loading && <div><Icon icon="spinner" spin /></div>}
            { suggestions.length > 0 && generateDropdown() }
        </div>
    )

}

export default AutoComplete;