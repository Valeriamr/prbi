class Voto
  include Mongoid::Document
  include Mongoid::Timestamps # adds created_at and updated_at fields
  # include Mongoid::Paranoia

  # field <name>, :type => <type>, :default => <value>

  # You can define indexes on documents using the index macro:
  # index :field <, :unique => true>

  # You can create a composite key in mongoid to replace the default id using the key macro:
  # key :field <, :another_field, :one_more ....>

  field :valor, type: Float, default: 0.0
  field :likes, type: Float, default: 0.0
  field :comentario, type: String
  field :por_corretor, type: Boolean
  field :estilo, type: String
  field :nota_1, type: Float
  field :nota_2, type: Float
  field :nota_3, type: Float
  field :nota_4, type: Float
  field :nota_5, type: Float
  field :nota_6, type: Float
  field :nota_7, type: Float
  field :nota_8, type: Float
  field :nota_9, type: Float
  field :nota_10, type: Float
  field :feedback_comentario, type: String
  field :feedback_nota, type: Float
  field :nulo, type: Boolean #Anula o voto para redacao
  field :status, type: String
  field :pago, type: Boolean

  validates_presence_of :nota_1, :nota_2, :nota_3, :nota_4, :nota_5

  VALOR_CORRECAO = 350
  VALOR_ANULADA  = 50
  DIFF           = 100

  # track_history   :on => [:fields],
  #                 :modifier_field => :modifier, # adds "belongs_to :modifier" to track who made the change, default is :modifier
  #                 :version_field => :version,   # adds "field :version, :type => Integer" to track current version, default is :version
  #                 :track_create   =>  false,    # track document creation, default is false
  #                 :track_update   =>  true,     # track document updates, default is true
  #                 :track_destroy  =>  true     # track document destruction, default is false


  # Transferencia para corretores no Pagar.me

  # before_save do |doc|
  #   if doc.changed.include?('status') and (doc.status == CORRECAO_PRO_CORRIGIDA or doc.status == CORRECAO_PRO_ANULADA)
  #     if doc.status == CORRECAO_PRO_ANULADA
  #       _amount = VALOR_ANULADA + DIFF
  #       ap PagarMe::Transfer.create(amount: _amount, source_id: 're_ci76i1n2w01crdw16nqy4c3wx', target_id: doc.aluno.id_pagarme)
  #       ap PagarMe::Transfer.create(amount: DIFF, source_id: doc.aluno.id_pagarme, target_id: 're_ci76i1n2w01crdw16nqy4c3wx')
  #     else
  #       _amount = VALOR_CORRECAO
  #       ap PagarMe::Transfer.create(amount: _amount, source_id: 're_ci76i1n2w01crdw16nqy4c3wx', target_id: doc.aluno.id_pagarme)
  #     end
  #   end
  # end

  belongs_to :aluno
  belongs_to :texto

  before_save do |obj|
    if obj.por_corretor == true
      obj.texto.nota = obj.valor
      obj.texto.save
    end
  end

  # belongs_to :comentario
end
