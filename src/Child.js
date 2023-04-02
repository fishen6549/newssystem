import React from 'react'
import style from "./Child.module.scss"
export default function Child() {
    return (
        <div>
            <ul>
                <li className={style.item}>child-item</li>
                <li className={style.item}>child-item</li>
            </ul>
        </div>
    )
}
