require 'securerandom'

class Texto
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Slug # adds created_at and updated_at fields
  include Mongoid::Paranoia

  # field <name>, :type => <type>, :default => <value>

  # You can define indexes on documents using the index macro:
  # index :field <, :unique => true>

  # You can create a composite key in mongoid to replace the default id using the key macro:
  # key :field <, :another_field, :one_more ....>

  field :titulo, type: String
  field :corpo, type: String
  field :e_anonimo, type: Boolean, default: false
  field :likes, type: Integer, default: 0
  field :avaliado, type: Boolean, default: false
  field :sequencia
  field :status_correcao, type: String
  field :permite_ver_correcao, type: Boolean
  field :tipo_correcao, type: Integer
  field :correcao_integracao, type: Boolean
  field :aprovado, type: Boolean
  field :data_inicio_correcao, type: DateTime, default: 7258127191
  field :data_fim_correcao, type: DateTime, default: 915157591
  field :corretores_excluidos, type: Array
  field :link, type: String
  field :audio, type: Array
  field :img, type: String
  field :correcao_gratuita, type: Boolean
  field :pins, type: Array
  field :nota, type: Float
  field :relator_abuso, type: Array
  field :contador_abuso, type: Integer

  # field :profissional, type: Boolean
  # field :em_correcao, type: Boolean
  # field :corrigido, type: Boolean, default: false
  # field :anulado, type: Boolean, default: false
  # field :reenvio_imagem, type: Boolean, default: false
  # field :homolog, type: Boolean, default: false


  # new
  field :url_notificacao

  # def status_correcao
  #   # ap 'start status_correcao'
  #   result = CORRECAO_GRATUITA
  #   if self.votos.count > 0
  #     result = self.votos.first.status
  #   else
  #     result = CORRECAO_PRO_A_CORRIGIR if self.profissional
  #   end
  #   # ap 'end status_correcao'
  #   result
  # end

  # def status_correcao=(status)
  #   ap "------------#{status}------------"
  #   if self.votos.first
  #     voto = Voto.find(self.votos.first.id.to_s)
  #     ap 'self.votos.first'
  #     voto.status = status
  #     voto.save
  #     ap voto
  #   end
  #   if status == CORRECAO_PRO_CORRIGINDO
  #     self.em_correcao = true
  #   else
  #     self.em_correcao = false
  #   end
  #
  #   if status == CORRECAO_PRO_ANULADA
  #     self.anulado = true
  #   else
  #     self.anulado = false
  #   end
  #
  #   if status == CORRECAO_PRO_REENVIO_IMAGEM
  #     self.reenvio_imagem = true
  #   else
  #     self.reenvio_imagem = false
  #   end
  #
  #   if status == CORRECAO_PRO_CORRIGIDA
  #     self.corrigido = true
  #   else
  #     self.corrigido = false
  #   end
  #
  #   if status == CORRECAO_PRO_HOMOLOG
  #     self.homolog = true
  #   else
  #     self.homolog = false
  #   end
  #
  #   self.profissional = true if [CORRECAO_PRO_A_CORRIGIR, CORRECAO_PRO_REENVIO_IMAGEM, CORRECAO_PRO_ANULADA, CORRECAO_PRO_CORRIGIDA, CORRECAO_PRO_CORRIGINDO, CORRECAO_PRO_HOMOLOG].include?(status)
  #   # ap self.profissional
  # end


  # validations
  validates_presence_of :corpo, :titulo

  def deliver_date
    # ENV['TZ'] = 'BRT'
    BusinessTime::Config.work_hours = {
        :mon => %w(8:00 18:00),
        :tue => %w(8:00 18:00),
        :wed => %w(8:00 18:00),
        :thu => %w(8:00 18:00),
        :fri => %w(8:00 18:00)
    }

    util = 0.business_hour.after(self.created_at.in_time_zone('America/Sao_Paulo')) - 0.hour # - 1.hour
    time = 7.business_days.after(util)
    # ENV['TZ'] = 'UTC'
    time.strftime('%d/%m/%Y às %H:%M')
  end

  slug :titulo

  belongs_to :tema
  belongs_to :aluno
  has_many :votos
  has_many :annotators
  has_many :comentarios
  field :att

  def check_evaluation
    result = [false]
    result += votos.collect { |voto| voto.aluno.e_corretor }.compact.uniq
    result.size == 2 #Size 2 tem correção
  end

  # accepts_nested_attributes_for :att, :allow_destroy => true

  before_save { verify_b_payment }

  before_create { generate_seq }

  def generate_seq
    self.sequencia = SecureRandom.hex(5)
  end


  def verify_b_payment
    if self.status_correcao_changed? and (self.status_correcao_change[1] == CORRECAO_PRO_CORRIGIDA or self.status_correcao_change[1] == CORRECAO_PRO_ANULADA)
      # if self.status_correcao_change[1] == CORRECAO_PRO_ANULADA
      #   voto = Voto.new
      #   voto.aluno = current_account.id
      #   voto.texto = self.id
      #   voto.nota_1 = 0.0
      #   voto.nota_2 = 0.0
      #   voto.nota_3 = 0.0
      #   voto.nota_4 = 0.0
      #   voto.nota_5 = 0.0
      #   voto.por_corretor = true
      #   voto.status = self.status_correcao_change[1]
      #
      #   self.votos.push(voto)
      # end
      if self.votos.first
        voto = Voto.find(self.votos.first.id.to_s)
        # ap 'self.votos.first'
        voto.status = self.status_correcao_change[1]
        voto.save
      end
    end

    #   ap _status = status_correcao_change
    #   if _status[0] != CORRECAO_PRO_CORRIGIDA and _status[1] == CORRECAO_PRO_CORRIGIDA
    #     config = YAML.load_file("#{PADRINO_ROOT}/config/config.yaml")
    #
    #     ap ids = votos.collect { |voto| voto.aluno.id_pagarme if voto.por_corretor }.compact
    #
    #     ap PagarMe::Balance.balance
    #
    #     if ids.size == 1
    #       recipient_id = ids.first
    #       PagarMe::Recipient.find(recipient_id).receive config['valor_correcao']
    #     end
    #
    #   end
    #
  end
end
