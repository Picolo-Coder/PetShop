import mercadopago

# Função para gerar o link de pagamento
def gerar_link_pagamento(carrinho_itens):
    try:
        # Substitua pela sua Access Token do MercadoPago
        sdk = mercadopago.SDK("TEST-5178152324540576-112019-eadf7d503809737813aafdbcd15733e7-636957513")

        # Preparar os itens para o MercadoPago
        payment_items = []
        
        for item in carrinho_itens:
            # Criar um item para cada produto no carrinho
            payment_items.append({
                "id": str(item["id"]),  # id do produto (garanta que seja uma string)
                "title": item["title"],  # nome do produto
                "quantity": int(item["quantity"]),  # quantidade (garante que seja um inteiro)
                "currency_id": "BRL",  # moeda fixa
                "unit_price": float(item["unit_price"]),  # preço unitário (garanta que seja um float)
            })

        # Definir os dados de pagamento
        payment_data = {
            "items": payment_items,
            "back_urls": {
                "success": "http://localhost:3000/MeuPerfil",  # Substitua pelas URLs reais do seu frontend
                "failure": "http://localhost:3000/failure",
                "pending": "http://localhost:3000/pending"
            },
            "auto_return": "all"
        }

        # Criar a preferência de pagamento
        result = sdk.preference().create(payment_data)

        # Verificar o status da criação da preferência
        if result["status"] == 201:
            payment = result["response"]
            return payment["init_point"]  # Link gerado
        else:
            error_message = result.get("message", "Erro desconhecido ao criar a preferência de pagamento.")
            raise Exception(f"Erro ao criar a preferência de pagamento: {error_message}")

    except Exception as e:
        # Levanta exceções detalhadas em caso de falhas
        raise Exception(f"Erro ao gerar link de pagamento: {str(e)}")
