import React, { useState, useEffect } from 'react';
import { FiEdit } from 'react-icons/fi';

import api from '../../services/api';
import './styles.css';

function Home() {
    const [purchases, setPurchases] = useState([]);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');

    useEffect(() => {
        loadPurchases();
    });

    async function handleRegister() {
        const data = {
            name,
            quantity,
            price,
        }

        try {
            const response = await api.post('/create', data)
            alert('Cadastro realizado')
            loadPurchases();
            
        } catch (error) {
            alert('Erro no cadastro. Tente novamente.')
        }
    }

    async function loadPurchases(){
        await api.get('find', { }).then(response => {
            setPurchases(response.data);
        })
    }

    async function updateInfo(){
        await api.post('update')

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
                    />
                    <label for="price">Preço da compra:</label>
                    <input
                        placeholder="R$"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
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
                        <th> </th>
                    </tr>
                    {purchases.map ( (purchase) => 
                        <tr>
                            <td>{ purchase.name }</td>
                            <td>{ purchase.quantity }</td>
                            <td>{ purchase.price }</td>
                            <td>{ purchase.date }</td>
                            <td>
                            <a onClick={() => updateInfo(purchase._id)}>
                                <FiEdit size={16} color="#E02041" />
                            </a>
                        </td>
                        </tr>
                    )}
         
                </table>
            </div>
        </div>
    );
}

export default Home;