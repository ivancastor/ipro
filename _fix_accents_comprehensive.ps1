# Comprehensive Portuguese accent fix for all service pages
# Protects src/href attribute values (file paths) from being modified

$base = "c:\Users\crist\Desktop\projeto-ipro\ipro"
$skip = @("admin.html")
$files = Get-ChildItem "$base\*.html" | Where-Object { $skip -notcontains $_.Name }

$fixedCount = 0
foreach ($file in $files) {
    $path = $file.FullName
    $c = [System.IO.File]::ReadAllText($path)
    $orig = $c

    # ---- Step 1: Protect src/href attribute values ----
    $ml = [regex]::Matches($c, '(?i)(?:src|href)="[^"]*"')
    $pd = @{}   # token -> original value
    $seen = @{} # original value -> token (dedup)
    $pi = 0
    foreach ($m in $ml) {
        $v = $m.Value
        if (-not $seen.ContainsKey($v)) {
            $k = "XPROT${pi}X"
            $pd[$k] = $v
            $seen[$v] = $k
            $pi++
        }
    }
    foreach ($k in $pd.Keys) {
        $c = $c.Replace($pd[$k], $k)
    }

    # ---- Step 2: Replacements ----

    # === -CAO / -COES words (singular & plural) ===
    $c = $c.Replace("substituicoes", "substituicoes-DONE")  # placeholder to avoid double-fix
    $c = $c.Replace("substituicoes-DONE", "substituições")
    $c = $c.Replace("Substituicoes", "Substituições")
    $c = $c.Replace("substituicao", "substituição")
    $c = $c.Replace("Substituicao", "Substituição")

    $c = $c.Replace("reinstalacao", "reinstalação")
    $c = $c.Replace("Reinstalacao", "Reinstalação")
    $c = $c.Replace("reinicializacao", "reinicialização")

    $c = $c.Replace("atualizacoes", "atualizações")
    $c = $c.Replace("Atualizacoes", "Atualizações")
    $c = $c.Replace("atualizacao", "atualização")
    $c = $c.Replace("Atualizacao", "Atualização")

    $c = $c.Replace("configuracoes", "configurações")
    $c = $c.Replace("configuracao", "configuração")

    $c = $c.Replace("instalacoes", "instalações")
    $c = $c.Replace("instalacao", "instalação")
    $c = $c.Replace("Instalacao", "Instalação")

    $c = $c.Replace("comunicacoes", "comunicações")
    $c = $c.Replace("comunicacao", "comunicação")
    $c = $c.Replace("Comunicacao", "Comunicação")

    $c = $c.Replace("informacoes", "informações")
    $c = $c.Replace("Informacoes", "Informações")
    $c = $c.Replace("informacao", "informação")
    $c = $c.Replace("Informacao", "Informação")

    $c = $c.Replace("notificacoes", "notificações")
    $c = $c.Replace("notificacao", "notificação")

    $c = $c.Replace("localizacao", "localização")
    $c = $c.Replace("sincronizacao", "sincronização")
    $c = $c.Replace("verificacao", "verificação")
    $c = $c.Replace("especializacao", "especialização")
    $c = $c.Replace("integracao", "integração")
    $c = $c.Replace("realizacao", "realização")
    $c = $c.Replace("otimizacao", "otimização")

    $c = $c.Replace("operacoes", "operações")
    $c = $c.Replace("operacao", "operação")

    $c = $c.Replace("aplicacoes", "aplicações")
    $c = $c.Replace("aplicacao", "aplicação")

    $c = $c.Replace("gravacoes", "gravações")
    $c = $c.Replace("gravacao", "gravação")

    $c = $c.Replace("recuperacao", "recuperação")
    $c = $c.Replace("Recuperacao", "Recuperação")

    $c = $c.Replace("migracoes", "migrações")
    $c = $c.Replace("migracao", "migração")
    $c = $c.Replace("Migracao", "Migração")

    $c = $c.Replace("corrupcao", "corrupção")
    $c = $c.Replace("producao", "produção")
    $c = $c.Replace("intervencao", "intervenção")

    $c = $c.Replace("aprovacoes", "aprovações")
    $c = $c.Replace("aprovacao", "aprovação")
    $c = $c.Replace("Aprovacao", "Aprovação")

    $c = $c.Replace("precisao", "precisão")
    $c = $c.Replace("Precisao", "Precisão")

    $c = $c.Replace("solucoes", "soluções")
    $c = $c.Replace("solucao", "solução")
    $c = $c.Replace("Solucao", "Solução")

    $c = $c.Replace("versao", "versão")
    $c = $c.Replace("Versao", "Versão")

    $c = $c.Replace("decisao", "decisão")
    $c = $c.Replace("atencao", "atenção")
    $c = $c.Replace("Atencao", "Atenção")

    $c = $c.Replace("condicoes", "condições")
    $c = $c.Replace("CONDICOES", "CONDIÇÕES")
    $c = $c.Replace("condicao", "condição")

    $c = $c.Replace("opcoes", "opções")
    $c = $c.Replace("formatacao", "formatação")

    $c = $c.Replace("prestacao", "prestação")
    $c = $c.Replace("Prestacao", "Prestação")

    $c = $c.Replace("manutencao", "manutenção")
    $c = $c.Replace("Manutencao", "Manutenção")

    $c = $c.Replace("EXECUCAO", "EXECUÇÃO")
    $c = $c.Replace("execucao", "execução")
    $c = $c.Replace("Execucao", "Execução")

    $c = $c.Replace("protecao", "proteção")
    $c = $c.Replace("reducao", "redução")
    $c = $c.Replace("prevencao", "prevenção")
    $c = $c.Replace("degradacao", "degradação")

    $c = $c.Replace("conexao", "conexão")
    $c = $c.Replace("Conexao", "Conexão")

    $c = $c.Replace("liberacao", "liberação")

    $c = $c.Replace("instituicoes", "instituições")
    $c = $c.Replace("instituicao", "instituição")
    $c = $c.Replace("Instituicao", "Instituição")

    $c = $c.Replace("exibicao", "exibição")
    $c = $c.Replace("oxidacao", "oxidação")

    $c = $c.Replace("relacao", "relação")
    $c = $c.Replace("relacoes", "relações")
    $c = $c.Replace("Relacao", "Relação")

    $c = $c.Replace("conclusao", "conclusão")
    $c = $c.Replace("avaliacao", "avaliação")
    $c = $c.Replace("identificacao", "identificação")

    $c = $c.Replace("funcoes", "funções")
    $c = $c.Replace("Funcoes", "Funções")
    $c = $c.Replace("funcao", "função")
    $c = $c.Replace("Funcao", "Função")

    $c = $c.Replace("gestoes", "gestões")
    $c = $c.Replace("gestao", "gestão")

    $c = $c.Replace("distorcoes", "distorções")
    $c = $c.Replace("distorcao", "distorção")
    $c = $c.Replace("Distorcao", "Distorção")

    $c = $c.Replace("situacoes", "situações")
    $c = $c.Replace("situacao", "situação")

    $c = $c.Replace("lentidao", "lentidão")
    $c = $c.Replace("Lentidao", "Lentidão")

    $c = $c.Replace("botoes", "botões")
    $c = $c.Replace("Botoes", "Botões")
    $c = $c.Replace("botao", "botão")
    $c = $c.Replace("Botao", "Botão")

    $c = $c.Replace("restricoes", "restrições")
    $c = $c.Replace("restricao", "restrição")

    $c = $c.Replace("pressao", "pressão")
    $c = $c.Replace("Pressao", "Pressão")

    $c = $c.Replace("limitacoes", "limitações")
    $c = $c.Replace("LIMITACAO", "LIMITAÇÃO")
    $c = $c.Replace("limitacao", "limitação")

    $c = $c.Replace("EXCLUSOES", "EXCLUSÕES")
    $c = $c.Replace("exclusoes", "exclusões")
    $c = $c.Replace("exclusao", "exclusão")

    $c = $c.Replace("atuacao", "atuação")
    $c = $c.Replace("obrigacao", "obrigação")

    # === Section headers (UPPERCASE) ===
    $c = $c.Replace("LIMITACAO", "LIMITAÇÃO")
    $c = $c.Replace("EXCLUSOES", "EXCLUSÕES")
    $c = $c.Replace("DIAGNOSTICO", "DIAGNÓSTICO")
    $c = $c.Replace("EXECUCAO", "EXECUÇÃO")
    $c = $c.Replace("CONDICOES", "CONDIÇÕES")
    $c = $c.Replace("SERVICO", "SERVIÇO")
    $c = $c.Replace("TECNICO", "TÉCNICO")
    $c = $c.Replace(" NAO ", " NÃO ")
    $c = $c.Replace(">NAO ", ">NÃO ")
    $c = $c.Replace("PRE-EXISTENTES", "PRÉ-EXISTENTES")

    # === Nouns ===
    $c = $c.Replace("seguranca", "segurança")
    $c = $c.Replace("Seguranca", "Segurança")

    $c = $c.Replace(" audio", " áudio")
    $c = $c.Replace(">audio", ">áudio")
    $c = $c.Replace(" Audio", " Áudio")
    $c = $c.Replace(">Audio", ">Áudio")
    $c = $c.Replace('"audio"', '"áudio"')
    $c = $c.Replace('"Audio"', '"Áudio"')

    $c = $c.Replace("relogio", "relógio")
    $c = $c.Replace("Relogio", "Relógio")

    $c = $c.Replace("musicas", "músicas")
    $c = $c.Replace("musica", "música")
    $c = $c.Replace("Musica", "Música")

    $c = $c.Replace("cameras", "câmeras")
    $c = $c.Replace("camera", "câmera")
    $c = $c.Replace("Cameras", "Câmeras")
    $c = $c.Replace("Camera", "Câmera")

    $c = $c.Replace("pecas", "peças")
    $c = $c.Replace("Pecas", "Peças")
    $c = $c.Replace("peca", "peça")
    $c = $c.Replace("Peca", "Peça")

    $c = $c.Replace("acessorios", "acessórios")
    $c = $c.Replace("acessorio", "acessório")
    $c = $c.Replace("Acessorios", "Acessórios")

    $c = $c.Replace("usuarios", "usuários")
    $c = $c.Replace("usuario", "usuário")
    $c = $c.Replace("Usuarios", "Usuários")
    $c = $c.Replace("Usuario", "Usuário")

    $c = $c.Replace("conteudo", "conteúdo")
    $c = $c.Replace("Conteudo", "Conteúdo")

    $c = $c.Replace("principios", "princípios")
    $c = $c.Replace("Principios", "Princípios")

    $c = $c.Replace("Codigo", "Código")
    $c = $c.Replace("codigo", "código")

    $c = $c.Replace("analises", "análises")
    $c = $c.Replace("analise", "análise")
    $c = $c.Replace("Analise", "Análise")

    $c = $c.Replace("ausencia", "ausência")
    $c = $c.Replace("Ausencia", "Ausência")

    $c = $c.Replace("orcamento", "orçamento")
    $c = $c.Replace("Orcamento", "Orçamento")

    $c = $c.Replace("maquina", "máquina")
    $c = $c.Replace("Maquina", "Máquina")

    $c = $c.Replace("escritorio", "escritório")
    $c = $c.Replace("diagnosticos", "diagnósticos")
    $c = $c.Replace("diagnostico", "diagnóstico")
    $c = $c.Replace("Diagnostico", "Diagnóstico")

    $c = $c.Replace("servicos", "serviços")
    $c = $c.Replace("Servicos", "Serviços")
    $c = $c.Replace("servico", "serviço")
    $c = $c.Replace("Servico", "Serviço")

    $c = $c.Replace("assistencias", "assistências")
    $c = $c.Replace("assistencia", "assistência")
    $c = $c.Replace("Assistencia", "Assistência")

    $c = $c.Replace("memorias", "memórias")
    $c = $c.Replace("memoria", "memória")
    $c = $c.Replace("Memoria", "Memória")

    # === Past Participles ===
    $c = $c.Replace("substituidas", "substituídas")
    $c = $c.Replace("substituida", "substituída")
    $c = $c.Replace("substituidos", "substituídos")
    $c = $c.Replace("substituido", "substituído")

    # === Adjectives (all variants) ===
    $c = $c.Replace("tecnicos", "técnicos")
    $c = $c.Replace("Tecnicos", "Técnicos")
    $c = $c.Replace("tecnica", "técnica")
    $c = $c.Replace("tecnico", "técnico")
    $c = $c.Replace("Tecnica", "Técnica")
    $c = $c.Replace("Tecnico", "Técnico")

    $c = $c.Replace("fisicas", "físicas")
    $c = $c.Replace("fisicos", "físicos")
    $c = $c.Replace("fisica", "física")
    $c = $c.Replace("fisico", "físico")
    $c = $c.Replace("Fisica", "Física")
    $c = $c.Replace("Fisico", "Físico")

    $c = $c.Replace("eletronicas", "eletrônicas")
    $c = $c.Replace("eletronicos", "eletrônicos")
    $c = $c.Replace("eletronica", "eletrônica")
    $c = $c.Replace("eletronico", "eletrônico")
    $c = $c.Replace("Eletronicas", "Eletrônicas")
    $c = $c.Replace("Eletronicos", "Eletrônicos")
    $c = $c.Replace("Eletronica", "Eletrônica")
    $c = $c.Replace("Eletronico", "Eletrônico")

    $c = $c.Replace("eletricas", "elétricas")
    $c = $c.Replace("eletricos", "elétricos")
    $c = $c.Replace("eletrica", "elétrica")
    $c = $c.Replace("eletrico", "elétrico")
    $c = $c.Replace("Eletrica", "Elétrica")
    $c = $c.Replace("Eletrico", "Elétrico")

    $c = $c.Replace("tipicas", "típicas")
    $c = $c.Replace("tipicos", "típicos")
    $c = $c.Replace("tipica", "típica")
    $c = $c.Replace("tipico", "típico")
    $c = $c.Replace("Tipicos", "Típicos")
    $c = $c.Replace("Tipico", "Típico")

    $c = $c.Replace("otimas", "ótimas")
    $c = $c.Replace("otimos", "ótimos")
    $c = $c.Replace("otima", "ótima")
    $c = $c.Replace("otimo", "ótimo")
    $c = $c.Replace("Otima", "Ótima")
    $c = $c.Replace("Otimo", "Ótimo")

    $c = $c.Replace("praticas", "práticas")
    $c = $c.Replace("praticos", "práticos")
    $c = $c.Replace("pratica", "prática")
    $c = $c.Replace("pratico", "prático")
    $c = $c.Replace("Pratica", "Prática")
    $c = $c.Replace("Pratico", "Prático")

    $c = $c.Replace("especificas", "específicas")
    $c = $c.Replace("especificos", "específicos")
    $c = $c.Replace("especifica", "específica")
    $c = $c.Replace("especifico", "específico")
    $c = $c.Replace("Especifico", "Específico")

    $c = $c.Replace("historicas", "históricas")
    $c = $c.Replace("historicos", "históricos")
    $c = $c.Replace("historica", "histórica")
    $c = $c.Replace("historico", "histórico")
    $c = $c.Replace("Historico", "Histórico")

    $c = $c.Replace("criticas", "críticas")
    $c = $c.Replace("criticos", "críticos")
    $c = $c.Replace("critica", "crítica")
    $c = $c.Replace("critico", "crítico")
    $c = $c.Replace("Critico", "Crítico")
    $c = $c.Replace("Critica", "Crítica")

    $c = $c.Replace("basicas", "básicas")
    $c = $c.Replace("basicos", "básicos")
    $c = $c.Replace("basica", "básica")
    $c = $c.Replace("basico", "básico")
    $c = $c.Replace("Basico", "Básico")

    $c = $c.Replace("proximas", "próximas")
    $c = $c.Replace("proximos", "próximos")
    $c = $c.Replace("proxima", "próxima")
    $c = $c.Replace("proximo", "próximo")
    $c = $c.Replace("Proxima", "Próxima")
    $c = $c.Replace("Proximo", "Próximo")

    $c = $c.Replace("automaticas", "automáticas")
    $c = $c.Replace("automaticos", "automáticos")
    $c = $c.Replace("automatica", "automática")
    $c = $c.Replace("automatico", "automático")
    $c = $c.Replace("Automatico", "Automático")

    $c = $c.Replace("logicas", "lógicas")
    $c = $c.Replace("logicos", "lógicos")
    $c = $c.Replace("logica", "lógica")
    $c = $c.Replace("logico", "lógico")

    $c = $c.Replace("possiveis", "possíveis")
    $c = $c.Replace("possivel", "possível")
    $c = $c.Replace("Possivel", "Possível")

    $c = $c.Replace("disponiveis", "disponíveis")
    $c = $c.Replace("disponivel", "disponível")
    $c = $c.Replace("Disponivel", "Disponível")

    $c = $c.Replace("portateis", "portáteis")
    $c = $c.Replace("portatil", "portátil")
    $c = $c.Replace("Portateis", "Portáteis")

    $c = $c.Replace("indispensavel", "indispensável")
    $c = $c.Replace("compativel", "compatível")
    $c = $c.Replace("Compativel", "Compatível")
    $c = $c.Replace("instavel", "instável")

    $c = $c.Replace("dificeis", "difíceis")
    $c = $c.Replace("dificil", "difícil")
    $c = $c.Replace("facil", "fácil")
    $c = $c.Replace("Facil", "Fácil")

    $c = $c.Replace("necessarias", "necessárias")
    $c = $c.Replace("necessarios", "necessários")
    $c = $c.Replace("necessaria", "necessária")
    $c = $c.Replace("necessario", "necessário")
    $c = $c.Replace("Necessario", "Necessário")

    # === "único/a" — use regex to avoid matching inside "comunicacao" ===
    $c = [regex]::Replace($c, '\bunicas\b', 'únicas')
    $c = [regex]::Replace($c, '\bunica\b', 'única')
    $c = [regex]::Replace($c, '\bunicos\b', 'únicos')
    $c = [regex]::Replace($c, '\bunico\b', 'único')
    $c = [regex]::Replace($c, '\bUnica\b', 'Única')
    $c = [regex]::Replace($c, '\bUnico\b', 'Único')
    $c = [regex]::Replace($c, '\bUnicos\b', 'Únicos')

    # === Adverbs & Prepositions ===
    $c = $c.Replace("atraves", "através")
    $c = $c.Replace("Atraves", "Através")
    $c = $c.Replace("apos", "após")
    $c = $c.Replace("Apos", "Após")

    $c = [regex]::Replace($c, '\bate\b', 'até')
    $c = [regex]::Replace($c, '\bAte\b', 'Até')

    $c = $c.Replace("rapidos", "rápidos")
    $c = $c.Replace("rapido", "rápido")
    $c = $c.Replace("rapida", "rápida")
    $c = $c.Replace("Rapido", "Rápido")

    $c = $c.Replace("previo", "prévio")
    $c = $c.Replace("previa", "prévia")
    $c = $c.Replace("Previo", "Prévio")

    $c = $c.Replace("a vista", "à vista")
    $c = $c.Replace("debito", "débito")
    $c = $c.Replace("Debito", "Débito")
    $c = $c.Replace("credito", "crédito")
    $c = $c.Replace("Credito", "Crédito")

    $c = $c.Replace("Cartao", "Cartão")
    $c = $c.Replace("cartao", "cartão")

    # === Pronouns & Verbs ===
    $c = $c.Replace("voce", "você")
    $c = $c.Replace("Voce", "Você")
    $c = $c.Replace("voces", "vocês")

    $c = $c.Replace(" nao ", " não ")
    $c = $c.Replace(" Nao ", " Não ")
    $c = $c.Replace(">Nao ", ">Não ")
    $c = $c.Replace(">nao ", ">não ")
    $c = $c.Replace("Nao.", "Não.")
    $c = $c.Replace("nao.", "não.")
    $c = $c.Replace("Nao,", "Não,")
    $c = $c.Replace("nao,", "não,")
    $c = $c.Replace("Nao<", "Não<")
    $c = $c.Replace("nao<", "não<")

    $c = $c.Replace(" estao ", " estão ")
    $c = $c.Replace(">estao<", ">estão<")
    $c = $c.Replace("Estao ", "Estão ")
    $c = $c.Replace("estao.", "estão.")
    $c = $c.Replace("estao,", "estão,")

    $c = $c.Replace(" sao ", " são ")
    $c = $c.Replace(">sao<", ">são<")
    $c = $c.Replace("Sao ", "São ")
    $c = $c.Replace("sao.", "são.")
    $c = $c.Replace("sao,", "são,")

    $c = $c.Replace("poderao", "poderão")
    $c = $c.Replace("Poderao", "Poderão")
    $c = $c.Replace("podera", "poderá")
    $c = $c.Replace("Podera", "Poderá")

    $c = $c.Replace(" esta com", " está com")
    $c = $c.Replace("Faca", "Faça")
    $c = $c.Replace("faca", "faça")

    # === Contextual phrases (é / É) ===
    $c = $c.Replace(" e essencial", " é essencial")
    $c = $c.Replace(" e etapa", " é etapa")
    $c = $c.Replace(" e a etapa", " é a etapa")
    $c = $c.Replace(" e hora", " é hora")
    $c = $c.Replace(" e fundamental", " é fundamental")
    $c = $c.Replace(" e a maquina", " é a máquina")
    $c = $c.Replace(" e a mÃ¡quina", " é a máquina")
    $c = $c.Replace("E responsabilidade", "É responsabilidade")
    $c = $c.Replace(" e possivel", " é possível")
    $c = $c.Replace(" e necessario", " é necessário")
    $c = $c.Replace(" e importante", " é importante")
    $c = $c.Replace(" e o principal", " é o principal")
    $c = $c.Replace(" e utilizado", " é utilizado")
    $c = $c.Replace(" e feito", " é feito")
    $c = $c.Replace(" e realizado", " é realizado")
    $c = $c.Replace(" e indicado", " é indicado")

    $c = $c.Replace("sao sinais", "são sinais")
    $c = $c.Replace("sao realizados", "são realizados")
    $c = $c.Replace("sao essenciais", "são essenciais")

    # === Upgrade typo fix ===
    $c = $c.Replace("upgade", "upgrade")

    # ---- Step 3: Restore protected values ----
    foreach ($k in $pd.Keys) {
        $c = $c.Replace($k, $pd[$k])
    }

    if ($c -ne $orig) {
        [System.IO.File]::WriteAllText($path, $c, [System.Text.Encoding]::UTF8)
        $fixedCount++
        Write-Output "Fixed: $($file.Name)"
    }
}

Write-Output ""
Write-Output "Done. Files modified: $fixedCount"
