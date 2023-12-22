import React, { useEffect, useState } from "react";
import '../styles/object.scss'
import { useParams } from "react-router-dom";
import { createItem, createNew, createNewFiles, deleteItem, findItems, findObject, findSteps, getFiles, updateItem } from "../http/objectAPI";
import { GoPlus, GoPencil, GoTrash, GoFile } from 'react-icons/go'

const Object = () => {
    const { id } = useParams()
    const [object, setObject] = useState(null)
    const [steps, setSteps] = useState(null)
    const [items, setItems] = useState([])
    const [name, setName] = useState('')
    const [total, setTotal] = useState('')
    const [totalNonCash, setTotalNonCash] = useState('')
    const [cash, setCash] = useState('')
    const [nonCash, setNonCash] = useState('')
    const [stepId, setStepId] = useState(null)
    const [stepNum, setStepNum] = useState('')
    const [isCreating, setIsCreating] = useState(false)
    const [updatingId, setUpdatingId] = useState(null)
    const [deletingName, setDeletingName] = useState(null)
    const [deletingId, setDeletingId] = useState(null)
    const [pdfFiles, setPdfFiles] = useState(null)
    const [isFileView, setIsFileView] = useState(false)
    const [itemFiles, setItemFiles] = useState(null)
    const [itemId, setItemId] = useState(null)
    const [isWork, setIsWork] = useState(false)

    const sortByNumber = (steps) => {
        return steps.slice().sort((a, b) => a.number - b.number);
    }

    const chooseStep = (step_id, number) => {
        setStepId(step_id)
        setStepNum(number)
        document.querySelector('.CreateObjectModal').classList.remove('None')
    }

    const chooseItem = (id, name, total, total_non_cash, paid_cash, paid_non_cash) => {
        setUpdatingId(id)
        setName(name)
        setTotal(total)
        setTotalNonCash(total_non_cash)
        setCash(paid_cash)
        setNonCash(paid_non_cash)
        document.querySelector('.CreateObjectModal').classList.remove('None')
    }

    const chooseToDelete = (id, name) => {
        setDeletingId(id)
        setDeletingName(name)
        document.querySelector('.DeleteObjectModal').classList.remove('None')
    }

    const handleChangeName = (e) => {
        setName(e.target.value)
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

    const showFiles = (item_id) => {
        setItemId(item_id)
        setIsFileView(true)
        getFiles(item_id).then(data => {
            setItemFiles(data)
            console.log(data)
        })
    }

    const hideFiles = (e) => {
        if (!e.target.classList.contains('modal')) {
            setIsFileView(false)
            setItemFiles(null)
        }
    }

    const addNewFiles = (e) => {
        createNewFiles(itemId, pdfFiles).then(() => {
            setItemFiles(null)
            getFiles(itemId).then(data => {
                setItemFiles(data)
                setPdfFiles(null)
            })
        })
    }

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
            setName('')
            setTotal('')
            setTotalNonCash('')
            setCash('')
            setNonCash('')
            setStepId(null)
            setStepNum('')
        }
        if (e.target.classList.contains('close')) {
            document.querySelector('.CreateItemModal').classList.add('None')
            setName('')
            setTotal('')
            setTotalNonCash('')
            setCash('')
            setNonCash('')
            setStepId(null)
            setStepNum('')
        }
    }

    const showItemModal = () => {
        document.querySelector('.CreateItemModal').classList.remove('None')
    }

    const chooseStepNum = (e) => {
        const allCheckers = document.getElementsByClassName('Checker')
        for (let i of allCheckers) {
            i.checked = false
        }
        e.target.checked = true
        setStepNum(e.target.value)
        let thisStep = steps.filter(obj => Number(obj.number) === Number(e.target.value))
        setStepId(thisStep[0].step_id)
    }

    const addItem = () => {
        document.querySelector('.CreateObjectModal').classList.add('None')
        document.querySelector('.CreateItemModal').classList.add('None')
        setStepNum('')
        if (isCreating) {
            if (pdfFiles) {
                setItems([])
                setSteps(null)
                createNew(name, total, totalNonCash, cash, nonCash, stepId, isWork, pdfFiles).then(() => {
                    setPdfFiles(null)
                    setName('')
                    setTotal('')
                    setTotalNonCash('')
                    setCash('')
                    setNonCash('')
                    setStepId(null)
                    // setSteps(null)
                    setIsWork(false)
                    findSteps(id).then(data => {
                        // setItems([])
                        setSteps(data)
                    })
                })
            } else {
                setItems([])
                setSteps(null)
                createItem(name, total, totalNonCash, cash, nonCash, stepId, isWork).then(() => {
                    setName('')
                    setTotal('')
                    setTotalNonCash('')
                    setCash('')
                    setNonCash('')
                    setStepId(null)
                    setSteps(null)
                    setIsWork(false)
                    findSteps(id).then(data => {
                        // setItems([])
                        setSteps(data)
                    })
                })
            }
        } else {
            setItems([])
            setSteps(null)
            updateItem(updatingId, name, total, totalNonCash, cash, nonCash).then(() => {
                // setSteps(null)
                setName('')
                setTotal('')
                setCash('')
                setNonCash('')
                setStepId(null)
                findSteps(id).then(data => {
                    // setItems([])
                    setSteps(data)
                })
            })
        }
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

    const closeDeleteModal = (e) => {
        if (!e.target.classList.contains('modal')) {
            document.querySelector('.DeleteObjectModal').classList.add('None')
        }
        if (e.target.classList.contains('close')) {
            document.querySelector('.DeleteObjectModal').classList.add('None')
        }
    }

    const removeItem = () => {
        document.querySelector('.DeleteObjectModal').classList.add('None')
        setSteps(null)
        deleteItem(deletingId).then(() => {
            // setSteps(null)
            setItems([])
            findSteps(id).then(data => {
                // setItems([])
                setSteps(data)
            })
        })
    }

    const isItemInArr = (array, id) => {
        return array.some(obj => obj.step_id === id)
    }

    const filteredItems = (id) => {
        return items.filter(item => item.step_id === id)
    }

    const setFiles = (e) => {
        const unset = document.querySelector(`.${e.target.id}Unset`)
        const set = document.querySelector(`.${e.target.id}Set`)
        const clear = document.querySelector(`.${e.target.id}Clear`)

        if (e.target.files.length === 1) {
            const text = document.querySelector(`.${e.target.id}Name`)
            text.innerText = e.target.files[0].name
            unset.classList.remove('Showed')
            set.classList.add('Showed')
            clear.classList.add('Showed')
            setPdfFiles(e.target.files)
        }

        if (e.target.files.length > 1) {
            const text = document.querySelector(`.${e.target.id}Name`)
            text.innerText = 'Выбрано файлов: ' + e.target.files.length
            unset.classList.remove('Showed')
            set.classList.add('Showed')
            clear.classList.add('Showed')
            setPdfFiles(e.target.files)
        }
    }

    const clearFiles = (e) => {
        document.querySelector(`.${e.target.id}Input`).value = null
        document.querySelector(`.${e.target.id}Unset`).classList.add('Showed')
        document.querySelector(`.${e.target.id}Set`).classList.remove('Showed')
        document.querySelector(`.${e.target.id}Clear`).classList.remove('Showed')
        setPdfFiles(null)
    }

    const clearFiles2 = (e) => {
        document.querySelector(`.${e.target.id}Input`).value = null
        document.querySelector(`.${e.target.id}Unset`).classList.add('Showed')
        document.querySelector(`.${e.target.id}Set`).classList.remove('Showed')
        document.querySelector(`.${e.target.id}Clear`).classList.remove('Showed')
        setPdfFiles(null)
    }

    const hasWork = (array) => {
        return array.some(obj => obj.is_work === true)
    }

    const getWork = (array) => {
        return array.filter(obj => obj.is_work === true)
    }

    const workTotal = (array) => {
        const workItems = array.filter(obj => obj.is_work === true)
        let workTotal = 0
        for (let i of workItems) {
            workTotal += i.total
        }
        return workTotal
    }

    const workTotalNonCash = (array) => {
        const workItems = array.filter(obj => obj.is_work === true)
        let workTotalNonCash = 0
        for (let i of workItems) {
            workTotalNonCash += i.total_non_cash
        }
        return workTotalNonCash
    }

    const workCash = (array) => {
        const workItems = array.filter(obj => obj.is_work === true)
        let workCash = 0
        for (let i of workItems) {
            workCash += i.paid_cash
        }
        return workCash
    }

    const workNonCash = (array) => {
        const workItems = array.filter(obj => obj.is_work === true)
        let workNonCash = 0
        for (let i of workItems) {
            workNonCash += i.paid_non_cash
        }
        return workNonCash
    }

    useEffect(() => {
        findObject(id).then(data => {
            setObject(data)
        })
        findSteps(id).then(data => {
            setSteps(data)
        })
    }, [id])

    useEffect(() => {
        if (steps) {
            for (let i = 0; i < 5; i++) {
                findItems(steps[i].step_id).then(newItems => {
                    if (newItems) {
                        for (let i of newItems) {
                            setItems(prevArray => [...prevArray, i])
                        }
                    }
                })
            }
        }
        // eslint-disable-next-line
    }, [steps])

    return (
        <div className="ObjectContainer">
            {object ?
                <>
                    <div className="ObjectSub">{object.name} ({object.floor} этаж)</div>
                    {steps && items ?
                        <div>
                            {sortByNumber(steps).map((step) => {
                                return (
                                    <div key={step.step_id} className="StepCard">
                                        <div className="StepSub">
                                            {step.number === 1 ?
                                                'Фундамент'
                                                : step.number === 2 ?
                                                    'Здание'
                                                    : step.number === 3 ?
                                                        'Благоустройство'
                                                        : step.number === 4 ?
                                                            'Коммуникации'
                                                            : step.number === 5 &&
                                                            'Отделка'
                                            }
                                        </div>
                                        {isItemInArr(items, step.step_id) &&
                                            <div className="StepTable">
                                                <table>
                                                    <thead>
                                                        <tr>
                                                            <th>Наименование</th>
                                                            <th>Сумма (нал)</th>
                                                            <th>Сумма (безнал)</th>
                                                            <th>Оплачено (нал)</th>
                                                            <th>Оплачено (нал)</th>
                                                            <th>Документы</th>
                                                            <th>Редактировать</th>
                                                            <th>Удалить</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {filteredItems(step.step_id).map((item, i) => {
                                                            return (
                                                                <tr key={i}>
                                                                    <td>{item.name}</td>
                                                                    <td>{formatNumber(item.total)} ₽</td>
                                                                    <td>{formatNumber(item.total_non_cash)} ₽</td>
                                                                    <td>{formatNumber(item.paid_cash)} ₽</td>
                                                                    <td>{formatNumber(item.paid_non_cash)} ₽</td>
                                                                    <td className="TableFiles" onClick={() => showFiles(item.item_id)}>Просмотр</td>
                                                                    <td
                                                                        className="UpdateItem"
                                                                        onClick={() => {
                                                                            chooseItem(item.item_id, item.name, item.total, item.total_non_cash, item.paid_cash, item.paid_non_cash)
                                                                            setIsCreating(false)
                                                                        }}
                                                                    >
                                                                        <GoPencil size={22} style={{ marginTop: 3 }} />
                                                                    </td>
                                                                    <td
                                                                        className="DeleteItem"
                                                                        onClick={() => {
                                                                            chooseToDelete(item.item_id, item.name)
                                                                        }}
                                                                    >
                                                                        <GoTrash size={22} style={{ marginTop: 3 }} />
                                                                    </td>
                                                                </tr>
                                                            )
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        }
                                        <button
                                            className="AddItem"
                                            onClick={() => {
                                                chooseStep(step.step_id, step.number)
                                                setIsCreating(true)
                                                setIsWork(false)
                                            }}
                                        >
                                            <GoPlus size={30} />
                                        </button>
                                        <div className="StepTotal">Итог (наличные): <span>{formatNumber(step.total)} ₽</span></div>
                                        <div className="StepTotal">Итог (безналичные): <span>{formatNumber(step.total_non_cash)} ₽</span></div>
                                        <div className="StepTotal">Оплачено (наличные): <span>{formatNumber(step.paid_cash)} ₽</span></div>
                                        <div className="StepTotal">Оплачено (безналичные): <span>{formatNumber(step.paid_non_cash)} ₽</span></div>
                                    </div>
                                )
                            })}
                            <div className="StepCard">
                                <div className="StepSub">Работа</div>
                                {hasWork(items) &&
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Наименование</th>
                                                <th>Сумма (нал)</th>
                                                <th>Сумма (безнал)</th>
                                                <th>Оплачено (нал)</th>
                                                <th>Оплачено (нал)</th>
                                                <th>Документы</th>
                                                <th>Редактировать</th>
                                                <th>Удалить</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {getWork(items).map((item, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td>{item.name}</td>
                                                        <td>{formatNumber(item.total)} ₽</td>
                                                        <td>{formatNumber(item.total_non_cash)} ₽</td>
                                                        <td>{formatNumber(item.paid_cash)} ₽</td>
                                                        <td>{formatNumber(item.paid_non_cash)} ₽</td>
                                                        <td className="TableFiles" onClick={() => showFiles(item.item_id)}>Просмотр</td>
                                                        <td
                                                            className="UpdateItem"
                                                            onClick={() => {
                                                                chooseItem(item.item_id, item.name, item.total, item.total_non_cash, item.paid_cash, item.paid_non_cash)
                                                                setIsCreating(false)
                                                            }}
                                                        >
                                                            <GoPencil size={22} style={{ marginTop: 3 }} />
                                                        </td>
                                                        <td
                                                            className="DeleteItem"
                                                            onClick={() => {
                                                                chooseToDelete(item.item_id, item.name)
                                                            }}
                                                        >
                                                            <GoTrash size={22} style={{ marginTop: 3 }} />
                                                        </td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                }
                                <button
                                    className="AddItem"
                                    onClick={() => {
                                        showItemModal()
                                        setIsCreating(true)
                                        setIsWork(true)
                                    }}
                                >
                                    <GoPlus size={30} />
                                </button>
                                <div className="StepTotal">Итог (наличные): <span>{formatNumber(workTotal(items))} ₽</span></div>
                                <div className="StepTotal">Итог (безналичные): <span>{formatNumber(workTotalNonCash(items))} ₽</span></div>
                                <div className="StepTotal">Оплачено (наличные): <span>{formatNumber(workCash(items))} ₽</span></div>
                                <div className="StepTotal">Оплачено (безналичные): <span>{formatNumber(workNonCash(items))} ₽</span></div>
                            </div>
                        </div>
                        :
                        <div className="LoaderBox">
                            <div className="Loader"></div>
                        </div>
                    }
                </>
                :
                <div className="LoaderBox">
                    <div className="Loader"></div>
                </div>
            }
            <div className="CreateObjectModal None" onClick={closeModal}>
                <div className="CreateBox modal">
                    {isCreating ?
                        <div className="CreateSub modal">ДОБАВЛЕНИЕ В ЭТАП "{stepNum === 1 ?
                            'Фундамент'
                            : stepNum === 2 ?
                                'Здание'
                                : stepNum === 3 ?
                                    'Благоустройство'
                                    : stepNum === 4 ?
                                        'Коммуникации'
                                        : stepNum === 5 &&
                                        'Отделка'
                        }"</div>
                        :
                        <div className="CreateSub modal">РЕДАКТИРОВАНИЕ</div>
                    }
                    <div className="InputTip modal">Название действия</div>
                    <input
                        className="CreateInput modal"
                        type="text"
                        placeholder="Название действия"
                        value={name}
                        onChange={handleChangeName}
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
                    {isCreating &&
                        <>
                            <div className="InputTip modal">Документы</div>
                            <div className="FileInput origfile modal">
                                <input
                                    className="origfileInput modal"
                                    type="file"
                                    accept=".pdf, .PDF"
                                    multiple={true}
                                    id="origfile"
                                    name="file"
                                    onChange={(e) => {
                                        setFiles(e)
                                    }}
                                />
                                <div className="FileInfo origfileUnset Showed modal">
                                    <div className="FileText modal">
                                        <GoFile className="FileImg PointerNone" size={20} />
                                        <div className="FileTextLoad modal">Документы</div>
                                    </div>
                                    <div className="FileClue modal">Нажмите на поле или перетащите файлы</div>
                                    <div className="FileClue modal">Формат - pdf</div>
                                </div>
                                <div className="FileInfo origfileSet modal">
                                    <div className="FileText modal">
                                        <GoFile className="FileImg PointerNone" size={20} />
                                        <div className="FileTextLoad origfileName modal"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="file FileClear origfileClear modal" id="origfile" name="file" onClick={clearFiles}>Очистить поле документов</div>
                        </>
                    }
                    <div className="CreateObjectBtns modal">
                        <button className="close" onClick={closeModal}>ОТМЕНА</button>
                        {isCreating ?
                            <button className={`AddBtn modal ${name.length === 0 || total.length === 0 || cash.length === 0 || nonCash.length === 0 ? 'NonActive' : ''}`} onClick={() => addItem()}>ДОБАВИТЬ</button>
                            :
                            <button className={`AddBtn modal ${name.length === 0 || total.length === 0 || cash.length === 0 || nonCash.length === 0 ? 'NonActive' : ''}`} onClick={() => addItem()}>СОХРАНИТЬ</button>
                        }
                    </div>
                </div>
            </div>
            <div className="DeleteObjectModal None" onClick={closeDeleteModal}>
                <div className="CreateBox modal">
                    <div className="CreateSub modal">УДАЛИТЬ "{deletingName}"</div>
                    <div className="CreateObjectBtns modal">
                        <button className="close" onClick={closeDeleteModal}>ОТМЕНА</button>
                        <button className="DeleteBtn modal" onClick={removeItem}>УДАЛИТЬ</button>
                    </div>
                </div>
            </div>
            <div className="CreateItemModal None" onClick={closeItemModal}>
                <div className="CreateBox modal">
                    <div className="CreateSub modal">ДОБАВЛЕНИЕ В ЭТАП "Работа"</div>
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
                    <div className="InputTip modal">Название действия</div>
                    <input
                        className="CreateInput modal"
                        type="text"
                        placeholder="Название действия"
                        value={name}
                        onChange={handleChangeName}
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
                    <div className="InputTip modal">Документы</div>
                    <div className="FileInput origfile modal">
                        <input
                            className="origfileInput modal"
                            type="file"
                            accept=".pdf, .PDF"
                            multiple={true}
                            id="origfile"
                            name="file"
                            onChange={(e) => {
                                setFiles(e)
                            }}
                        />
                        <div className="FileInfo origfileUnset Showed modal">
                            <div className="FileText modal">
                                <GoFile className="FileImg PointerNone" size={20} />
                                <div className="FileTextLoad modal">Документы</div>
                            </div>
                            <div className="FileClue modal">Нажмите на поле или перетащите файлы</div>
                            <div className="FileClue modal">Формат - pdf</div>
                        </div>
                        <div className="FileInfo origfileSet modal">
                            <div className="FileText modal">
                                <GoFile className="FileImg PointerNone" size={20} />
                                <div className="FileTextLoad origfileName modal"></div>
                            </div>
                        </div>
                    </div>
                    <div className="file FileClear origfileClear modal" id="origfile" name="file" onClick={clearFiles}>Очистить поле документов</div>
                    <div className="CreateObjectBtns modal">
                        <button className="close" onClick={closeItemModal}>ОТМЕНА</button>
                        <button className={`AddBtn modal ${name.length > 0 && total.length > 0 && cash.length > 0 && nonCash.length && stepNum > 0 ? '' : 'NonActive'}`} onClick={() => addItem()}>ДОБАВИТЬ</button>
                    </div>
                </div>
            </div>
            {isFileView &&
                <div className="FilesModal" onClick={hideFiles}>
                    <div className="CreateBox modal">
                        <div className="CreateSub modal">ДОКУМЕНТЫ</div>
                        {itemFiles ?
                            <>
                                {itemFiles.map((file) => {
                                    return (
                                        <div key={file.id} className="FileLink modal">
                                            <a className="modal" href={process.env.REACT_APP_API_URL + `static/` + file.file} target="_blank" rel="noreferrer">{file.name}</a>
                                        </div>
                                    )
                                })}
                                <div className="FileInput MT10 origfile2 modal">
                                    <input
                                        className="origfile2Input modal"
                                        type="file"
                                        accept=".pdf, .PDF"
                                        multiple={true}
                                        id="origfile2"
                                        name="file"
                                        onChange={(e) => {
                                            setFiles(e)
                                        }}
                                    />
                                    <div className="FileInfo origfile2Unset Showed modal">
                                        <div className="FileText modal">
                                            <GoFile className="FileImg PointerNone" size={20} />
                                            <div className="FileTextLoad modal">Документы</div>
                                        </div>
                                        <div className="FileClue modal">Нажмите на поле или перетащите файлы</div>
                                        <div className="FileClue modal">Формат - pdf</div>
                                    </div>
                                    <div className="FileInfo origfile2Set modal">
                                        <div className="FileText modal">
                                            <GoFile className="FileImg PointerNone" size={20} />
                                            <div className="FileTextLoad origfile2Name modal"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="file FileClear origfile2Clear modal" id="origfile2" name="file" onClick={clearFiles2}>Очистить поле документов</div>
                                <button
                                    className={`AddItem modal ${pdfFiles ? '' : 'NonActive'}`}
                                    onClick={addNewFiles}
                                >
                                    <GoPlus className="PointerNone" size={30} />
                                </button>
                            </>
                            :
                            <div className="LoaderBox">
                                <div className="Loader"></div>
                            </div>
                        }
                    </div>
                </div>
            }
        </div>
    );
}

export default Object;