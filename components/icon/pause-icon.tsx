import React from "react"
import Icon, { IIconProps } from "./icon"

function PauseIcon(props: IIconProps): JSX.Element {
    return (
        <Icon sourceSvgHeight={24} sourceSvgWidth={24} {...props}>
            <rect x="14" y="4" width="4" height="16" rx="1" /><rect x="6" y="4" width="4" height="16" rx="1" />
        </Icon>)
}

export default PauseIcon


