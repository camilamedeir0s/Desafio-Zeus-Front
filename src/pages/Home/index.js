import React, { useState, useEffect } from 'react';
import { FiDelete, FiEdit, FiTrash2 } from 'react-icons/fi';

import api from '../../services/api';
import './styles.css';

function Home() {
    const [purchases, setPurchases] = useState([]);
    const [visibility, setVisibility] = useState(false);
    const [amountPrice, setAmountPrice] = useState('');
    const [amountQuantity, setAmountQuantity] = useState('');

    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');

    const [editName, setEditName] = useState('');
    const [editQuantity, setEditQuantity] = useState('');
    const [editPrice, setEditPrice] = useState('');
    const [editId, setEditId] = useState('');



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
            const response = await api.post('/create', data)
            alert('Cadastro realizado')

        } catch (error) {
            alert('Erro no cadastro. Tente novamente.')
        }
    }

    async function loadPurchases() {
        await api.get('find', {}).then(response => {
            setPurchases(response.data);
        })
    }

    // async function getAmount() {
    //     try {
    //         await api.get(`amount?month=${month}&year=${year}`, {}).then(response =>{
    //             setAmountPrice(response.data.amountPrice);
    //             setAmountQuantity(response.data.setAmountQuantity);
    //         });

    //         //TIRAR O MONTH E O YEAR DAS OPÇÕES EH NOIS UHU
            
    //     } catch (error) {
    //         alert('Erro ao buscar os valores');
    //     }   
    // }

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
                    <h1>Digite as informações da compra</h1>
                    <label for="name">Nome da ração:</label>
                    <input
                        placeholder="Nome"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <label for="quantity">Quantidade de ração:</label>
                    <input
                        placeholder="Kg"
                        value={quantity}
                        onChange={e => setQuantity(e.target.value)}
                        type="number"
                    />
                    <label for="price">Preço da compra:</label>
                    <input
                        placeholder="R$"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        type="number"
                    />
                    <button className="button" type="submit">Salvar</button>
                </form>
            </div>


            <div className="info">
                <h1>Compras realizadas</h1>
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
                                    <FiEdit size={16} color="#E02041" />
                                </button>
                            </td>

                            <td>
                                <button onClick={() => deletePurchase(purchase._id)} type="button">
                                    <FiTrash2 size={16} color="#E02041" />
                                </button>
                            </td>
                        </tr>
                    )}

                </table>
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
                            placeholder="Kg"
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
                <label for="date">Data</label>
                <select name="month" id="month">
                    <option value="0">Mês</option>
                    <option value="1">Janeiro</option>
                    <option value="2">Fevereiro</option>
                    <option value="3">Março</option>
                    <option value="4">Abril</option>
                    <option value="5">Maio</option>
                    <option value="6">Junho</option>
                    <option value="7">Julho</option>
                    <option value="8">Agosto</option>
                    <option value="9">Setembro</option>
                    <option value="10">Outubro</option>
                    <option value="11">Novembro</option>
                    <option value="12">Dezembro</option>
                </select>

                <select name="year" id="year">
                    <option value="0">Ano</option>
                    <option value="2021">2021</option>
                    <option value="2022">2022</option>
                    <option value="2023">2023</option>
                    <option value="2024">2024</option>
                </select>
            </div>


        </div>
    );
}

export default Home;