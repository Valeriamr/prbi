class Aluno < Account
  include Mongoid::Document
  include Mongoid::Timestamps # adds created_at and updated_at fields
  include Mongoid::Paranoia
  # include Mongoid::Userstamp::User
  # field <name>, :type => <type>, :default => <value>

  # You can define indexes on documents using the index macro:
  # index :field <, :unique => true>

  # You can create a composite key in mongoid to replace the default id using the key macro:
  # key :field <, :another_field, :one_more ....>
  field :pseudonimo, type: String
  field :sexo, type: String
  field :interesse, type: String
  field :estado, type: String
  field :permite_newsletter, type: Boolean
  field :token, type: String
  field :token_confirm, type: String
  field :mobile_token, type: String
  field :usou_correcao_gratuita, type: Boolean
  field :esta_ativo, type: Boolean, default: false
  field :likes, type: Array
  field :correcoes, type: Array
  field :seguindo, type: Array
  field :last_login, type: Time
  field :e_corretor, type: Boolean
  field :em_avaliacao, type: Boolean
  field :corrige_por_audio, type: Boolean, default: false
  field :plano, type: String
  field :planos, type: Array
  field :nova_compra, type: String
  field :data_inicio_plano, type: DateTime, default: 7258127191
  field :data_expira_plano, type: DateTime, default: 915157591
  field :aguardando_correcao, type: Boolean
  # field :chegou_limite_envios, type: Boolean
  field :api_key
  field :aceitou_termos, type: Boolean
  field :em_correcao, type: Array
  field :gclid
  field :estilo_correcao, type: String
  field :fb_password, type: Boolean
  field :fb_id, type: String
  field :fb_link, type: String
  field :image, type: String
  field :corretores_excluidos, type: Array
  field :registration_from, type: String #1: Facebook pela Web
  #unique device identifier
  field :push_id, type: Array

  #Novidades do site
  field :viu_novidades, type: Boolean
  field :qtd_novidades, type: Integer

  #Notificações
  field :notifications, type: Array
  #[1,"____"] = Corretor recebeu novo feedback recebido
  #[2,"____"] = Aluno recebeu nova correção
  #[3,"____"] = Aluno recebeu uma nova mensagem do corretor
  #[4,"____"] = Temos novidade no site. :)

  # id no pagarme Recipient
  field :id_pagarme

  # Curso do aluno
  field :courses, type: Array
  # Atributos: id_curso, data_expira_plano

  field :telefone, type: String

  # mongoid_userstamp_user reader: :current_aluno

  has_many :transactions
  has_many :votos
  has_many :textos
  has_many :comentarios
  has_one :statistic
  has_one :conta, class_name: 'Contabancaria'
  accepts_nested_attributes_for :conta
end
