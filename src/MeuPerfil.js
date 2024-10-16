import React, { useState, useEffect } from 'react';

const MeuPerfil = () => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [usuario, setUsuario] = useState({});

    useEffect(() => {
        // Recupera os dados do usuário do localStorage
        const usuarioNome = localStorage.getItem('usuarioNome');
        const usuarioEmail = localStorage.getItem('usuarioEmail');
        const usuarioIdade = localStorage.getItem('usuarioIdade'); // Supondo que você armazene a idade também
        const usuarioTelefone = localStorage.getItem('usuarioTelefone'); // Supondo que você armazene o telefone também
        const usuarioEndereco = localStorage.getItem('usuarioEndereco'); // Supondo que você armazene o endereço também
        const usuarioCpf = localStorage.getItem('usuarioCpf'); // Recupera o CPF
        const usuarioDataCriacao = localStorage.getItem('usuarioDataCriacao'); // Recupera a data de criação

        // Formata a data de criação
        const formattedDate = formatDate(usuarioDataCriacao);

        // Define os dados do usuário no estado
        setUsuario({
            nome: usuarioNome,
            email: usuarioEmail,
            idade: usuarioIdade,
            telefone: usuarioTelefone,
            endereco: usuarioEndereco,
            cpf: usuarioCpf, // Adiciona o CPF
            data_criacao: formattedDate, // Adiciona a data de criação formatada
        });
    }, []); // O array vazio [] faz com que o useEffect rode apenas uma vez ao montar o componente

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa do 0
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}/${month}/${day}`; // Formato "Ano/Mês/Dia"
    };

    const toggleMenu = (event) => {
        event.stopPropagation(); // Evita o fechamento do menu ao clicar nele
        setDropdownVisible(!dropdownVisible);
    };

    const editProfile = () => {
        alert("Função de edição ainda não implementada!"); // Placeholder para função de edição
        setDropdownVisible(false); // Fecha o menu após a seleção
    };

    const logout = () => {
        localStorage.clear(); // Limpa o localStorage
        window.location.href = '/'; // Redireciona para a página de login
    };

    // Fecha o menu se clicar fora
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!event.target.matches('.dots')) {
                setDropdownVisible(false);
            }
        };
        window.addEventListener('click', handleClickOutside);
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, []);

    return (
        <div className="profile-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="menu">
                        <div className="dots" onClick={toggleMenu}>&#8230;</div>
                        {dropdownVisible && (
                            <div className="dropdown" id="dropdown-menu">
                                <button className="dropdown-item" onClick={editProfile}>Editar</button>
                                <button className="dropdown-item" onClick={logout}>Sair</button> {/* Adiciona a função de logout */}
                            </div>
                        )}
                    </div>
                    <div className="profile-image-container">
                        <img src="https://via.placeholder.com/150" alt="Foto de perfil" className="profile-image" />
                    </div>
                    <div className="profile-info">
                        <h2>{usuario.nome}</h2>
                        <p><strong>E-mail:</strong> {usuario.email}</p>
                        <p><strong>Telefone:</strong> {usuario.telefone}</p>
                        <p><strong>CPF:</strong> {usuario.cpf}</p>
                        <p><strong>Desde:</strong> {usuario.data_criacao} no site</p> {/* Exibe a data de criação formatada */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MeuPerfil;
