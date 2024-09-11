import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddProdutos = () => {
    const [tipos, setTipos] = useState([]);
    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState('');
    const [descricao, setDescricao] = useState('');
    const [volume, setVolume] = useState('');
    const [imagem, setImagem] = useState(null);
    const [tipoId, setTipoId] = useState('');

    useEffect(() => {
        const fetchTipos = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/tipos');
                console.log("Tipos recebidos:", response.data);  // Verificar se os dados estão chegando
                setTipos(response.data);
            } catch (error) {
                console.error('Erro ao buscar tipos:', error);
            }
        };

        fetchTipos();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('nome', nome);
        formData.append('preco', preco);
        formData.append('descricao', descricao);
        formData.append('volume', volume);
        formData.append('imagem', imagem);
        formData.append('tipo_id', tipoId);

        try {
            await axios.post('http://localhost:5000/api/produtos', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Produto adicionado com sucesso!');
        } catch (error) {
            console.error('Erro ao adicionar produto:', error);
        }
    };

    return (
        <div>
            <h1>Adicionar Produto</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Nome:
                    <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required />
                </label>
                <label>
                    Preço:
                    <input type="number" value={preco} onChange={(e) => setPreco(e.target.value)} required />
                </label>
                <label>
                    Descrição:
                    <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} />
                </label>
                <label>
                    Volume (opcional):
                    <input type="text" value={volume} onChange={(e) => setVolume(e.target.value)} />
                </label>
                <label>
                    Imagem:
                    <input type="file" onChange={(e) => setImagem(e.target.files[0])} />
                </label>
                <label>
                    Tipo:
                    <select value={tipoId} onChange={(e) => setTipoId(e.target.value)} required>
                        <option value="">Selecione um tipo</option>
                        {tipos.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>
                                {tipo.nome}
                            </option>
                        ))}
                    </select>
                </label>
                <button type="submit">Adicionar Produto</button>
            </form>
        </div>
    );
};

export default AddProdutos;
