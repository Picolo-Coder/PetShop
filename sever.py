from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
import requests  # Para fazer requisições HTTP para a API do Mercado Pago
from apiMercadoPago import gerar_link_pagamento  # Importa a função para gerar o link

app = Flask(__name__)

# Habilita CORS para permitir requisições do frontend
CORS(app, origins=["http://localhost:3000"])

# Diretório onde as imagens estão armazenadas
IMAGES_DIRECTORY = "path/to/your/images"  # Substitua com o caminho correto das suas imagens

# Endpoint para servir as imagens
@app.route('/produtos/<int:produto_id>/imagem')
def serve_imagem(produto_id):
    try:
        # Defina o nome da imagem com base no ID do produto
        imagem_nome = f"{produto_id}.jpg"  # Ou qualquer outro formato de imagem que você use

        # Verifique se o arquivo existe
        if not os.path.exists(os.path.join(IMAGES_DIRECTORY, imagem_nome)):
            return jsonify({"error": "Imagem não encontrada"}), 404

        # Retorna a imagem estática
        return send_from_directory(IMAGES_DIRECTORY, imagem_nome)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Endpoint para gerar link de pagamento
@app.route('/gerar_link_pagamento', methods=['POST'])
def gerar_link_pagamento_api():
    try:
        # Recebe os dados do frontend (carrinho de compras)
        payment_items = request.json.get('items')

        # Valida se os itens foram recebidos corretamente
        if not payment_items or not isinstance(payment_items, list):
            return jsonify({"error": "Dados inválidos ou carrinho vazio"}), 400

        # Chama a função para gerar o link no módulo de MercadoPago
        link_iniciar_pagamento = gerar_link_pagamento(payment_items)

        # Retorna o link gerado para o frontend
        return jsonify({"link": link_iniciar_pagamento}), 200

    except Exception as e:
        # Em caso de erro, retorna a mensagem para o frontend
        return jsonify({"error": str(e)}), 500


# Novo Endpoint para obter detalhes do pagamento
@app.route('/obter_detalhes_pagamento', methods=['GET'])
def obter_detalhes_pagamento():
    payment_id = request.args.get('payment_id')  # Obtém o payment_id da query string

    if not payment_id:
        return jsonify({"error": "payment_id é necessário"}), 400

    try:
        # Defina o token de acesso do Mercado Pago
        access_token = 'TEST-5178152324540576-112019-eadf7d503809737813aafdbcd15733e7-636957513'

        # Faz uma requisição à API do Mercado Pago para obter os detalhes do pagamento
        url = f'https://api.mercadopago.com/v1/payments/{payment_id}'
        headers = {
            'Authorization': f'Bearer {access_token}'
        }

        # Realiza a solicitação GET à API do Mercado Pago
        response = requests.get(url, headers=headers)

        # Verifica se a resposta foi bem-sucedida
        if response.status_code == 200:
            payment_details = response.json()

            # Extraindo detalhes dos itens comprados
            items_comprados = payment_details.get('additional_info', {}).get('items', [])
            parcelas = payment_details.get('payer', {}).get('payment_method_id', 'não especificado')

            # Se for pagamento com cartão de crédito, as parcelas estarão no campo "installments"
            num_parcelas = payment_details.get('installments', 1)  # Default para 1 se não houver parcelas

            # Método de pagamento
            metodo_pagamento = payment_details.get('payment_method_id', 'Não especificado')

            # Mapeando para um formato legível
            detalhes = []
            for item in items_comprados:
                detalhes.append({
                    "nome_produto": item.get('title', 'Produto não encontrado'),  # Usando 'title' para nome do produto
                    "produto_id": item.get('id', 'ID não encontrado'),  # Acessa o ID do produto se estiver disponível
                    "quantidade": item.get('quantity', 1),
                    "preco": item.get('unit_price', 0)
                })

            # Retornando as informações extras como o nome do produto, a quantidade de parcelas, e o método de pagamento
            return jsonify({
                "status": payment_details.get('status'),
                "payment_id": payment_details.get('id'),
                "installments": num_parcelas,
                "itens_comprados": detalhes,
                "metodo_pagamento": metodo_pagamento  # Aqui estamos incluindo o método de pagamento
            }), 200
        else:
            return jsonify({"error": "Não foi possível obter os detalhes do pagamento", "details": response.json()}), 500

    except requests.exceptions.RequestException as e:
        # Em caso de erro ao fazer a requisição
        return jsonify({"error": "Erro ao fazer a requisição à API do Mercado Pago", "details": str(e)}), 500
    except Exception as e:
        # Em caso de erro genérico
        return jsonify({"error": "Erro inesperado no servidor", "details": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
