import React, { useEffect, useState } from "react";
import { CiSearch } from 'react-icons/ci'
import '../styles/main.scss'
import { createObject, fetchObjects, fetchSummary } from "../http/objectAPI";
import { useNavigate } from "react-router-dom";

const Main = () => {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [objects, setObjects] = useState(null)
    const [summary, setSummary] = useState(null)

    const closeModal = (e) => {
        if (!e.target.classList.contains('modal')) {
            document.querySelector('.CreateObjectModal').classList.add('None')
        }
        if (e.target.classList.contains('close')) {
            document.querySelector('.CreateObjectModal').classList.add('None')
        }
    }

    const showObjectModal = () => {
        document.querySelector('.CreateObjectModal').classList.remove('None')
    }

    const handleChangeName = (e) => {
        setName(e.target.value)
    }

    const formatNumber = (number) => {
        let numberString = number.toString()
        let parts = numberString.split(".")
        let integerPart = parts[0]
        let decimalPart = parts.length > 1 ? "." + parts[1] : ""
        integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        let formattedNumber = integerPart + decimalPart
        return formattedNumber
    }

    const addObject = () => {
        createObject(name).then(() => {
            fetchObjects().then((data) => {
                setObjects(data)
            })
            fetchSummary().then((data) => {
                setSummary(data)
            })
        })
        document.querySelector('.CreateObjectModal').classList.add('None')
    }

    const handleNavigate = (id) => {
        navigate(`/object/${id}`)
    }

    useEffect(() => {
        fetchObjects().then((data) => {
            setObjects(data)
        })
        fetchSummary().then((data) => {
            setSummary(data)
        })
    }, [])

    return (
        <div className="MainContainer">
            <div className="MainBox">
                <div className="MainTop">
                    <div className="CreateBtns">
                        <button onClick={showObjectModal}>Добавить объект</button>
                        <button>Добавить для всех</button>
                        <button>Добавить выборочно</button>
                    </div>
                    <div className="MainSummary">
                        <div className="SummarySub">ОБЩАЯ СВОДКА</div>
                        {summary &&
                            <>
                                <div className="SummaryStep">Этап 1: &nbsp;&nbsp;<span>{formatNumber(summary.total1)} ₽</span></div>
                                <div className="SummaryStep">Этап 2: &nbsp;&nbsp;<span>{formatNumber(summary.total2)} ₽</span></div>
                                <div className="SummaryStep">Этап 3: &nbsp;&nbsp;<span>{formatNumber(summary.total3)} ₽</span></div>
                                <div className="SummaryStep">Этап 4: &nbsp;&nbsp;<span>{formatNumber(summary.total4)} ₽</span></div>
                                <div className="SummaryStep">Итог: &nbsp;&nbsp;<span>{formatNumber(summary.total)} ₽</span></div>
                                <div className="SummaryStep">Оплачено (наличные): &nbsp;&nbsp;<span>{formatNumber(summary.cash)} ₽</span></div>
                                <div className="SummaryStep">Оплачено (безналичные): &nbsp;&nbsp;<span>{formatNumber(summary.non_cash)} ₽</span></div>
                            </>
                        }
                    </div>
                </div>
                <div className="MainObjects">
                    <div className="ObjectsSub">ОБЪЕКТЫ</div>
                    <div className="ObjectsSearch">
                        <CiSearch className="ObjectsIcon" size={23} />
                        <input className="ObjectsInput" type="text" placeholder="Поиск" />
                    </div>
                    <div className="ObjectsContainer">
                        {objects && objects.map((object) => {
                            return (
                                <div key={object.object_id} className="ObjectItem">
                                    <div className="ObjectName">{object.name}</div>
                                    <div className="ObjectTotal">Общие: <span>{formatNumber(object.total)} ₽</span></div>
                                    <button className="ObjectView" onClick={() => handleNavigate(object.object_id)}>ПРОСМОТР</button>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div className="CreateObjectModal None" onClick={closeModal}>
                <div className="CreateBox modal">
                    <div className="CreateSub modal">НОВЫЙ ОБЪЕКТ</div>
                    <input
                        className="CreateInput modal"
                        type="text"
                        placeholder="Название объекта"
                        value={name}
                        onChange={handleChangeName}
                    />
                    <div className="CreateObjectBtns modal">
                        <button className="close">ОТМЕНА</button>
                        <button className="AddBtn modal" onClick={addObject}>ДОБАВИТЬ</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Main;