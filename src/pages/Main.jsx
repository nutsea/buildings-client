import React, { useEffect, useState } from "react";
import { CiSearch } from 'react-icons/ci'
import '../styles/main.scss'
import { createItemAll, createItemMany, createObject, deleteObject, fetchObjects, fetchSummary, searchObjects } from "../http/objectAPI";
import { useNavigate } from "react-router-dom";

const Main = () => {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [floor, setFloor] = useState('')
    const [objects, setObjects] = useState(null)
    const [objectsSearch, setObjectsSearch] = useState(null)
    const [objectsSearch2, setObjectsSearch2] = useState(null)
    const [summary, setSummary] = useState(null)
    const [object, setObject] = useState(null)
    const [itemName, setItemName] = useState('')
    const [total, setTotal] = useState('')
    const [totalNonCash, setTotalNonCash] = useState('')
    const [cash, setCash] = useState('')
    const [nonCash, setNonCash] = useState('')
    const [stepNum, setStepNum] = useState(null)
    const [search, setSearch] = useState('')
    const [search2, setSearch2] = useState('')
    const [objectsList, setObjectsList] = useState([])
    const [isForAll, setIsForAll] = useState(false)
    const [isWork, setIsWork] = useState(false)

    const closeModal = (e) => {
        if (!e.target.classList.contains('modal')) {
            document.querySelector('.CreateObjectModal').classList.add('None')
        }
        if (e.target.classList.contains('close')) {
            document.querySelector('.CreateObjectModal').classList.add('None')
        }
    }

    const closeItemModal = (e) => {
        if (!e.target.classList.contains('modal')) {
            document.querySelector('.CreateItemModal').classList.add('None')
        }
        if (e.target.classList.contains('close')) {
            document.querySelector('.CreateItemModal').classList.add('None')
        }
    }

    const showObjectModal = () => {
        document.querySelector('.CreateObjectModal').classList.remove('None')
    }

    const showItemModal = () => {
        document.querySelector('.CreateItemModal').classList.remove('None')
    }

    const handleSearch = (e) => {
        setSearch(e.target.value)
        searchObjects(e.target.value).then(data => {
            setObjectsSearch(data)
        })
    }

    const handleSearch2 = (e) => {
        setSearch2(e.target.value)
        searchObjects(e.target.value).then(data => {
            setObjectsSearch2(data)
        })
    }

    const handleChangeName = (e) => {
        setName(e.target.value)
    }

    const handleChangeFloor = (e) => {
        const numericValue = e.target.value.replace(/\D/g, '')
        setFloor(numericValue)
    }

    const handleChangeItemName = (e) => {
        setItemName(e.target.value)
    }

    const handleChangeTotal = (e) => {
        const inputValue = e.target.value
        const onlyDigits = inputValue.replace(/\D/g, '')
        setTotal(onlyDigits)
    }

    const handleChangeTotalNonCash = (e) => {
        const inputValue = e.target.value
        const onlyDigits = inputValue.replace(/\D/g, '')
        setTotalNonCash(onlyDigits)
    }

    const handleChangeCash = (e) => {
        const inputValue = e.target.value
        const onlyDigits = inputValue.replace(/\D/g, '')
        setCash(onlyDigits)
    }

    const handleChangeNonCash = (e) => {
        const inputValue = e.target.value
        const onlyDigits = inputValue.replace(/\D/g, '')
        setNonCash(onlyDigits)
    }

    const chooseStepNum = (e) => {
        const allCheckers = document.getElementsByClassName('Checker')
        for (let i of allCheckers) {
            i.checked = false
        }
        e.target.checked = true
        setStepNum(e.target.value)
    }

    const chooseIsWork = (e) => {
        const allCheckers = document.getElementsByClassName('CheckerWork')
        for (let i of allCheckers) {
            i.checked = false
        }
        e.target.checked = true
        setIsWork(e.target.value)
    }

    const chooseObjectsList = (e) => {
        if (e.target.checked) {
            if (!objectsList.includes(e.target.value)) {
                setObjectsList(prevArray => prevArray.concat(Number(e.target.value)))
            }
        } else {
            setObjectsList(prevArray => prevArray.filter(item => item !== Number(e.target.value)))
        }
        console.log(e.target.value)
    }

    const formatNumber = (number) => {
        try {
            let numberString = number.toString()
            let parts = numberString.split(".")
            let integerPart = parts[0]
            let decimalPart = parts.length > 1 ? "." + parts[1] : ""
            integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
            let formattedNumber = integerPart + decimalPart
            return formattedNumber
        } catch (e) {
            return number
        }
    }

    const filteredObjects = () => {
        return objectsSearch
        // if (objects)
        //     return objects.filter((object) => object.name.includes(search) || object.total.toString().includes(search) || object.total_non_cash.toString().includes(search) || object.floor.toString().includes(search))
    }

    const filteredObjects2 = () => {
        return objectsSearch2
        // if (objects)
        //     return objects.filter((object) => object.name.includes(search2))
    }

    const addObject = () => {
        setObjects(null)
        setObjectsSearch(null)
        setObjectsSearch2(null)
        setSummary(null)
        createObject(name, floor).then(() => {
            fetchObjects().then((data) => {
                setObjects(data)
                setObjectsSearch(data)
                setObjectsSearch2(data)
            })
            fetchSummary().then((data) => {
                setSummary(data)
            })
        })
        document.querySelector('.CreateObjectModal').classList.add('None')
        setName('')
        setFloor('')
    }

    const handleNavigate = (id) => {
        navigate(`/object/${id}`)
    }

    const setChooseObject = (object) => {
        setObject(object)
        document.querySelector('.DeleteObjectModal').classList.remove('None')
    }

    const closeDeleteModal = (e) => {
        if (!e.target.classList.contains('modal')) {
            document.querySelector('.DeleteObjectModal').classList.add('None')
        }
        if (e.target.classList.contains('close')) {
            document.querySelector('.DeleteObjectModal').classList.add('None')
        }
    }

    const removeObject = () => {
        let tempObject = object
        setObjects(null)
        setObjectsSearch(null)
        setObjectsSearch2(null)
        setSummary(null)
        deleteObject(tempObject.object_id).then(() => {
            fetchObjects().then((data) => {
                setObjects(data)
                setObjectsSearch(data)
                setObjectsSearch2(data)
            })
            fetchSummary().then((data) => {
                setSummary(data)
            })
        })
        document.querySelector('.DeleteObjectModal').classList.add('None')
        setObject(null)
        setObjectsSearch(null)
        setObjectsSearch2(null)
    }

    const addItem = () => {
        document.querySelector('.CreateItemModal').classList.add('None')
        if (isForAll) {
            setObjects(null)
            setObjectsSearch(null)
            setObjectsSearch2(null)
            setSummary(null)
            createItemAll(itemName, total, totalNonCash, cash, nonCash, stepNum, isWork).then(() => {
                setItemName('')
                setTotal('')
                setTotalNonCash('')
                setCash('')
                setNonCash('')
                setStepNum(null)
                setIsWork(false)
                document.querySelector('.CheckerYes').checked = false
                document.querySelector('.CheckerNo').checked = true
                const allCheckers = document.getElementsByClassName('Checker')
                for (let i of allCheckers) {
                    i.checked = false
                }
                fetchObjects().then((data) => {
                    setObjects(data)
                    setObjectsSearch(data)
                    setObjectsSearch2(data)
                })
                fetchSummary().then((data) => {
                    setSummary(data)
                })
            })
        } else {
            setObjects(null)
            setObjectsSearch(null)
            setObjectsSearch2(null)
            setSummary(null)
            createItemMany(itemName, total, totalNonCash, cash, nonCash, stepNum, objectsList, isWork).then(() => {
                setItemName('')
                setTotal('')
                setTotalNonCash('')
                setCash('')
                setNonCash('')
                setStepNum(null)
                setIsWork(false)
                document.querySelector('.CheckerYes').checked = false
                document.querySelector('.CheckerNo').checked = true
                const allCheckers = document.getElementsByClassName('Checker')
                for (let i of allCheckers) {
                    i.checked = false
                }
                fetchObjects().then((data) => {
                    setObjects(data)
                    setObjectsSearch(data)
                    setObjectsSearch2(data)
                })
                fetchSummary().then((data) => {
                    setSummary(data)
                })
            })
        }
    }

    useEffect(() => {
        fetchObjects().then((data) => {
            setObjects(data)
            setObjectsSearch(data)
            setObjectsSearch2(data)
        })
        fetchSummary().then((data) => {
            setSummary(data)
        })
    }, [])

    useEffect(() => {
        const checkers = document.getElementsByClassName('CheckObject')
        for (let i of checkers) {
            if (objectsList.includes(Number(i.value))) {
                i.checked = true
            }
        }
        // eslint-disable-next-line
    }, [search2])

    return (
        <div className="MainContainer">
            <div className="MainBox">
                <div className="MainTop">
                    <div className="CreateBtns">
                        <button onClick={showObjectModal}>Добавить объект</button>
                        <button
                            onClick={() => {
                                showItemModal()
                                setIsForAll(true)
                            }}
                        >
                            Добавить для всех
                        </button>
                        <button
                            onClick={() => {
                                showItemModal()
                                setIsForAll(false)
                            }}
                        >
                            Добавить выборочно
                        </button>
                    </div>
                    <div className="MainSubCenter">
                        {/* <div>ТЕХНО</div>
                        <div>ЛИТ</div> */}
                        <div>НЬЮ</div>
                        <div>ЛАЙН</div>
                    </div>
                    <div className="MainSummary">
                        <div className="SummarySub">ОБЩАЯ СВОДКА</div>
                        {summary ?
                            <>
                                <div className="SummaryStep">Фундамент: &nbsp;&nbsp;<span>{formatNumber(summary.total1)} ₽ (нал) / {formatNumber(summary.total1_non_cash)} ₽ (безнал)</span></div>
                                <div className="SummaryStep">Здание: &nbsp;&nbsp;<span>{formatNumber(summary.total2)} ₽ (нал) / {formatNumber(summary.total2_non_cash)} ₽ (безнал)</span></div>
                                <div className="SummaryStep">Благоустройство: &nbsp;&nbsp;<span>{formatNumber(summary.total3)} ₽ (нал) / {formatNumber(summary.total3_non_cash)} ₽ (безнал)</span></div>
                                <div className="SummaryStep">Коммуникации: &nbsp;&nbsp;<span>{formatNumber(summary.total4)} ₽ (нал) / {formatNumber(summary.total4_non_cash)} ₽ (безнал)</span></div>
                                <div className="SummaryStep">Отделка: &nbsp;&nbsp;<span>{formatNumber(summary.total5)} ₽ (нал) / {formatNumber(summary.total5_non_cash)} ₽ (безнал)</span></div>
                                <div className="SummaryStep">Итог (нал): &nbsp;&nbsp;<span>{formatNumber(summary.total)} ₽</span></div>
                                <div className="SummaryStep">Итог (безнал): &nbsp;&nbsp;<span>{formatNumber(summary.total_non_cash)} ₽</span></div>
                                <div className="SummaryStep">Оплачено (наличные): &nbsp;&nbsp;<span>{formatNumber(summary.cash)} ₽</span></div>
                                <div className="SummaryStep">Оплачено (безналичные): &nbsp;&nbsp;<span>{formatNumber(summary.non_cash)} ₽</span></div>
                            </>
                            :
                            <div className="LoaderBox">
                                <div className="LoaderLight"></div>
                            </div>
                        }
                    </div>
                </div>
                <div className="MainObjects">
                    <div className="ObjectsSub">ОБЪЕКТЫ</div>
                    <div className="ObjectsSearch">
                        <CiSearch className="ObjectsIcon" size={23} />
                        <input className="ObjectsInput" type="text" placeholder="Поиск" value={search} onChange={handleSearch} />
                    </div>
                    {objects ?
                        <>
                            {filteredObjects().length > 0 ?
                                <div className="ObjectsContainer">
                                    <>
                                        {filteredObjects().map((object) => {
                                            return (
                                                <div key={object.object_id} className="ObjectItem">
                                                    <div className="ObjectFloor">{object.floor} этаж</div>
                                                    <div className="ObjectName">{object.name}</div>
                                                    <div className="ObjectTotal">Общие (нал): <span>{formatNumber(object.total)} ₽</span></div>
                                                    <div className="ObjectTotal">Общие (безнал): <span>{formatNumber(object.total_non_cash)} ₽</span></div>
                                                    <div className="ObjectTotal"><b>ИТОГ: {formatNumber(object.paid_cash + object.paid_non_cash)}</b></div>
                                                    <button className="ObjectView" onClick={() => handleNavigate(object.object_id)}>ПРОСМОТР</button>
                                                    <button className="ObjectDelete" onClick={() => setChooseObject(object)}>УДАЛИТЬ</button>
                                                </div>
                                            )
                                        })}
                                    </>
                                    <div className="ObjectsFigure"></div>
                                </div>
                                :
                                <div className="ObjectsNotFound">Ничего не найдено</div>
                            }
                        </>
                        :
                        <div className="LoaderBox">
                            <div className="Loader"></div>
                        </div>
                    }
                </div>
            </div>
            <div className="CreateObjectModal None" onClick={closeModal}>
                <div className="CreateBox modal">
                    <div className="CreateSub modal">НОВЫЙ ОБЪЕКТ</div>
                    <div className="InputTip modal">Название объекта</div>
                    <input
                        className="CreateInput modal"
                        type="text"
                        placeholder="Название объекта"
                        value={name}
                        onChange={handleChangeName}
                    />
                    <div className="InputTip modal">Этаж</div>
                    <input
                        className="CreateInput modal"
                        type="text"
                        placeholder="Этаж"
                        value={floor}
                        onChange={handleChangeFloor}
                    />
                    <div className="CreateObjectBtns modal">
                        <button className="close" onClick={closeModal}>ОТМЕНА</button>
                        <button className={`AddBtn modal ${name.length > 0 && floor.length > 0 ? '' : 'NonActive'}`} onClick={addObject}>ДОБАВИТЬ</button>
                    </div>
                </div>
            </div>
            <div className="DeleteObjectModal None" onClick={closeDeleteModal}>
                <div className="CreateBox modal">
                    <div className="CreateSub modal">УДАЛИТЬ ОБЪЕКТ "{object ? object.name : ''}"</div>
                    <div className="CreateObjectBtns modal">
                        <button className="close" onClick={closeDeleteModal}>ОТМЕНА</button>
                        <button className="DeleteBtn modal" onClick={removeObject}>УДАЛИТЬ</button>
                    </div>
                </div>
            </div>
            <div className="CreateItemModal None" onClick={closeItemModal}>
                <div className="CreateBox modal">
                    {!isForAll ?
                        <>
                            <div className="CreateSub modal">ДОБАВЛЕНИЕ В ЭТАП ДЛЯ ВЫБРАННЫХ ОБЪЕКТОВ</div>
                            <div className="InputTip modal">Выбор объектов</div>
                            <div className="ChooseStepInputs modal">
                                {objects && filteredObjects().length > 0 ?
                                    <>
                                        <div className="ObjectsSearch2 MB10 modal">
                                            <CiSearch className="ObjectsIcon PointerNone modal" size={23} />
                                            <input className="ObjectsInput modal" type="text" placeholder="Поиск" value={search2} onChange={handleSearch2} />
                                        </div>
                                        {filteredObjects2().map((object) => {
                                            return (
                                                <div key={object.object_id} className="CheckBoxContainer modal">
                                                    <input
                                                        className="CheckObject modal"
                                                        type="checkbox"
                                                        value={object.object_id}
                                                        onClick={chooseObjectsList}
                                                    />
                                                    <div className="modal">{object.name}</div>
                                                </div>
                                            )
                                        })}
                                        <div className="InputTip modal">Выбрано: {objectsList.length}</div>
                                    </>
                                    :
                                    <div className="modal">Объекты отсутствуют</div>
                                }
                            </div>
                        </>
                        :
                        <>
                            <div className="CreateSub modal">ДОБАВЛЕНИЕ В ЭТАП ДЛЯ ВСЕХ ОБЪЕКТОВ</div>
                        </>
                    }
                    <div className="InputTip modal">Выбор этапа</div>
                    <div className="ChooseStepInputs modal">
                        <div className="CheckBoxContainer modal" id="check1">
                            <input
                                className="Checker check1 modal"
                                type="checkbox"
                                id="check1"
                                onClick={chooseStepNum}
                                value={1}
                            />
                            <span className="modal">Фундамент</span>
                        </div>
                        <div className="CheckBoxContainer modal" id="check2">
                            <input
                                className="Checker check2 modal"
                                type="checkbox"
                                id="check2"
                                onClick={chooseStepNum}
                                value={2}
                            />
                            <span className="modal">Здание</span>
                        </div>
                        <div className="CheckBoxContainer modal" id="check3">
                            <input
                                className="Checker check3 modal"
                                type="checkbox"
                                id="check3"
                                onClick={chooseStepNum}
                                value={3}
                            />
                            <span className="modal">Благоустройство</span>
                        </div>
                        <div className="CheckBoxContainer modal" id="check4">
                            <input
                                className="Checker check4 modal"
                                type="checkbox"
                                id="check4"
                                onClick={chooseStepNum}
                                value={4}
                            />
                            <span className="modal">Коммуникации</span>
                        </div>
                        <div className="CheckBoxContainer modal" id="check5">
                            <input
                                className="Checker check5 modal"
                                type="checkbox"
                                id="check5"
                                onClick={chooseStepNum}
                                value={5}
                            />
                            <span className="modal">Отделка</span>
                        </div>
                    </div>
                    <div className="InputTip modal">Добавить в этап "Работа"</div>
                    <div className="ChooseStepInputs modal">
                        <div className="CheckBoxContainer modal">
                            <input
                                className="CheckerWork CheckerNo modal"
                                type="checkbox"
                                onClick={chooseIsWork}
                                value={false}
                                defaultChecked={true}
                            />
                            <span className="modal">Нет</span>
                        </div>
                        <div className="CheckBoxContainer modal">
                            <input
                                className="CheckerWork CheckerYes modal"
                                type="checkbox"
                                onClick={chooseIsWork}
                                value={true}
                            />
                            <span className="modal">Да</span>
                        </div>
                    </div>
                    <div className="InputTip modal">Название действия</div>
                    <input
                        className="CreateInput modal"
                        type="text"
                        placeholder="Название действия"
                        value={itemName}
                        onChange={handleChangeItemName}
                    />
                    <div className="InputTip modal">Стоимость (наличные)</div>
                    <input
                        type="text"
                        className="CreateInput modal"
                        placeholder="Стоимость (наличные)"
                        value={formatNumber(total)}
                        onChange={handleChangeTotal}
                    />
                    <div className="InputTip modal">Стоимость (безналичные)</div>
                    <input
                        type="text"
                        className="CreateInput modal"
                        placeholder="Стоимость (безналичные)"
                        value={formatNumber(totalNonCash)}
                        onChange={handleChangeTotalNonCash}
                    />
                    <div className="InputTip modal">Оплачено (наличные)</div>
                    <input
                        type="text"
                        className="CreateInput modal"
                        placeholder="Оплачено (наличные)"
                        value={formatNumber(cash)}
                        onChange={handleChangeCash}
                    />
                    <div className="InputTip modal">Оплачено (безналичные)</div>
                    <input
                        type="text"
                        className="CreateInput modal"
                        placeholder="Оплачено (безналичные)"
                        value={formatNumber(nonCash)}
                        onChange={handleChangeNonCash}
                    />
                    <div className="CreateObjectBtns modal">
                        <button className="close" onClick={closeItemModal}>ОТМЕНА</button>
                        {isForAll ?
                            <button className={`AddBtn modal ${itemName.length > 0 && total.length > 0 && cash.length > 0 && nonCash.length && stepNum > 0 ? '' : 'NonActive'}`} onClick={() => addItem()}>ДОБАВИТЬ</button>
                            :
                            <button className={`AddBtn modal ${itemName.length > 0 && total.length > 0 && cash.length > 0 && nonCash.length && stepNum > 0 && objectsList.length > 0 ? '' : 'NonActive'}`} onClick={() => addItem()}>ДОБАВИТЬ</button>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Main;