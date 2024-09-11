import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddBanhoTosa = () => {
    const [usuario_id, setUsuarioId] = useState('');
    const [tipo_servico, setTipoServico] = useState('');
    const [data_reserva, setDataReserva] = useState('');
    const [usuarios, setUsuarios] = useState([]);

    // Função para buscar os usuários do tipo "comum"
    const fetchUsuarios = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/usuarios?tipo_usuario=0');
            setUsuarios(response.data);
        } catch (error) {
            console.error('Erro ao buscar usuários:', error);
            alert('Erro ao buscar usuários. Tente novamente mais tarde.');
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verifique se os campos estão preenchidos
        if (!usuario_id || !tipo_servico || !data_reserva) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/banhotosa', {
                usuario_id,
                tipo_servico,
                data_reserva
            });
            alert('Reserva de banho/tosa adicionada com sucesso!');
            // Limpar os campos após o envio
            setUsuarioId('');
            setTipoServico('');
            setDataReserva('');
        } catch (error) {
            console.error('Erro ao adicionar reserva de banho/tosa:', error);
            alert('Erro ao adicionar reserva de banho/tosa. Verifique a URL do endpoint e o servidor.');
        }
    };

    return (
        <div>
            <h1>Adicionar Reserva de Banho/Tosa</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    ID do Usuário:
                    <select value={usuario_id} onChange={(e) => setUsuarioId(e.target.value)} required>
                        <option value="">Selecione um usuário</option>
                        {usuarios.length > 0 ? (
                            usuarios.map(usuario => (
                                <option key={usuario.id} value={usuario.id}>
                                    {usuario.nome} (ID: {usuario.id})
                                </option>
                            ))
                        ) : (
                            <option value="">Nenhum usuário disponível</option>
                        )}
                    </select>
                </label>
                <label>
                    Tipo de Serviço:
                    <select value={tipo_servico} onChange={(e) => setTipoServico(e.target.value)} required>
                        <option value="">Selecione</option>
                        <option value="banho">Banho</option>
                        <option value="tosa">Tosa</option>
                        <option value="banho_tosa">Banho e Tosa</option>
                    </select>
                </label>
                <label>
                    Data da Reserva:
                    <input
                        type="datetime-local"
                        value={data_reserva}
                        onChange={(e) => setDataReserva(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Adicionar</button>
            </form>
        </div>
    );
};

export default AddBanhoTosa;
