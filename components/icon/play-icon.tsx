import React from "react"
import Icon, { IIconProps } from "./icon"

function PlayIcon(props: IIconProps): JSX.Element {
    return (
        <Icon sourceSvgHeight={24} sourceSvgWidth={24} {...props}>
            <polygon points="6 3 20 12 6 21 6 3" />
        </Icon>)
}

export default PlayIcon