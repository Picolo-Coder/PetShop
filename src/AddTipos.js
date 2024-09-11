import React, { useState } from 'react';
import axios from 'axios';

const AddTipos = () => {
    const [nomeTipo, setNomeTipo] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/tipos', {
                nome_tipo: nomeTipo,
            });
            alert(response.data.message);
            setNomeTipo('');
        } catch (error) {
            console.error('Erro ao adicionar tipo:', error);
            alert('Erro ao adicionar tipo.');
        }
    };

    return (
        <div>
            <h1>Adicionar Tipo</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Nome do Tipo:
                    <input
                        type="text"
                        value={nomeTipo}
                        onChange={(e) => setNomeTipo(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Adicionar</button>
            </form>
        </div>
    );
};

export default AddTipos;
