Prbi::App.controllers :dashboard do

  get :bi_dashboard do
    soma_feedbacks = 0
    cont = 0
    feedback = Voto.where(:por_corretor => true, :feedback_nota.exists => true, :updated_at.gte => params[:data_inicio], :updated_at.lte => params[:data_fim])
    feedback.each do |f|
      if f.feedback_nota != nil
        soma_feedbacks += f.feedback_nota
        cont += 1
      end
    end
    if cont != 0
      @media_feedbacks = (soma_feedbacks/cont).round(2)
    else
      @media_feedbacks = 0
    end

    cont= 0
    soma_tempo = 0
    correcao = Texto.where(:avaliado => true, :status_correcao => 'Profissional - Corrigida', :created_at.gte => params[:data_inicio], :created_at.lte => params[:data_fim] )
    correcao.each do |c|
      # redações corrigidas que não tiveram a data de correção alteradas
      if c.data_fim_correcao.year != 1999
        tempo_correcao = c.data_fim_correcao.to_i - c.created_at.to_i
        soma_tempo += tempo_correcao
        cont+= 1
      end
    end
    if cont != 0
      media_tempo_correcao = soma_tempo/cont
      @media_tempo_correcao_dias = (media_tempo_correcao/86400.00).round(2)
    end

    alunos = Aluno.where( :created_at.gte => params[:data_inicio], :created_at.lte => params[:data_fim])
    @cadastros = alunos.length

    alunos_ano = Aluno.where(:created_at.lte => params[:data_fim])
    @cadastros_acumulados = alunos_ano.length


    redacao = Texto.where( :created_at.gte => params[:data_inicio], :created_at.lte => params[:data_fim])
    @red_enviadas = redacao.length

    cont = 0
    usuario_pag = 0
    id =[]
    comentarios = Voto.where( :created_at.gte => params[:data_inicio], :created_at.lte => params[:data_fim])
    comentarios.each do |com|
      aluno = Aluno.where(:_id => com.aluno_id, :role => 'user')
      aluno.each do |aluno|
        if !id.include? (aluno.id)
          id << aluno.id
          cont += 1
          if aluno.data_expira_plano > DateTime.now and aluno.plano
            usuario_pag +=1
          end
        end
      end
    end

    red = 0
    textos = Texto.where( :created_at.gte => params[:data_inicio], :created_at.lte => params[:data_fim])
    textos.each do |t|
      if !id.include? (t.aluno_id)
        id << t.aluno_id
        red += 1
        if t.aluno.data_expira_plano > DateTime.now and t.aluno.plano
          usuario_pag +=1
        end
      end
    end

    @usuarios_ativos =  cont
    @usuarios_ativos_pagantes = 0

    valor_pm = 0
    valor_ps = 0
    custo_pm = 0
    custo_pg = 0
    t_pagas_pagarme = Transaction.where(status: "paid", :created_at.gte => params[:data_inicio],:created_at.lt => params[:data_fim])
    t_pagas_pagseguro = Transaction.where(status: ["3","4"], :lcreated_at.gte => params[:data_inicio], :created_at.lt => params[:data_fim])
    t_pagas_pagarme.each do |t_pm|
      valor_pm += t_pm.amount.to_i/100.00
      if t_pm.payment_method == 'credit_card'
        custo_pm += 1.2
      else
        custo_pm += 3.8
      end
    end

    t_pagas_pagseguro.each do |t_pg|
      valor_ps += t_pg.grossAmount.to_f
      custo_pg += t_pg.feeAmount.to_f
    end
    valor_ps_round = valor_ps.round(2)
    @faturamento = valor_pm + valor_ps_round

    custo_pagamento = custo_pm + custo_pg
    @lucro_bruto = @faturamento - custo_pagamento.round(2)

    render 'partials/bi_dashboard', :layout => false
  end

end