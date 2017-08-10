class Plano
  include Mongoid::Document
  include Mongoid::Timestamps # adds created_at and updated_at fields

  # field <name>, :type => <type>, :default => <value>

  field :id_plano, :type => Integer
  field :nome, :type => String
  field :descricao, :type => String
  field :estilo, :type => String #Classe CSS
  field :valor, :type => Float
  field :tempo_plano, :type => Integer #Tempo do plano em meses.
  field :produto, :type => String
  field :qtd_correcao_mes, :type => Integer
  field :materiais, :type => String
  

  # You can define indexes on documents using the index macro:
  # index :field <, :unique => true>

  # You can create a composite key in mongoid to replace the default id using the key macro:
  # key :field <, :another_field, :one_more ....>
  has_many :criteos
end
