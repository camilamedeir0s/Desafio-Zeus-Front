import React, { useState, useEffect, Alert } from 'react';
import { FiDelete, FiEdit, FiFilter, FiSearch, FiTrash2 } from 'react-icons/fi';

import api from '../../services/api';
import './styles.css';

function Home() {
    const [purchases, setPurchases] = useState([]);
    const [visibility, setVisibility] = useState(false);

    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');

    const [editName, setEditName] = useState('');
    const [editQuantity, setEditQuantity] = useState('');
    const [editPrice, setEditPrice] = useState('');
    const [editId, setEditId] = useState('');

    const [amountPrice, setAmountPrice] = useState('0');
    const [amountQuantity, setAmountQuantity] = useState('0');
    const [chosenMonth, setChosenMonth] = useState('');
    const [chosenYear, setChosenYear] = useState('');


    useEffect(() => {
        loadPurchases().then();
    }, []);

    async function handleRegister() {
        const data = {
            name,
            quantity,
            price,
        }

        try {
            const response = await api.post('create', data)
            alert('Cadastro realizado')

        } catch (error) {
            alert('Erro no cadastro. Tente novamente.')
        }
    }

    async function loadPurchases() {
        await api.get('find', {}).then(response => {
            setPurchases(response.data);
            getAmount()
        })
    }

    async function getAmount() {
        try {
            await api.get(`amountMonth?month=${chosenMonth}&year=${chosenYear}`, {}).then(response => {
                setAmountPrice(response.data.amountPrice);
                setAmountQuantity(response.data.amountQuantity);
            });
        } catch (error) {
            alert('Erro ao buscar os valores');
        }
    }

    async function updatePurchase(editId) {
        const data = {
            name: editName,
            quantity: editQuantity,
            price: editPrice,
        }
        try {
            await api.put(`update/${editId}`, data);
            closeEditor()
            loadPurchases()
            alert('Cadastro atualizado')
        } catch (error) {
            alert('Erro na edição')
        }
    }

    async function deletePurchase(id) {
        try {
            await api.delete(`delete/${id}`);
            loadPurchases()

        } catch (error) {
            alert('Erro ao deletar, tente novamente.')
        }
    }

    function alertDelete(id){
        if(window.confirm("Você deseja deletar?")){
            deletePurchase(id);
        }
    }

    function openEditor(id, name, quantity, price) {
        setVisibility(true)
        setEditId(id)
        setEditName(name)
        setEditQuantity(quantity)
        setEditPrice(price)
    }

    function closeEditor() {
        setVisibility(false)
    }

    return (
        <div className="container">
            <div className="form">
                <form onSubmit={handleRegister}>
                    <h1>Informações da compra</h1>
                    <label for="name">Nome da ração:</label>
                    <input
                        placeholder="Ex: Ração do Zeus"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <label for="quantity">Quantidade de ração (kg):</label>
                    <input
                        placeholder="Ex: 2"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        type="number"
                    />
                    <label for="price">Preço da compra (R$):</label>
                    <input
                        placeholder="Ex: 100"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        type="number"
                    />
                    <button className="button" type="submit">Salvar</button>
                </form>
            </div>


            <div className="infocontainer">
                <div className="info">
                    <table>
                        <tr>
                            <th>Nome da ração</th>
                            <th>Quantidade</th>
                            <th>Preço</th>
                            <th>Data</th>
                            <th><FiEdit size={16} color="#000000" /></th>
                            <th><FiTrash2 size={16} color="#000000" /> </th>
                        </tr>
                        {purchases.map((purchase) =>
                            <tr key={purchase._id}>
                                <td>{purchase.name}</td>
                                <td>{purchase.quantity}</td>
                                <td>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(purchase.price)}</td>
                                <td>{(new Intl.DateTimeFormat('pt-br')).format(new Date(purchase.date))}</td>

                                <td>
                                    <button onClick={() => openEditor(purchase._id, purchase.name, purchase.quantity, purchase.price)} type="button">
                                        <FiEdit size={16} color="6A5ACD" />
                                    </button>
                                </td>

                                <td>
                                    <button onClick={() => alertDelete(purchase._id)} type="button">
                                        <FiTrash2 size={16} color="#FF0000" />
                                    </button>
                                </td>
                            </tr>
                        )}

                    </table>
                </div>

            </div>


            {visibility ? (
                <div className="edit" >
                    <div className="editPopUp">
                        <h1>Edite as informações</h1>
                        <label for="name">Nome da ração:</label>
                        <input
                            placeholder="Nome"
                            value={editName}
                            onChange={e => setEditName(e.target.value)}
                        />
                        <label for="quantity">Quantidade de ração:</label>
                        <input
                            placeholder="10kg"
                            value={editQuantity}
                            onChange={e => setEditQuantity(e.target.value)}
                        />
                        <label for="price">Preço da compra:</label>
                        <input
                            placeholder="R$"
                            value={editPrice}
                            onChange={e => setEditPrice(e.target.value)}
                        />
                        <button onClick={() => updatePurchase(editId)} className="button">Salvar</button>
                        <button onClick={() => closeEditor()} className="button">Cancelar</button>

                    </div>

                </div>
            ) : null}

            <div className="monthYear">
                <h1>Gasto mensal</h1>
                <p>Selecione o mês e o ano para conferir o gasto mensal com ração</p>
                <input
                    placeholder="Ex: 5"
                    value={chosenMonth}
                    onChange={e => setChosenMonth(e.target.value)}
                    type="number"
                    min="0" max="12"
                />
                <input
                    placeholder="Ex: 2021"
                    value={chosenYear}
                    onChange={e => setChosenYear(e.target.value)}
                    type="number"
                    min="2021"
                />

                <button onClick={() => getAmount()} type="button" className="button">
                    Buscar
                    <FiSearch size={16} color="#f8f8f8" />
                </button>

                <div className="purchaseContainer">
                    <div className="purchaseValue">
                        <p>R${amountPrice}</p>
                    </div>
                    <div className="purchaseValue">
                        <p>{amountQuantity}kg</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;