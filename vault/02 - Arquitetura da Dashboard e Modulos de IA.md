---
title: "02 - Arquitetura da Dashboard e Módulos de IA"
type: product-architecture
date: 2026-08-31
tags: [dashboard, saas, ai, naming, nanobanana, inpi]
---

# 💻 02 - Arquitetura da Dashboard do Parceiro e Módulos de IA

## 1. Visão Geral do Produto
A Dashboard não é apenas um painel de visualização de processos; ela é a **suíte comercial e operacional completa** que a equipe de vendas e o gestor da empresa parceira utilizam no dia a dia.

---

## 2. Módulos Centrais da Plataforma

### 🅰️ Módulo de Naming Inteligente com IA
- **Função:** Gerador de nomes comerciais com base em setor, público-alvo, sonoridade e disponibilidade preliminar no INPI.
- **Utilização:** O vendedor parceiro roda o gerador na frente do cliente indeciso para definir o nome e fechar a venda na hora.

### 🅱️ Módulo de Criação de Logomarcas (Integração Nanobanana)
- **Função:** Geração de identidades visuais de alta definição, elementos gráficos e símbolos estilizados compatíveis com registro de marcas figurativas e mistas.
- **Utilização:** Criação de logos para clientes que chegam sem identidade visual, aumentando o ticket médio do parceiro.

### 🅲️ Módulo MarcaShield (Diagnóstico de Viabilidade com IA)
- **Função:** Varredura em milissegundos na base de dados do INPI, cruzando classes de Nice (NCL) com análise fonética, visual, ideológica e de concorrência desleal.
- **Score:** Gera um índice de risco de 0 a 100% de probabilidade de deferimento.

### 🅳️ Sincronizador de Protocolos Instantâneo
- **Função:** Campo simples onde o parceiro digita o número do pedido (`9XXXXXXXX`) e a plataforma sincroniza automaticamente titular, procurador, classe, despacho e status do INPI via automação/API.

### 🅴️ Radar RPI Automático (Leitura Semanal da Revista do INPI)
- **Função:** Toda terça-feira, o backend baixa e processa o XML completo da Revista da Propriedade Industrial (RPI), identificando automaticamente colidências e publicações envolvendo os clientes cadastrados na carteira.

---

## 3. Fluxo de Trabalho Integrado

```
[ Cliente Chega sem Marca ]
            │
            ▼
[ 1. IA Naming ] ──► [ 2. Logo Nanobanana ] ──► [ 3. Consulta MarcaShield ]
                                                         │ (Score Seguro)
                                                         ▼
[ 4. Protocolo no INPI ] ◄── [ Cadastro do Número na Dashboard ]
            │
            ▼
[ 5. Radar Semanal RPI ] ──► [ 6. Alerta de Colidência / Oposição Automática ]
```
