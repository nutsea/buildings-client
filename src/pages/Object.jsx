import React from "react";
import '../styles/object.scss'
import { useParams } from "react-router-dom";

const Object = () => {
    const { id } = useParams()

    return (
        <div>{id}</div>
    );
}

export default Object;