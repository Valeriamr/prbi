class Transaction
  include Mongoid::Document
  include Mongoid::Timestamps # adds created_at and updated_at fields
  include Mongoid::Attributes::Dynamic

  # field <name>, :type => <type>, :default => <value>

  # You can define indexes on documents using the index macro:
  # index :field <, :unique => true>

  # You can create a composite key in mongoid to replace the default id using the key macro:
  # key :field <, :another_field, :one_more ....>

  ##PagSeguro Objeto##
  # Data da criação da transação.
  field :date, type: DateTime
  # Código identificador da transação.
  field :code, type: String
  # Código de referência da transação.
  field :reference, type: String
  # Tipo da transação.
  field :type, type: Integer
  # Status da transação.
  field :status, type: String
  # Data do último evento.
  field :lastEventDate, type: DateTime
  # Meio de pagamento.
  field :paymentMethod, type: Hash
  # Valor bruto da transação.
  field :grossAmount, type: String
  # Valor do desconto dado.
  field :discountAmount, type: String
  # Valor total das taxas cobradas.
  field :feeAmount, type: String
  # Valor líquido da transação.
  field :netAmount, type: String
  # Valor extra.
  field :extraAmount, type: String
  # Data de crédito.
  field :escrowEndDate, type: DateTime
  # Número de parcelas.
  field :installmentCount, type: Integer
  # Número de itens da transação.
  field :itemCount, type: Integer
  # Lista de itens contidos na transação.
  field :items, type: Array
  # Dados do comprador.
  field :sender, type: Hash
  # Dados do frete.
  field :shipping, type: Hash
  #Dados do cupom
  field :cupom, type: String


  ##PagarMe objeto##
  field :obj, type: String #OK
  # field :p_status, type: String #OK
  field :refuse_reason, type: String
  field :status_reason, type: String #OK
  field :acquirer_response_code, type: String #OK
  field :acquirer_name, type: String
  field :authorization_code, type: String #OK
  field :soft_descriptor, type: String #OK
  field :tid, type: String #OK
  field :nsu, type: String #OK
  field :date_created, type: DateTime #OK - Testar
  field :date_updated, type: DateTime #OK - Testar
  field :amount, type: Integer #OK
  field :installments, type: Integer #OK
  field :id_pagarme, type: Integer #OK
  field :cost, type: Integer #OK
  field :card_holder_name, type: String
  field :card_last_digits, type: String
  field :card_first_digits, type: String
  field :card_brand, type: String
  field :postback_url, type: String #OK
  field :payment_method, type: String #OK
  field :antifraud_score
  field :boleto_url, type: String #OK
  field :boleto_barcode, type: String #OK
  field :boleto_expiration_date, type: DateTime #OK - Testar
  field :referer, type: String #OK
  field :ip, type: String #OK
  field :subscription_id, type: Integer #OK
  field :phone, type: Hash #OK
  field :address, type: Hash #OK
  field :customer, type: Hash #OK
  field :card, type: Hash #OK
  field :metadata, type: Hash #OK
  field :antifraud_metadata, type: Hash #OK
  field :plano, type: String

  field :curso, type: String

  ## Analytics Variables ##
  field :utm_source, type: String
  field :utm_medium, type: String
  field :utm_campaign, type: String

  belongs_to :aluno
end
