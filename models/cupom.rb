class Cupom
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Slug

  field :codigo, type: String
  field :validade, type: DateTime
  field :parceiro, type: String
  field :desconto, type: String
  field :planos, type: Array
  field :comissao, type: Integer

  validates_uniqueness_of   :codigo,    :case_sensitive => false

  validates_presence_of :codigo, :validade, :parceiro, :desconto, :planos
end
