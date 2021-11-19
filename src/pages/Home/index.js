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

    async function loadPurchases(){
        await api.get('find', { }).then(response => {
            setPurchases(response.data);
        })
    }

    // async function updatePurchases(id){
    //     await api.post('update/id');
    // }



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
                        <tr key={purchase._id}>
                            <td>{ purchase.name }</td>
                            <td>{ purchase.quantity }</td>
                            <td>{ purchase.price }</td>
                            <td>{ purchase.date }</td>
                            <td>
                            {/* <a onClick={() => updateInfo(purchase._id)}>
                                <FiEdit size={16} color="#E02041" />
                            </a> */}
                        </td>
                        </tr>
                    )}
         
                </table>
            </div>

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