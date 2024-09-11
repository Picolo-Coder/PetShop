import React, { useState } from 'react';
import axios from 'axios';

const AddDoacoes = () => {
    const [nome_animal, setNomeAnimal] = useState('');
    const [idade, setIdade] = useState('');
    const [porte, setPorte] = useState('');
    const [sexo, setSexo] = useState('');
    const [descricao, setDescricao] = useState('');
    const [castrado, setCastrado] = useState(false);
    const [motivo_doacao, setMotivoDoacao] = useState('');
    const [imagem, setImagem] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!nome_animal || !idade || !porte || !sexo || !motivo_doacao) {
            setError('Todos os campos obrigatórios devem ser preenchidos.');
            return;
        }

        const formData = new FormData();
        formData.append('nome_animal', nome_animal);
        formData.append('idade', idade);
        formData.append('porte', porte);
        formData.append('sexo', sexo);
        formData.append('descricao', descricao);
        formData.append('castrado', castrado ? '1' : '0');
        formData.append('motivo_doacao', motivo_doacao);

        if (imagem) {
            formData.append('imagem', imagem);
        }

        try {
            const response = await axios.post('http://localhost:5000/api/doacoes', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert('Adoção/Doação adicionada com sucesso!');
            setNomeAnimal('');
            setIdade('');
            setPorte('');
            setSexo('');
            setDescricao('');
            setCastrado(false);
            setMotivoDoacao('');
            setImagem(null);
            setError('');
        } catch (error) {
            console.error('Erro ao adicionar adoção/doação:', error);
            if (error.response && error.response.data) {
                setError(error.response.data);
            } else {
                setError('Erro ao adicionar adoção/doação. Verifique o console para detalhes.');
            }
        }
    };

    return (
        <div>
            <h1>Adicionar Adoção/Doação</h1>
            <form onSubmit={handleSubmit}>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <label>
                    Nome do Animal:
                    <input
                        type="text"
                        value={nome_animal}
                        onChange={(e) => setNomeAnimal(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Idade:
                    <input
                        type="number"
                        value={idade}
                        onChange={(e) => setIdade(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Porte:
                    <select
                        value={porte}
                        onChange={(e) => setPorte(e.target.value)}
                        required
                    >
                        <option value="">Selecione</option>
                        <option value="pequeno">Pequeno</option>
                        <option value="medio">Médio</option>
                        <option value="grande">Grande</option>
                    </select>
                </label>
                <label>
                    Sexo:
                    <select
                        value={sexo}
                        onChange={(e) => setSexo(e.target.value)}
                        required
                    >
                        <option value="">Selecione</option>
                        <option value="macho">Macho</option>
                        <option value="femea">Fêmea</option>
                    </select>
                </label>
                <label>
                    Descrição:
                    <textarea
                        value={descricao}
                        onChange={(e) => setDescricao(e.target.value)}
                    />
                </label>
                <label>
                    Castrado:
                    <input
                        type="checkbox"
                        checked={castrado}
                        onChange={(e) => setCastrado(e.target.checked)}
                    />
                </label>
                <label>
                    Motivo da Doação:
                    <textarea
                        value={motivo_doacao}
                        onChange={(e) => setMotivoDoacao(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Imagem:
                    <input
                        type="file"
                        onChange={(e) => setImagem(e.target.files[0])}
                    />
                </label>
                <button type="submit">Adicionar</button>
            </form>
        </div>
    );
};

export default AddDoacoes;
